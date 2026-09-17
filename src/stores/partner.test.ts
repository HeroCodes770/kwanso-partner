import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePartnerStore } from './partner'

vi.mock('@/lib/api', () => ({
  apiGet: vi.fn(),
  apiMessage: (_e: unknown, msg: string) => msg,
  unwrapData: (r: { data: unknown }) => r.data,
}))

import { apiGet } from '@/lib/api'

describe('usePartnerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(apiGet).mockReset()
  })

  it('merges profile and earnings for dashboard getters', async () => {
    vi.mocked(apiGet)
      .mockResolvedValueOnce({ data: { id: 'p1', name: 'Acme Transit' } })
      .mockResolvedValueOnce({
        data: { gross_revenue: 5000, available_balance: 1200, shuttle_count: 3 },
      })

    const store = usePartnerStore()
    await store.fetchDashboard()

    expect(store.profile?.name).toBe('Acme Transit')
    expect(store.grossRevenue).toBe(5000)
    expect(store.availableBalance).toBe(1200)
  })
})
