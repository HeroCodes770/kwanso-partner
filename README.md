# Kwanso Partner Portal

Vite + Vue 3 + TypeScript SPA for fleet partners.

## Local development

```bash
cp .env.example .env.local
# Edit VITE_* values (API base should include /api/v1)

npm install
npm run dev
```

Default dev server: http://localhost:5173

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — typecheck + production bundle
- `npm run preview` — serve `dist/`
- `npm run test` — Vitest unit tests

## Deploy

Coolify app: `kwanso-partner-portal` → https://partner.kwansorides.com  
Repo: https://github.com/HeroCodes770/kwanso-partner (`momills/kwanso-partner` is the existing Flutter app)

DNS: in Cloudflare for `kwansorides.com`, add a proxied **CNAME** (or A) for `partner` matching `admin` / `api`, then wait for TLS on Coolify.

Build-time env on Coolify: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
