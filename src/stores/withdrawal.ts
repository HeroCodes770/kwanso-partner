import { defineStore } from 'pinia'
import { apiGet, apiMessage, apiPost, unwrapData, unwrapList } from '@/lib/api'
import type { Withdrawal } from '@/types/api'

export type WithdrawalMethod = 'mobile_money' | 'bank' | 'cash'

export const useWithdrawalStore = defineStore('withdrawal', {
  state: () => ({
    history: [] as Withdrawal[],
    loading: false,
    submitting: false,
    error: '',
  }),

  actions: {
    async fetchMyWithdrawals() {
      this.loading = true
      this.error = ''
      try {
        const res = await apiGet<unknown>('/withdrawals/me')
        this.history = unwrapList<Withdrawal>(res)
      } catch (e) {
        this.error = apiMessage(e, 'Could not load withdrawals')
        throw e
      } finally {
        this.loading = false
      }
    },

    async requestWithdrawal(payload: {
      amount: number
      method: WithdrawalMethod
      method_details: Record<string, string>
      notes?: string
    }) {
      this.submitting = true
      this.error = ''
      try {
        const res = await apiPost<unknown>('/withdrawals', payload)
        const created = unwrapData<Withdrawal>(res)
        this.history.unshift(created)
        return created
      } catch (e) {
        this.error = apiMessage(e, 'Withdrawal request failed')
        throw e
      } finally {
        this.submitting = false
      }
    },
  },
})
