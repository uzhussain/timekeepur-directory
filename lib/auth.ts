import { cookies } from 'next/headers'
import { sql } from './db'

const ADMIN_SESSION_COOKIE = 'admin_session'

// Simple admin credentials - in production, use proper hashing
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@timekeepur.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export async function createSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  // Store session in database
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    
    await sql`
      INSERT INTO admin_sessions (id, email, expires_at)
      VALUES (${sessionId}, ${email}, ${expiresAt.toISOString()})
    `
  } catch (error) {
    console.error('[v0] Failed to create session:', error)
  }
  
  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
  
  return sessionId
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  
  if (!sessionId) {
    return null
  }
  
  try {
    const result = await sql`
      SELECT email, expires_at FROM admin_sessions 
      WHERE id = ${sessionId} AND expires_at > NOW()
    `
    
    if (result.length === 0) {
      return null
    }
    
    return { email: result[0].email as string }
  } catch (error) {
    // Table might not exist yet
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  
  if (sessionId) {
    try {
      await sql`DELETE FROM admin_sessions WHERE id = ${sessionId}`
    } catch (error) {
      // Ignore errors
    }
  }
  
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
