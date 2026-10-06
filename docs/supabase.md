# Supabase guidance

The client currently reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These values may be public only when RLS policies protect every exposed table and action. The audit must verify schema, policies, auth flow, and any server-side privileged access before changes are made.
