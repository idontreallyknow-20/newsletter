// Simple sliding-window rate limiter using an in-memory Map.
// In a serverless environment each instance has its own memory, so this
// limits abuse within a single instance. For stricter enforcement use a
// Redis-backed solution (e.g. Upstash) in production.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()
let lastClean = Date.now()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()

  // Prune expired entries every 5 minutes to prevent unbounded growth
  if (now - lastClean > 5 * 60_000) {
    store.forEach((v, k) => {
      if (v.resetAt < now) store.delete(k)
    })
    lastClean = now
  }

  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
