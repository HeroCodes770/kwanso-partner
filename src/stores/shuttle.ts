import { defineStore } from 'pinia'
import {
  apiGet,
  apiMessage,
  apiPost,
  unwrapData,
  unwrapList,
  uploadToSignedUrl,
} from '@/lib/api'
import type { Shuttle, UploadUrlResponse } from '@/types/api'

export type ShuttleDocKind =
  | 'ownership_doc'
  | 'ghana_card_front'
  | 'ghana_card_back'
  | 'vehicle_image'

export const useShuttleStore = defineStore('shuttle', {
  state: () => ({
    shuttles: [] as Shuttle[],
    loading: false,
    error: '',
    offerLoading: false,
  }),

  actions: {
    async fetchShuttles() {
      this.loading = true
      this.error = ''
      try {
        const res = await apiGet<unknown>('/shuttles')
        this.shuttles = unwrapList<Shuttle>(res)
      } catch (e) {
        this.error = apiMessage(e, 'Could not load shuttles')
        throw e
      } finally {
        this.loading = false
      }
    },

    async createShuttle(body: {
      name: string
      plate_number: string
      capacity: number
      model?: string
    }) {
      const res = await apiPost<unknown>('/shuttles', body)
      return unwrapData<Shuttle>(res)
    },

    async requestUploadUrl(shuttleId: string, kind: ShuttleDocKind) {
      const res = await apiPost<unknown>(`/shuttles/${shuttleId}/upload-url`, { kind })
      return unwrapData<UploadUrlResponse>(res)
    },

    async uploadDocument(shuttleId: string, kind: ShuttleDocKind, file: File) {
      const { signedUrl, path } = await this.requestUploadUrl(shuttleId, kind)
      await uploadToSignedUrl(signedUrl, file)
      return path
    },

    async submitApplication(
      shuttleId: string,
      paths: {
        ownership_doc_url: string
        ghana_card_front_url: string
        ghana_card_back_url: string
        vehicle_image_urls: string[]
      },
    ) {
      const res = await apiPost<unknown>(`/shuttles/${shuttleId}/submit`, paths)
      return unwrapData<Shuttle>(res)
    },
  },
})
