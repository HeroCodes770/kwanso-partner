import { defineStore } from 'pinia'
import { apiGet, apiMessage, unwrapData } from '@/lib/api'
import type { EarningsSummary, PartnerMe } from '@/types/api'

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    profile: null as PartnerMe | null,
    earnings: null as EarningsSummary | null,
    loading: false,
    error: '',
  }),

  getters: {
    vehicleCount: (state) =>
      state.profile?.stats?.vehicle_count ??
      state.profile?.vehicle_count ??
      state.profile?.stats?.shuttle_count ??
      0,
    totalKm: (state) =>
      state.profile?.stats?.total_km ??
      state.profile?.total_km ??
      state.earnings?.total_km ??
      0,
    grossRevenue: (state) =>
      state.profile?.stats?.gross_revenue ??
      state.profile?.stats?.total_revenue ??
      state.earnings?.gross_revenue ??
      0,
    availableBalance: (state) =>
      state.profile?.stats?.available_balance ?? state.earnings?.available_balance ?? 0,
  },

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = ''
      try {
        const meRes = await apiGet<unknown>('/partners/me')
        this.profile = unwrapData<PartnerMe>(meRes)

        // Prefer embedded stats from /partners/me; fall back to earnings if missing.
        const hasStats =
          this.profile?.stats?.gross_revenue != null ||
          this.profile?.stats?.available_balance != null
        if (this.profile?.id && !hasStats) {
          try {
            const earnRes = await apiGet<unknown>(`/earnings/partner/${this.profile.id}`)
            this.earnings = unwrapData<EarningsSummary>(earnRes)
          } catch {
            this.earnings = null
          }
        } else {
          this.earnings = null
        }
      } catch (e) {
        this.error = apiMessage(e, 'Could not load partner profile')
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
