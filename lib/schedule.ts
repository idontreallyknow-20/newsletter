export type Frequency = 'daily' | 'weekdays' | 'weekly' | 'manual'

export interface ScheduleSettings {
  schedule_frequency: Frequency
  schedule_time_hour: string // '0'–'23' (UTC)
  schedule_day: string       // '0'–'6' (0=Sunday), used when weekly
}

export function shouldSendNow(settings: Partial<ScheduleSettings>, now: Date = new Date()): boolean {
  const frequency = (settings.schedule_frequency || 'manual') as Frequency
  if (frequency === 'manual') return false

  const currentHour = now.getUTCHours()
  const currentDay = now.getUTCDay()
  const configuredHour = parseInt(settings.schedule_time_hour || '8', 10)

  if (currentHour !== configuredHour) return false

  if (frequency === 'daily') return true
  if (frequency === 'weekdays') return currentDay >= 1 && currentDay <= 5
  if (frequency === 'weekly') {
    const configuredDay = parseInt(settings.schedule_day || '1', 10)
    return currentDay === configuredDay
  }

  return false
}

export function getNextSendTimes(settings: Partial<ScheduleSettings>, count = 5): Date[] {
  const frequency = (settings.schedule_frequency || 'manual') as Frequency
  if (frequency === 'manual') return []

  const configuredHour = parseInt(settings.schedule_time_hour || '8', 10)
  const configuredDay = parseInt(settings.schedule_day || '1', 10)

  const times: Date[] = []
  const cursor = new Date()
  cursor.setUTCHours(configuredHour, 0, 0, 0)

  // Start from next hour slot if we've already passed today's
  if (cursor <= new Date()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  let attempts = 0
  while (times.length < count && attempts < 60) {
    attempts++
    const day = cursor.getUTCDay()
    let matches = false
    if (frequency === 'daily') matches = true
    if (frequency === 'weekdays') matches = day >= 1 && day <= 5
    if (frequency === 'weekly') matches = day === configuredDay

    if (matches) times.push(new Date(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return times
}
