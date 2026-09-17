import { describe, expect, it } from 'vitest'
import { Role, isPartnerPortalRole } from './roles'

describe('isPartnerPortalRole', () => {
  it('allows partner and superadmin', () => {
    expect(isPartnerPortalRole(Role.PARTNER)).toBe(true)
    expect(isPartnerPortalRole(Role.SUPERADMIN)).toBe(true)
  })

  it('rejects rider, driver, and admin', () => {
    expect(isPartnerPortalRole(Role.USER)).toBe(false)
    expect(isPartnerPortalRole(Role.DRIVER)).toBe(false)
    expect(isPartnerPortalRole(Role.ADMIN)).toBe(false)
  })
})
