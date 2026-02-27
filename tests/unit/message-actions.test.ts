import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockCreateMessage,
  mockUpdateMessageStatus,
  mockGetSession,
  mockModerateMessage,
  mockTranslateMessage,
  mockConvertToEmoji,
} = vi.hoisted(() => ({
  mockCreateMessage: vi.fn(),
  mockUpdateMessageStatus: vi.fn(),
  mockGetSession: vi.fn(),
  mockModerateMessage: vi.fn(),
  mockTranslateMessage: vi.fn(),
  mockConvertToEmoji: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  createMessage: mockCreateMessage,
  updateMessageStatus: mockUpdateMessageStatus,
}))

vi.mock('@/lib/auth', () => ({
  getSession: mockGetSession,
}))

vi.mock('@/app/actions/ai-actions', () => ({
  moderateMessage: mockModerateMessage,
  translateMessage: mockTranslateMessage,
  convertToEmoji: mockConvertToEmoji,
}))

import { approveMessage, rejectMessage, submitGuestbookMessage } from '@/app/actions/message-actions'

describe('submitGuestbookMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockModerateMessage.mockResolvedValue({
      isAppropriate: true,
      reason: null,
      confidence: 0.99,
    })
  })

  it('rejects when required fields are missing', async () => {
    const formData = new FormData()
    formData.set('name', '')
    formData.set('message', '')

    const result = await submitGuestbookMessage(formData)

    expect(result).toEqual({
      success: false,
      error: 'Name and message are required',
    })
    expect(mockCreateMessage).not.toHaveBeenCalled()
  })

  it('does not save when moderation fails', async () => {
    mockModerateMessage.mockResolvedValueOnce({
      isAppropriate: false,
      reason: 'Spam content',
      confidence: 0.97,
    })

    const formData = new FormData()
    formData.set('name', 'Uzair')
    formData.set('message', 'Buy now')

    const result = await submitGuestbookMessage(formData)

    expect(result.success).toBe(false)
    expect(result.moderationPassed).toBe(false)
    expect(mockCreateMessage).not.toHaveBeenCalled()
  })

  it('saves emoji-enhanced message correctly', async () => {
    mockConvertToEmoji.mockResolvedValueOnce({
      emojiMessage: '🎉✨🙌',
    })

    const formData = new FormData()
    formData.set('name', 'Uzair')
    formData.set('message', 'Great work team')
    formData.set('enhanceType', 'emoji')

    const result = await submitGuestbookMessage(formData)

    expect(result.success).toBe(true)
    expect(mockCreateMessage).toHaveBeenCalledWith({
      name: 'Uzair',
      email: undefined,
      message: '🎉✨🙌',
      original_message: 'Great work team',
      enhanced_type: 'emoji',
      language: 'en',
    })
  })

  it('saves translated message correctly', async () => {
    mockTranslateMessage.mockResolvedValueOnce({
      translatedText: 'Hola mundo',
      detectedLanguage: 'en',
    })

    const formData = new FormData()
    formData.set('name', 'Uzair')
    formData.set('message', 'Hello world')
    formData.set('enhanceType', 'translate')
    formData.set('targetLanguage', 'es')

    const result = await submitGuestbookMessage(formData)

    expect(result.success).toBe(true)
    expect(mockCreateMessage).toHaveBeenCalledWith({
      name: 'Uzair',
      email: undefined,
      message: 'Hola mundo',
      original_message: 'Hello world',
      enhanced_type: 'translated',
      language: 'es',
    })
  })
})

describe('approveMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthorized when no session exists', async () => {
    mockGetSession.mockResolvedValueOnce(null)

    const result = await approveMessage(1)

    expect(result).toEqual({
      success: false,
      error: 'Unauthorized - admin login required',
    })
    expect(mockUpdateMessageStatus).not.toHaveBeenCalled()
  })

  it('updates status when session exists', async () => {
    mockGetSession.mockResolvedValueOnce({ email: 'admin@example.com' })

    const result = await approveMessage(1, 'Looks good')

    expect(result.success).toBe(true)
    expect(mockUpdateMessageStatus).toHaveBeenCalledWith(
      1,
      'approved',
      'admin@example.com',
      'Looks good'
    )
  })
})

describe('rejectMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthorized when no session exists', async () => {
    mockGetSession.mockResolvedValueOnce(null)

    const result = await rejectMessage(2)

    expect(result).toEqual({
      success: false,
      error: 'Unauthorized - admin login required',
    })
    expect(mockUpdateMessageStatus).not.toHaveBeenCalled()
  })

  it('updates status when session exists', async () => {
    mockGetSession.mockResolvedValueOnce({ email: 'admin@example.com' })

    const result = await rejectMessage(2, 'Policy violation')

    expect(result.success).toBe(true)
    expect(mockUpdateMessageStatus).toHaveBeenCalledWith(
      2,
      'rejected',
      'admin@example.com',
      'Policy violation'
    )
  })
})
