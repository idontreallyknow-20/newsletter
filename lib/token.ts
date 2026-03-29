import { createHmac, timingSafeEqual } from 'crypto'

/** Derive a deterministic session token from the admin password (never stores the password itself). */
export function deriveSessionToken(password: string): string {
  return createHmac('sha256', password).update('nhq_session_v1').digest('hex')
}

/** Sign an email address for use in unsubscribe / preferences URLs. */
export function signEmailToken(email: string, secret: string): string {
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
}

/** Verify a signed email token using constant-time comparison. */
export function verifyEmailToken(email: string, token: string, secret: string): boolean {
  try {
    const expected = Buffer.from(signEmailToken(email, secret), 'hex')
    const actual = Buffer.from(token, 'hex')
    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
