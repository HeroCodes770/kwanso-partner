import { defineStore } from 'pinia'
import { apiGet, apiMessage, unwrapList } from '@/lib/api'
import type { Schedule } from '@/types/api'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [] as Schedule[],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchSchedules() {
      this.loading = true
      this.error = ''
      try {
        const res = await apiGet<unknown>('/schedules')
        this.schedules = unwrapList<Schedule>(res)
      } catch (e) {
        this.error = apiMessage(e, 'Could not load schedules')
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
