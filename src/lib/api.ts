import axios, { type AxiosRequestConfig } from 'axios'
import { getSupabase } from './supabase'

export const APP_PLATFORM = 'partner_app'

export type ApiEnvelope<T = unknown> = {
  status: number
  msg?: string
  message?: string
  data: T
  page?: number
  limit?: number
  total?: number
}

function apiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''
  if (!raw) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }
  return raw.replace(/\/$/, '')
}

export function buildApiUrl(path: string): string {
  const base = apiBase()
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  if (p.startsWith('/api/v1') && base.endsWith('/api/v1')) {
    return `${base}${p.slice('/api/v1'.length)}`
  }
  return `${base}${p}`
}

export function unwrapData<T>(response: unknown): T {
  if (response == null) return response as T
  const body = response as ApiEnvelope<T>
  if (body && typeof body === 'object' && 'data' in body) {
    return body.data as T
  }
  return response as T
}

export function unwrapList<T>(response: unknown): T[] {
  const data = unwrapData<unknown>(response)
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data
  }
  return []
}

export function apiMessage(error: unknown, fallback = 'Request failed'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiEnvelope | undefined
    return body?.msg || body?.message || error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await getSupabase().auth.getSession()
  return data.session?.access_token ?? null
}

export async function apiRequest<T>(
  path: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  const token = await getAccessToken()
  const headers: Record<string, string> = {
    'X-App-Platform': APP_PLATFORM,
    ...(config.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await axios.request({
    url: buildApiUrl(path),
    ...config,
    headers,
  })
  return response.data as T
}

export async function apiGet<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>(path, { ...config, method: 'GET' })
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>(path, { ...config, method: 'POST', data: body })
}

export async function uploadToSignedUrl(signedUrl: string, file: File): Promise<void> {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  })
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`)
  }
}
