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
