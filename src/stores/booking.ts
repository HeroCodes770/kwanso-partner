import { defineStore } from 'pinia'
import { apiGet, apiMessage, unwrapList } from '@/lib/api'
import type { Booking } from '@/types/api'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as Booking[],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchBookings() {
      this.loading = true
      this.error = ''
      try {
        const res = await apiGet<unknown>('/bookings')
        this.bookings = unwrapList<Booking>(res)
      } catch (e) {
        this.error = apiMessage(e, 'Could not load transactions')
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
