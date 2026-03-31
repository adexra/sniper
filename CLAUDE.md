# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Sniper** (`sniper.adexra.com`) — A high-end freelance lead CRM and pitch generator for elite creative studios. Paste a raw lead/brief; the app extracts structured client data via Azure OpenAI, stores it, and generates a tailored pitch strategy.

## Commands

```bash
pnpm dev        # dev server on localhost:3000 (Turbopack)
pnpm build      # production build
pnpm lint       # ESLint
```

To regenerate Supabase TypeScript types after schema changes:
```bash
# Via Supabase MCP → generate_typescript_types → overwrite types/supabase.ts
```

## Stack

- **Next.js 16** — App Router, TypeScript, Tailwind CSS v4, Turbopack
- **Supabase** (`rqyfdqxifnyztgushvyv`) — Postgres + Auth + RLS
- **Azure OpenAI** — lead extraction and pitch generation
- **@supabase/ssr** — cookie-based session management for Server Components

## Architecture

### Auth flow
`middleware.ts` runs `updateSession` from `utils/supabase/middleware.ts` on every request. Unauthenticated users are redirected to `/login`. The `/login` path is the only unprotected route.

### Supabase client pattern
- **Server Components / Route Handlers / Server Actions** → `utils/supabase/server.ts`
- **Client Components** → `utils/supabase/client.ts`
- Both clients are typed with `Database` from `types/supabase.ts` — always use typed queries
- Never import the server client in Client Components

### Database — `leads` table (Supabase project `rqyfdqxifnyztgushvyv`)

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `raw_text` | text | Original pasted brief |
| `extracted_data` | jsonb | AI-parsed client/project info |
| `pitch_strategy` | jsonb | Generated pitch sections |
| `status` | `lead_status` enum | `new` → `pitched` → `follow_up` → `closed` / `lost` |
| `created_at` / `updated_at` | timestamptz | `updated_at` auto-updated via trigger |

RLS enabled — all policies require `authenticated` role (single-user app).

Convenience types in `types/supabase.ts`: `Lead`, `LeadInsert`, `LeadUpdate`, `LeadStatus`.

## Environment variables

`.env.local` has Supabase URL + anon key pre-populated. Still needed:
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase dashboard → Project Settings → API
- `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`
