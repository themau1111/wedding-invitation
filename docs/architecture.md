# Autonomous product boundary

`wedding-invitation` is the original portfolio frontend and remains independently deployable. It owns its visual assets, public Supabase browser configuration, Vercel project, and the notification API URL used by its administrator flow.

It communicates with `wedding-backend` only through `NEXT_PUBLIC_NOTIFICATION_API_URL`. The second invitation is a separate product: it must not share this repository's deployment, environment values, Supabase project, guest data, or assets. References to the newer repositories are documentation-only.
