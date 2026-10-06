# Wedding invitation

Original portfolio wedding invitation built with Next.js, React, and Supabase.

## Local setup

1. Copy `.env.example` to `.env.local` and provide the public Supabase project URL and publishable/anonymous key.
2. Install dependencies with `npm ci`.
3. Start the development server with `npm run dev`.

The browser configuration is public by design. Protect guest data with Supabase RLS; never place a service-role key in this frontend.

## Verification

Run `npm run build` with the required environment variables configured.

See `AGENTS.md` and `docs/` for architecture, audit notes, and operational guidance.
