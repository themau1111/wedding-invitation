# Progress log

## 2026-09-08

- Agent documentation baseline created.
- Audit pending. Existing README contains unresolved Git conflict markers; record and remediate during the audit phase.
- Removed the public browser flow that fetched every guest and posted the complete directory to the notification backend. Notifications remain disabled until a server-owned, authorized flow is implemented.
- Added the public Supabase environment-variable template and a working README.
- Updated Next.js and eslint-config-next from `15.1.5` to `15.1.11`, the official patched release for this line. The build reaches static generation but requires configured Supabase variables.
- Restored administrative XLSX export through a server-owned endpoint that validates the Supabase access token and a configured administrator allow-list.
- Confirmed on 2026-10-06 that this frontend remains a standalone product with its own deployment and environment contract. The second invitation is documentation/reference context only.
