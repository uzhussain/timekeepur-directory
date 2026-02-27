'use server'

import { createMessage, updateMessageStatus } from '@/lib/db'
import { moderateMessage, translateMessage, convertToEmoji } from './ai-actions'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export type SubmitResult = {
  success: boolean
  message?: string
  error?: string
  moderationPassed?: boolean
}

function revalidateGuestbookViews() {
  // Keep the public feed and homepage preview in sync after moderation events.
  revalidatePath('/guestbook')
  revalidatePath('/')
}

export async function submitGuestbookMessage(formData: FormData): Promise<SubmitResult> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const message = formData.get('message') as string
  const enhanceType = formData.get('enhanceType') as string | null
  const targetLanguage = formData.get('targetLanguage') as string | null

  if (!name || !message) {
    return { success: false, error: 'Name and message are required' }
  }

  if (name.length > 100) {
    return { success: false, error: 'Name must be 100 characters or less' }
  }

  if (message.length > 1000) {
    return { success: false, error: 'Message must be 1000 characters or less' }
  }

  try {
    // AI Moderation check
    const moderation = await moderateMessage(message)
    
    if (!moderation.isAppropriate) {
      return { 
        success: false, 
        error: `Your message was flagged by our AI moderator: ${moderation.reason || 'Content policy violation'}`,
        moderationPassed: false
      }
    }

    let finalMessage = message
    let originalMessage: string | undefined
    let enhancedType = 'original'
    let language = 'en'

    // Apply AI enhancements if requested
    if (enhanceType === 'emoji') {
      const emojiResult = await convertToEmoji(message)
      originalMessage = message
      finalMessage = emojiResult.emojiMessage
      enhancedType = 'emoji'
    } else if (enhanceType === 'translate' && targetLanguage) {
      const translationResult = await translateMessage(message, targetLanguage)
      originalMessage = message
      finalMessage = translationResult.translatedText
      enhancedType = 'translated'
      language = targetLanguage
    }

    // Create the message with pending status
    await createMessage({
      name,
      email: email || undefined,
      message: finalMessage,
      original_message: originalMessage,
      enhanced_type: enhancedType,
      language,
    })

    revalidateGuestbookViews()

    return { 
      success: true, 
      message: 'Your message has been submitted and is awaiting admin approval!',
      moderationPassed: true
    }
  } catch (error) {
    console.error('Error submitting message:', error)
    return { success: false, error: 'Failed to submit message. Please try again.' }
  }
}

export async function approveMessage(id: number, notes?: string): Promise<SubmitResult> {
  const session = await getSession()
  
  if (!session) {
    return { success: false, error: 'Unauthorized - admin login required' }
  }

  try {
    await updateMessageStatus(id, 'approved', session.email, notes)
    revalidateGuestbookViews()
    revalidatePath('/admin')
    return { success: true, message: 'Message approved successfully' }
  } catch (error) {
    console.error('Error approving message:', error)
    return { success: false, error: 'Failed to approve message' }
  }
}

export async function rejectMessage(id: number, notes?: string): Promise<SubmitResult> {
  const session = await getSession()
  
  if (!session) {
    return { success: false, error: 'Unauthorized - admin login required' }
  }

  try {
    await updateMessageStatus(id, 'rejected', session.email, notes)
    revalidateGuestbookViews()
    revalidatePath('/admin')
    return { success: true, message: 'Message rejected' }
  } catch (error) {
    console.error('Error rejecting message:', error)
    return { success: false, error: 'Failed to reject message' }
  }
}
