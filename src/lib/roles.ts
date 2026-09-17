export const Role = {
  ADMIN: 1,
  DRIVER: 2,
  USER: 3,
  PARTNER: 4,
  SUPERADMIN: 5,
} as const

export type RoleId = (typeof Role)[keyof typeof Role]

export function normalizeRoleId(roleId?: number | string | null): number | null {
  if (roleId == null || roleId === '') return null
  const n = typeof roleId === 'number' ? roleId : Number(roleId)
  return Number.isFinite(n) ? n : null
}

export function isPartnerPortalRole(roleId?: number | string | null): boolean {
  const id = normalizeRoleId(roleId)
  return id === Role.PARTNER || id === Role.SUPERADMIN
}
