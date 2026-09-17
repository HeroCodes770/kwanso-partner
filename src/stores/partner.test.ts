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

  it('reads dashboard metrics from enriched /partners/me stats', async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({
      data: {
        id: 'p1',
        name: 'Acme Transit',
        stats: {
          gross_revenue: 5000,
          available_balance: 1200,
          vehicle_count: 3,
          total_km: 42.5,
        },
      },
    })

    const store = usePartnerStore()
    await store.fetchDashboard()

    expect(apiGet).toHaveBeenCalledTimes(1)
    expect(store.profile?.name).toBe('Acme Transit')
    expect(store.vehicleCount).toBe(3)
    expect(store.totalKm).toBe(42.5)
    expect(store.grossRevenue).toBe(5000)
    expect(store.availableBalance).toBe(1200)
  })

  it('falls back to earnings when /partners/me has no stats', async () => {
    vi.mocked(apiGet)
      .mockResolvedValueOnce({ data: { id: 'p1', name: 'Acme Transit' } })
      .mockResolvedValueOnce({
        data: { gross_revenue: 5000, available_balance: 1200 },
      })

    const store = usePartnerStore()
    await store.fetchDashboard()

    expect(store.grossRevenue).toBe(5000)
    expect(store.availableBalance).toBe(1200)
  })
})
