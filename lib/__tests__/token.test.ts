import { describe, it, expect } from 'vitest'
import { signActionToken, verifyActionToken, signEmailToken, verifyEmailToken } from '../token'

describe('action tokens', () => {
  const secret = 'test-secret'
  it('round-trips for the same action', () => {
    const t = signActionToken('skip:2026-09-07', secret)
    expect(verifyActionToken('skip:2026-09-07', t, secret)).toBe(true)
  })
  it('rejects a different date, action, or secret', () => {
    const t = signActionToken('skip:2026-09-07', secret)
    expect(verifyActionToken('skip:2026-09-08', t, secret)).toBe(false)
    expect(verifyActionToken('send:2026-09-07', t, secret)).toBe(false)
    expect(verifyActionToken('skip:2026-09-07', t, 'other')).toBe(false)
  })
  it('rejects garbage without throwing', () => {
    expect(verifyActionToken('skip:2026-09-07', 'zz', secret)).toBe(false)
    expect(verifyActionToken('skip:2026-09-07', '', secret)).toBe(false)
  })
  it('does not collide with email tokens', () => {
    expect(signActionToken('a@b.com', secret)).not.toBe(signEmailToken('a@b.com', secret))
    expect(verifyEmailToken('a@b.com', signActionToken('a@b.com', secret), secret)).toBe(false)
  })
})
