// Everything about "when does the issue go out" lives here.
//
// The model: each calendar day in Toronto is one "issue date" (YYYY-MM-DD).
// Cron jobs do not check the clock. They ask "has today's step been done yet?"
// and the database answers. That makes the schedule immune to Vercel's
// imprecise Hobby cron timing and safe to trigger twice.

export const NEWSLETTER_TZ = 'America/Toronto'

export type ScheduleFrequency = 'daily' | 'weekdays' | 'manual'

export interface ScheduleSettings {
  schedule_frequency?: string
  autosend_enabled?: string // 'true' | 'false'
}

/** Calendar date (YYYY-MM-DD) for `now` in the newsletter's timezone. */
export function getIssueDate(now: Date = new Date(), tz: string = NEWSLETTER_TZ): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** 0 = Sunday ... 6 = Saturday, for a YYYY-MM-DD issue date. */
export function weekdayOf(issueDate: string): number {
  const [y, m, d] = issueDate.split('-').map(Number)
  // Use UTC noon so the weekday is unaffected by the host timezone.
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()
}

export function normalizeFrequency(value: string | undefined): ScheduleFrequency {
  if (value === 'daily' || value === 'weekdays') return value
  return 'manual'
}

export function isSendDay(frequency: string | undefined, issueDate: string): boolean {
  const f = normalizeFrequency(frequency)
  if (f === 'manual') return false
  if (f === 'daily') return true
  const day = weekdayOf(issueDate)
  return day >= 1 && day <= 5
}

export type SendBlockReason =
  | 'autosend_off'
  | 'manual'
  | 'not_send_day'
  | 'no_draft'
  | 'no_preview'
  | 'skipped'
  | 'already_sent'

export type SendDecision = { ok: true } | { ok: false; reason: SendBlockReason }

export interface DraftState {
  bodyMarkdown?: string | null
  previewSentAt?: Date | null
  skippedAt?: Date | null
}

/**
 * Decide whether the send cron may send today's issue.
 * Reasons are ordered from "configuration" to "state" so the dashboard can
 * tell the owner the most useful thing first.
 */
export function evaluateSend(input: {
  settings: ScheduleSettings
  issueDate: string
  draft: DraftState | null | undefined
  alreadySent: boolean
}): SendDecision {
  const { settings, issueDate, draft, alreadySent } = input
  if (settings.autosend_enabled !== 'true') return { ok: false, reason: 'autosend_off' }
  const f = normalizeFrequency(settings.schedule_frequency)
  if (f === 'manual') return { ok: false, reason: 'manual' }
  if (!isSendDay(f, issueDate)) return { ok: false, reason: 'not_send_day' }
  if (alreadySent) return { ok: false, reason: 'already_sent' }
  if (!draft || !draft.bodyMarkdown) return { ok: false, reason: 'no_draft' }
  if (draft.skippedAt) return { ok: false, reason: 'skipped' }
  if (!draft.previewSentAt) return { ok: false, reason: 'no_preview' }
  return { ok: true }
}

export const SEND_REASON_TEXT: Record<SendBlockReason, string> = {
  autosend_off: 'Automatic sending is switched off.',
  manual: 'Frequency is set to off. Nothing sends on its own.',
  not_send_day: 'Not a send day (weekdays only).',
  no_draft: "No draft exists for today's issue yet.",
  no_preview: 'The preview copy never reached you, so the send was held.',
  skipped: "You skipped today's issue.",
  already_sent: "Today's issue already went out.",
}

/** Human label for the next scheduled send, e.g. "Tomorrow, about 7:00 AM Toronto". */
export function nextSendLabel(settings: ScheduleSettings, now: Date = new Date()): string {
  if (settings.autosend_enabled !== 'true') return 'Automatic sending is off'
  const f = normalizeFrequency(settings.schedule_frequency)
  if (f === 'manual') return 'Frequency is off'
  const today = getIssueDate(now)
  // Walk forward up to 7 days to find the next send day.
  const [y, m, d] = today.split('-').map(Number)
  for (let i = 0; i < 8; i++) {
    const candidate = new Date(Date.UTC(y, m - 1, d + i, 12))
    const iso = candidate.toISOString().slice(0, 10)
    if (!isSendDay(f, iso)) continue
    // Today's slot counts only if it's still before ~7 AM Toronto.
    if (i === 0) {
      const hour = Number(new Intl.DateTimeFormat('en-CA', { timeZone: NEWSLETTER_TZ, hour: '2-digit', hour12: false }).format(now))
      if (hour >= 7) continue
      return 'Today, about 7:00 AM Toronto'
    }
    if (i === 1) return 'Tomorrow, about 7:00 AM Toronto'
    const weekday = candidate.toLocaleDateString('en-CA', { weekday: 'long', timeZone: 'UTC' })
    return `${weekday}, about 7:00 AM Toronto`
  }
  return 'No send scheduled'
}
