import { defineStore } from 'pinia'
import { getSupabase } from '@/lib/supabase'
import {
  apiGet,
  apiMessage,
  buildApiUrl,
  APP_PLATFORM,
  unwrapData,
} from '@/lib/api'
import { isPartnerPortalRole } from '@/lib/roles'
import type { PartnerUser } from '@/types/api'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    initialized: false,
    isAuthenticated: false,
    accessToken: null as string | null,
    user: null as PartnerUser | null,
    loginError: '',
    signupError: '',
    loading: false,
  }),

  getters: {
    fullName: (state) => {
      const u = state.user
      if (!u) return ''
      return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || ''
    },
    roleId: (state) => state.user?.role_id ?? state.user?.role?.id ?? null,
    canUsePortal: (state) => isPartnerPortalRole(state.user?.role_id ?? state.user?.role?.id),
  },

  actions: {
    async initialize() {
      const supabase = getSupabase()
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        this.accessToken = data.session.access_token
        this.isAuthenticated = true
        await this.fetchCurrentUser()
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session) {
          this.clearSession()
          return
        }
        this.accessToken = session.access_token
        this.isAuthenticated = true
        await this.fetchCurrentUser()
      })

      this.initialized = true
    },

    clearSession() {
      this.isAuthenticated = false
      this.accessToken = null
      this.user = null
    },

    async fetchCurrentUser() {
      try {
        const res = await apiGet<unknown>('/auth/me')
        this.user = unwrapData<PartnerUser>(res)
      } catch (e) {
        this.user = null
        throw e
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.loginError = ''
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })
        if (error) throw error
        if (!data.session) throw new Error('No session returned')

        this.accessToken = data.session.access_token
        this.isAuthenticated = true
        await this.fetchCurrentUser()

        if (!this.canUsePortal) {
          await this.logout()
          throw new Error('This account is not authorized for the partner portal.')
        }
      } catch (e) {
        this.loginError = apiMessage(e, 'Login failed')
        throw e
      } finally {
        this.loading = false
      }
    },

    async signup(payload: {
      email: string
      password: string
      first_name: string
      last_name: string
      phone_number?: string
      partner: { name: string; phone?: string; address?: string }
    }) {
      this.loading = true
      this.signupError = ''
      try {
        await axios.post(buildApiUrl('/auth/signup/partner'), payload, {
          headers: { 'X-App-Platform': APP_PLATFORM },
        })
        await this.login(payload.email, payload.password)
      } catch (e) {
        this.signupError = apiMessage(e, 'Signup failed')
        throw e
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      this.clearSession()
    },
  },
})
