// Issues the nightly Routine commits to the repo's queue folder on GitHub.
// Read straight from raw.githubusercontent.com / api.github.com, no token
// needed: the repository is public and the issue is public at 7 AM anyway.

export const QUEUE_REPO = 'idontreallyknow-20/newsletter'
const RAW = `https://raw.githubusercontent.com/${QUEUE_REPO}`
// The nightly Routine commits to the `queue` branch, which does not trigger a
// Vercel deploy. `main` is checked second so a hand-committed file also works.
export const QUEUE_REFS = ['queue', 'main'] as const

export interface QueuedIssue { subject: string; bodyMarkdown: string; previewText: string }

export function normalizeQueued(j: { subject?: string; bodyMarkdown?: string; previewText?: string }): QueuedIssue | null {
  if (!j.subject || !j.bodyMarkdown || j.bodyMarkdown.length < 200) return null
  const bodyMarkdown = j.bodyMarkdown.replace(/—|–/g, ', ').trim()
  const previewText = (j.previewText || bodyMarkdown.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('#')) || '')
    .replace(/[*_`]/g, '').slice(0, 140)
  return { subject: j.subject.trim().slice(0, 200), bodyMarkdown, previewText }
}

/** A draft committed to the repo's queue folder for this date, if any. */
export async function queuedFromGitHub(issueDate: string, lang: 'en' | 'zh'): Promise<QueuedIssue | null> {
  for (const ref of QUEUE_REFS) {
    try {
      const res = await fetch(`${RAW}/${ref}/queue/${issueDate}.${lang}.json?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(8_000) })
      if (!res.ok) continue
      const parsed = normalizeQueued(await res.json())
      if (parsed) return parsed
    } catch { /* try the next ref */ }
  }
  return null
}

/** Every date that has an English file in queue/ on the queue branch, newest first. */
export async function listQueuedDates(): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${QUEUE_REPO}/contents/queue?ref=queue`, {
      cache: 'no-store', signal: AbortSignal.timeout(8_000),
      headers: { accept: 'application/vnd.github+json', 'user-agent': 'dailybriefhq' },
    })
    if (!res.ok) return []
    const files = await res.json() as Array<{ name: string }>
    return files
      .map(f => /^(\d{4}-\d{2}-\d{2})\.en\.json$/.exec(f.name)?.[1])
      .filter((d): d is string => !!d)
      .sort()
      .reverse()
  } catch { return [] }
}
