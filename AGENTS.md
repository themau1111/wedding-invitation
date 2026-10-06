# Original Wedding Invitation Frontend — Agent Guide

## Scope

This portfolio project is the original frontend. It is being documented and audited before selected patterns are reused in `../invitation-2`. Preserve its behavior, personal assets, and guest data unless an approved remediation requires a change.

## Read on demand

- `docs/project-overview.md`: application map and relationship to the new project.
- `docs/audit-scope.md`: what the review covers and how findings are recorded.
- `docs/frontend.md`: Next.js, UI and quality expectations.
- `docs/supabase.md`: only for database/client work.
- `docs/security.md`: before any changes to access, forms, secrets, or production configuration.

## Rules

1. Do not expose secrets, production guest data, or Supabase service credentials.
2. Treat admin and RSVP flows as sensitive; verify behavior after changes.
3. Do not copy personal photos, music, copy, or branding into the new invitation without an explicit asset decision.
4. Keep audit evidence actionable, reproducible, and prioritized in `docs/audit-findings.md`.
5. Update `docs/progress.md` when a finding is fixed or a design decision becomes durable.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint` (must be validated; the configured command may need modernization during audit)
