import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGenerateText, mockOutputObject } = vi.hoisted(() => ({
  mockGenerateText: vi.fn(),
  mockOutputObject: vi.fn((args: unknown) => args),
}))

vi.mock('ai', () => ({
  generateText: mockGenerateText,
  Output: {
    object: mockOutputObject,
  },
}))

import { convertToEmoji, moderateMessage, translateMessage } from '@/app/actions/ai-actions'

describe('ai-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('moderateMessage returns structured moderation output', async () => {
    const expected = {
      isAppropriate: true,
      reason: null,
      confidence: 0.91,
    }
    mockGenerateText.mockResolvedValueOnce({ output: expected })

    const result = await moderateMessage('Hello world')

    expect(result).toEqual(expected)
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'openai/gpt-4o-mini',
      })
    )
  })

  it('translateMessage returns translated text output', async () => {
    const expected = {
      translatedText: 'Bonjour le monde',
      detectedLanguage: 'en',
    }
    mockGenerateText.mockResolvedValueOnce({ output: expected })

    const result = await translateMessage('Hello world', 'fr')

    expect(result).toEqual(expected)
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Translate this message to fr'),
      })
    )
  })

  it('convertToEmoji returns emoji message output', async () => {
    const expected = {
      emojiMessage: '👋🌍',
    }
    mockGenerateText.mockResolvedValueOnce({ output: expected })

    const result = await convertToEmoji('Hello world')

    expect(result).toEqual(expected)
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Convert this message to emojis only'),
      })
    )
  })
})
