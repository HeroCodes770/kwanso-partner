import { describe, expect, it } from 'vitest'
import { buildApiUrl, unwrapData, unwrapList } from './api'

describe('buildApiUrl', () => {
  it('appends paths to configured base', () => {
    expect(buildApiUrl('/partners/me')).toBe('http://localhost:8787/api/v1/partners/me')
  })

  it('avoids double /api/v1 prefix', () => {
    expect(buildApiUrl('/api/v1/shuttles')).toBe('http://localhost:8787/api/v1/shuttles')
  })
})

describe('unwrap helpers', () => {
  it('unwraps envelope data', () => {
    expect(unwrapData({ status: 200, msg: 'OK', data: { id: '1' } })).toEqual({ id: '1' })
  })

  it('unwraps list payloads', () => {
    expect(unwrapList({ status: 200, data: [{ id: 'a' }] })).toEqual([{ id: 'a' }])
  })
})
