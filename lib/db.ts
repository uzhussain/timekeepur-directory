import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export interface GuestbookMessage {
  id: number
  name: string
  email: string | null
  message: string
  original_message: string | null
  enhanced_type: 'original' | 'emoji' | 'translated'
  language: string
  status: 'pending' | 'approved' | 'rejected'
  moderation_notes: string | null
  moderated_by: string | null
  created_at: string
  updated_at: string
  approved_at: string | null
}

export async function getApprovedMessages(): Promise<GuestbookMessage[]> {
  const messages = await sql`
    SELECT * FROM guestbook_messages 
    WHERE status = 'approved' 
    ORDER BY approved_at DESC
    LIMIT 100
  `
  return messages as GuestbookMessage[]
}

export async function getPendingMessages(): Promise<GuestbookMessage[]> {
  const messages = await sql`
    SELECT * FROM guestbook_messages 
    WHERE status = 'pending' 
    ORDER BY created_at DESC
  `
  return messages as GuestbookMessage[]
}

export async function getAllMessages(): Promise<GuestbookMessage[]> {
  const messages = await sql`
    SELECT * FROM guestbook_messages 
    ORDER BY created_at DESC
    LIMIT 200
  `
  return messages as GuestbookMessage[]
}

export async function createMessage(data: {
  name: string
  email?: string
  message: string
  original_message?: string
  enhanced_type?: string
  language?: string
}): Promise<GuestbookMessage> {
  const result = await sql`
    INSERT INTO guestbook_messages (name, email, message, original_message, enhanced_type, language)
    VALUES (
      ${data.name}, 
      ${data.email || null}, 
      ${data.message}, 
      ${data.original_message || null},
      ${data.enhanced_type || 'original'},
      ${data.language || 'en'}
    )
    RETURNING *
  `
  return result[0] as GuestbookMessage
}

export async function updateMessageStatus(
  id: number, 
  status: 'approved' | 'rejected',
  moderatedBy: string,
  notes?: string
): Promise<GuestbookMessage> {
  const now = new Date().toISOString()
  const result = await sql`
    UPDATE guestbook_messages 
    SET 
      status = ${status},
      moderated_by = ${moderatedBy},
      moderation_notes = ${notes || null},
      updated_at = ${now},
      approved_at = ${status === 'approved' ? now : null}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as GuestbookMessage
}
