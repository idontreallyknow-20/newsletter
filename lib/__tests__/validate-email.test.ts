import { describe, it, expect } from 'vitest'
import { isValidEmail } from '../validate-email'

describe('isValidEmail', () => {
  it('accepts standard addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user+tag@sub.domain.co.uk')).toBe(true)
    expect(isValidEmail('a@b.io')).toBe(true)
  })

  it('rejects missing @', () => {
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('missing-at-sign.com')).toBe(false)
  })

  it('rejects missing TLD', () => {
    expect(isValidEmail('user@nodot')).toBe(false)
  })

  it('rejects whitespace', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
    expect(isValidEmail('user@ example.com')).toBe(false)
  })

  it('rejects empty and oversized', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('a'.repeat(65) + '@example.com')).toBe(false)
    expect(isValidEmail('user@' + 'a'.repeat(250) + '.com')).toBe(false)
  })

  it('rejects dot-edge domains', () => {
    expect(isValidEmail('user@.example.com')).toBe(false)
    expect(isValidEmail('user@example.')).toBe(false)
  })
})
