import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockVerifyAdminCredentials, mockCreateSession } = vi.hoisted(() => ({
  mockVerifyAdminCredentials: vi.fn(),
  mockCreateSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  verifyAdminCredentials: mockVerifyAdminCredentials,
  createSession: mockCreateSession,
}))

import { POST } from '@/app/api/admin/login/route'

function makeRequest(payload: unknown) {
  return new Request('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

describe('/api/admin/login POST', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when email or password is missing', async () => {
    const response = await POST(makeRequest({ email: '', password: '' }))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ error: 'Email and password are required' })
  })

  it('returns 401 for invalid credentials', async () => {
    mockVerifyAdminCredentials.mockResolvedValueOnce(false)

    const response = await POST(
      makeRequest({ email: 'admin@example.com', password: 'wrong' })
    )
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ error: 'Invalid credentials' })
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('returns 200 and creates session for valid credentials', async () => {
    mockVerifyAdminCredentials.mockResolvedValueOnce(true)

    const response = await POST(
      makeRequest({ email: 'admin@example.com', password: 'correct' })
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true })
    expect(mockCreateSession).toHaveBeenCalledWith('admin@example.com')
  })
})
