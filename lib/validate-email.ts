// Canonical form used everywhere an address is stored, looked up, or signed —
// keeps DB lookups and HMAC email tokens consistent regardless of how the
// address was typed.
export function normalizeEmail(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

// Basic email validation. Good enough for a newsletter — intentionally
// permissive to avoid rejecting valid addresses from unusual TLDs.
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  const at = email.lastIndexOf('@')
  if (at < 1) return false                       // nothing before @
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (local.length > 64) return false            // RFC 5321 local-part limit
  if (!domain.includes('.')) return false        // no TLD
  if (domain.startsWith('.') || domain.endsWith('.')) return false
  if (/\s/.test(email)) return false             // no whitespace anywhere
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}
