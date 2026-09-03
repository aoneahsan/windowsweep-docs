# Manual / User-Only Tasks - windowsweep-docs
> Fixed path: docs/MANUAL-TASKS.md - excluded from the build (`docusaurus.config.ts` `exclude`), and the
> deploy workflow fails if any file matching `*MANUAL*` reaches `build/`.
> Last updated: 2026-09-03

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 1 | Hostinger DNS for `aoneahsan.com`: `CNAME windowsweep-docs -> aoneahsan.github.io` | DNS zone access | `~/.claude/rules/docs-sites.md` | Not started |
| 2 | GitHub -> Settings -> Pages: confirm the custom domain `windowsweep-docs.aoneahsan.com` and tick Enforce HTTPS once DNS resolves | repository settings | same | Not started |
| 3 | Optional: Actions secrets `GA_MEASUREMENT_ID`, `CLARITY_PROJECT_ID`, `AMPLITUDE_API_KEY`, `SENTRY_DSN` (an unset key skips its provider, so the build never needs one) | repository secrets | `.env.example` | Not started |

## Completed
(move rows here with the date)
