'use server'

import { generateText, Output } from 'ai'
import { z } from 'zod'

const ModerationSchema = z.object({
  isAppropriate: z.boolean(),
  reason: z.string().nullable(),
  confidence: z.number(),
})

const TranslationSchema = z.object({
  translatedText: z.string(),
  detectedLanguage: z.string().nullable(),
})

const EmojiSchema = z.object({
  emojiMessage: z.string(),
})

export async function moderateMessage(message: string): Promise<{
  isAppropriate: boolean
  reason: string | null
  confidence: number
}> {
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    system: `You are a content moderator for a public guestbook. 
Analyze the message for:
- Inappropriate language (profanity, slurs, hate speech)
- Spam or promotional content
- Personal information exposure (emails, phone numbers, addresses)
- Harmful or threatening content
- Adult or explicit content

Be lenient with casual language but strict with harmful content.`,
    prompt: `Moderate this guestbook message: "${message}"`,
    output: Output.object({
      schema: ModerationSchema,
    }),
  })

  return result.output
}

export async function translateMessage(message: string, targetLanguage: string): Promise<{
  translatedText: string
  detectedLanguage: string | null
}> {
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    system: `You are a professional translator. Translate the given message accurately while preserving the original tone and meaning.`,
    prompt: `Translate this message to ${targetLanguage}: "${message}"`,
    output: Output.object({
      schema: TranslationSchema,
    }),
  })

  return result.output
}

export async function convertToEmoji(message: string): Promise<{
  emojiMessage: string
}> {
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    system: `You are a creative emoji artist. Convert text messages into expressive emoji sequences that capture the meaning and emotion. Use only emojis, no text. Keep it fun and readable.`,
    prompt: `Convert this message to emojis only: "${message}"`,
    output: Output.object({
      schema: EmojiSchema,
    }),
  })

  return result.output
}
