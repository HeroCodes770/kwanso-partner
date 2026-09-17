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

## Docker

Build with API/Supabase args baked into the bundle:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 \
  --build-arg VITE_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJ... \
  -t kwanso-partner .
```
