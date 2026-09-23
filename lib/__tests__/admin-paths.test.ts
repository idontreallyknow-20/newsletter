import { describe, it, expect } from 'vitest'
import { isAdminPath } from '../admin-paths'

describe('isAdminPath', () => {
  it('matches dashboard pages and their children', () => {
    expect(isAdminPath('/dashboard')).toBe(true)
    expect(isAdminPath('/compose/en')).toBe(true)
    expect(isAdminPath('/settings')).toBe(true)
  })

  it('leaves public and unknown pages alone', () => {
    expect(isAdminPath('/')).toBe(false)
    expect(isAdminPath('/about')).toBe(false)
    expect(isAdminPath('/issues/some-slug')).toBe(false)
    expect(isAdminPath('/no-such-page')).toBe(false)
  })

  it('does not match on a shared prefix without a path boundary', () => {
    expect(isAdminPath('/historyx')).toBe(false)
    expect(isAdminPath('/previews')).toBe(false)
  })
})
