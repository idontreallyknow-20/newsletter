export type Language = 'en' | 'zh'
export type SubscriberFrequency = 'weekly' | 'daily' | 'both'

export const LANGUAGES: { value: Language; label: string; sub: string }[] = [
  { value: 'en', label: 'English', sub: 'English' },
  { value: 'zh', label: '中文', sub: 'Simplified Chinese' },
]

export const FREQUENCIES: { value: SubscriberFrequency; label: string; sub: string }[] = [
  { value: 'weekly', label: 'Weekly deep-dive', sub: 'One long-form article per week' },
  { value: 'daily', label: 'Daily updates', sub: 'AI & economy briefing every day' },
  { value: 'both', label: 'Both', sub: 'Weekly + daily briefings' },
]

// Which subscriber frequencies should receive a given send type
export function subscriberFrequenciesFor(sendType: 'weekly' | 'daily'): SubscriberFrequency[] {
  return [sendType, 'both']
}

// Map a schedule_frequency value (from settings/cron) to a subscriber send type.
// Keeps the two type systems in sync in one place.
export type ScheduleFrequency = 'daily' | 'weekdays' | 'weekly' | 'manual'
export function scheduleToSendType(freq: ScheduleFrequency): 'weekly' | 'daily' | null {
  if (freq === 'weekly') return 'weekly'
  if (freq === 'daily' || freq === 'weekdays') return 'daily'
  return null  // 'manual' — send to all active subscribers
}
