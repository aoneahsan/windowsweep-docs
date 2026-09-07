# Manual / User-Only Tasks - windowsweep-docs
> Fixed path: docs/MANUAL-TASKS.md - excluded from the build (`docusaurus.config.ts` `exclude`), and the
> deploy workflow fails if any file matching `*MANUAL*` reaches `build/`.
> Last updated: 2026-09-08 (rows 1 and 2 were stale: DNS and the Pages custom domain are both done. Row 2 is
> split, because setting the domain and enforcing HTTPS are two states and only one of them has happened.)

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 2b | GitHub -> `aoneahsan/windowsweep-docs` -> Settings -> Pages: tick **Enforce HTTPS**. It cannot be ticked yet - GitHub has not finished issuing the certificate for the domain, and the box stays disabled until it has. Re-check in a few hours; if it is still unavailable after ~24h from the DNS change, use *Remove domain* then re-enter `windowsweep-docs.aoneahsan.com`, which restarts the request | repository settings | `~/.claude/rules/docs-sites.md` | Not started - **blocked on GitHub, not on you** |
| 3b | Optional, and **nothing reads these three today**: `CLARITY_PROJECT_ID`, `AMPLITUDE_API_KEY`, `SENTRY_DSN`. They appear in `.env.example` and in the workflow's `env:` block, but `docusaurus.config.ts` reads only `GA_MEASUREMENT_ID`. Creating them now would have no effect - they need wiring in the config first | repository secrets | `.env.example`, `docusaurus.config.ts` L24 | Not started - **do nothing until the config reads them** |

## Completed
| # | Task | Completed | Evidence |
|---|------|-----------|----------|
| 1 | Hostinger DNS for `aoneahsan.com`: `CNAME windowsweep-docs -> aoneahsan.github.io` | 2026-09-07 | `curl -s -o /dev/null -w '%{http_code}' -m 8 http://windowsweep-docs.aoneahsan.com/` -> **200**. The host resolves and GitHub Pages is serving this site on it |
| 2a | GitHub -> Settings -> Pages: set the custom domain to `windowsweep-docs.aoneahsan.com` | 2026-09-07 | `gh api repos/aoneahsan/windowsweep-docs/pages` -> `"cname": "windowsweep-docs.aoneahsan.com"`. The domain is recorded on the Pages site; `static/CNAME` matches it |
| 3a | Actions secret `GA_MEASUREMENT_ID` on `aoneahsan/windowsweep-docs` | 2026-09-07 | Secret created on the repo. It is the one analytics key `docusaurus.config.ts` reads (L24), so gtag is now wired on CI builds |

> **Not yet true, so not ticked:** HTTPS. `gh api repos/aoneahsan/windowsweep-docs/pages` reports
> `"https_enforced": false` and `"protected_domain_state": null`, and
> `curl https://windowsweep-docs.aoneahsan.com/` returns **000** (the TLS handshake cannot complete because
> no certificate exists yet). Until row 2b is done the site answers on `http://` only. Verified 2026-09-08.
