import { describe, it, expect } from 'vitest'
import { getIssueDate, isSendDay, evaluateSend, weekdayOf, nextSendLabel } from '../schedule'

describe('getIssueDate', () => {
  it('uses the Toronto calendar day, not UTC', () => {
    // 03:30 UTC on Sept 6 is 23:30 EDT on Sept 5
    expect(getIssueDate(new Date('2026-09-06T03:30:00Z'))).toBe('2026-09-05')
    expect(getIssueDate(new Date('2026-09-06T04:30:00Z'))).toBe('2026-09-06')
  })

  it('handles the spring-forward DST boundary (2026-03-08)', () => {
    // 04:30 UTC is still 23:30 EST on March 7 (offset -5 before 2 AM)
    expect(getIssueDate(new Date('2026-03-08T04:30:00Z'))).toBe('2026-03-07')
    // 11:00 UTC on March 8 is 7:00 AM EDT
    expect(getIssueDate(new Date('2026-03-08T11:00:00Z'))).toBe('2026-03-08')
  })

  it('handles the fall-back DST boundary (2026-11-01)', () => {
    expect(getIssueDate(new Date('2026-11-01T04:30:00Z'))).toBe('2026-11-01')
    expect(getIssueDate(new Date('2026-11-02T04:30:00Z'))).toBe('2026-11-01')
    expect(getIssueDate(new Date('2026-11-02T05:30:00Z'))).toBe('2026-11-02')
  })
})

describe('isSendDay', () => {
  it('computes the weekday from the issue date itself', () => {
    expect(weekdayOf('2026-09-05')).toBe(6) // Saturday
    expect(weekdayOf('2026-09-07')).toBe(1) // Monday
  })
  it('weekdays only sends Monday to Friday', () => {
    expect(isSendDay('weekdays', '2026-09-05')).toBe(false)
    expect(isSendDay('weekdays', '2026-09-06')).toBe(false)
    expect(isSendDay('weekdays', '2026-09-07')).toBe(true)
  })
  it('daily always sends, manual never does', () => {
    expect(isSendDay('daily', '2026-09-05')).toBe(true)
    expect(isSendDay('manual', '2026-09-07')).toBe(false)
    expect(isSendDay(undefined, '2026-09-07')).toBe(false)
    expect(isSendDay('weekly', '2026-09-07')).toBe(false) // legacy value treated as off
  })
})

describe('evaluateSend', () => {
  const on = { autosend_enabled: 'true', schedule_frequency: 'daily' }
  const readyDraft = { bodyMarkdown: '# hi', previewSentAt: new Date(), skippedAt: null }

  it('sends when everything is in place', () => {
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: readyDraft, alreadySent: false })).toEqual({ ok: true })
  })
  it('blocks when autosend is off', () => {
    expect(evaluateSend({ settings: { ...on, autosend_enabled: 'false' }, issueDate: '2026-09-07', draft: readyDraft, alreadySent: false }))
      .toEqual({ ok: false, reason: 'autosend_off' })
    expect(evaluateSend({ settings: {}, issueDate: '2026-09-07', draft: readyDraft, alreadySent: false }))
      .toEqual({ ok: false, reason: 'autosend_off' })
  })
  it('blocks on manual frequency and off days', () => {
    expect(evaluateSend({ settings: { ...on, schedule_frequency: 'manual' }, issueDate: '2026-09-07', draft: readyDraft, alreadySent: false }))
      .toEqual({ ok: false, reason: 'manual' })
    expect(evaluateSend({ settings: { ...on, schedule_frequency: 'weekdays' }, issueDate: '2026-09-05', draft: readyDraft, alreadySent: false }))
      .toEqual({ ok: false, reason: 'not_send_day' })
  })
  it('blocks on already sent, missing draft, skipped, and missing preview', () => {
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: readyDraft, alreadySent: true })).toEqual({ ok: false, reason: 'already_sent' })
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: null, alreadySent: false })).toEqual({ ok: false, reason: 'no_draft' })
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: { ...readyDraft, bodyMarkdown: '' }, alreadySent: false })).toEqual({ ok: false, reason: 'no_draft' })
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: { ...readyDraft, skippedAt: new Date() }, alreadySent: false })).toEqual({ ok: false, reason: 'skipped' })
    expect(evaluateSend({ settings: on, issueDate: '2026-09-07', draft: { ...readyDraft, previewSentAt: null }, alreadySent: false })).toEqual({ ok: false, reason: 'no_preview' })
  })
})

describe('nextSendLabel', () => {
  it('says today before 7 AM Toronto and tomorrow after', () => {
    const on = { autosend_enabled: 'true', schedule_frequency: 'daily' }
    expect(nextSendLabel(on, new Date('2026-09-07T09:00:00Z'))).toBe('Today, about 7:00 AM Toronto')   // 5 AM EDT
    expect(nextSendLabel(on, new Date('2026-09-07T13:00:00Z'))).toBe('Tomorrow, about 7:00 AM Toronto') // 9 AM EDT
  })
  it('skips the weekend on weekdays frequency', () => {
    const wk = { autosend_enabled: 'true', schedule_frequency: 'weekdays' }
    // Friday 9 AM EDT -> Monday
    expect(nextSendLabel(wk, new Date('2026-09-04T13:00:00Z'))).toBe('Monday, about 7:00 AM Toronto')
  })
  it('reports off states', () => {
    expect(nextSendLabel({ autosend_enabled: 'false' })).toBe('Automatic sending is off')
    expect(nextSendLabel({ autosend_enabled: 'true', schedule_frequency: 'manual' })).toBe('Frequency is off')
  })
})
