# Audit findings

| ID | Severity | Status |
| --- | --- | --- |
| WEB-001 | High | Remediated: public UI no longer reads and sends the full guest list. The export is now a separate authenticated administrative operation. |
| WEB-002 | High | Pending: verify Supabase RLS prevents enumeration and unauthorised updates. |
| WEB-003 | Medium | Remediated: upgraded Next.js and eslint-config-next to `15.1.11`, the patched version for the 15.1.x line. |
| WEB-004 | Low | Partially remediated: README merge-conflict markers removed; client-only admin protection remains pending server-enforced authorization. |
| WEB-005 | Medium | Pending: dependency audit still reports 23 vulnerabilities; triage by package before any non-targeted upgrade. |
