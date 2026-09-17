import { vi } from 'vitest'

vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8787/api/v1')
vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
