import { describe, it, expect } from 'vitest'
import { subscriberFrequenciesFor, scheduleToSendType } from '../preferences'

describe('subscriberFrequenciesFor', () => {
  it('weekly send includes weekly and both', () => {
    expect(subscriberFrequenciesFor('weekly')).toContain('weekly')
    expect(subscriberFrequenciesFor('weekly')).toContain('both')
    expect(subscriberFrequenciesFor('weekly')).not.toContain('daily')
  })

  it('daily send includes daily and both', () => {
    expect(subscriberFrequenciesFor('daily')).toContain('daily')
    expect(subscriberFrequenciesFor('daily')).toContain('both')
    expect(subscriberFrequenciesFor('daily')).not.toContain('weekly')
  })
})

describe('scheduleToSendType', () => {
  it('maps weekly → weekly', () => expect(scheduleToSendType('weekly')).toBe('weekly'))
  it('maps daily → daily',   () => expect(scheduleToSendType('daily')).toBe('daily'))
  it('maps weekdays → daily', () => expect(scheduleToSendType('weekdays')).toBe('daily'))
  it('maps manual → null',   () => expect(scheduleToSendType('manual')).toBeNull())
})
