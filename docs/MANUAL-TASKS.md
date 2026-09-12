# Manual / User-Only Tasks - windowsweep-docs
> Fixed path: docs/MANUAL-TASKS.md - excluded from the build (`docusaurus.config.ts` `exclude`), and the
> deploy workflow fails if any file matching `*MANUAL*` reaches `build/`.
> Last updated: 2026-09-12 (row 2b: the certificate is GitHub's and the domain re-add is the AGENT's by owner
> decision D18; the note below records what the host actually presents)

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 2b | **Enforce HTTPS** - cannot be ticked yet. GitHub has not issued the certificate: the host presents GitHub's own `*.github.io` certificate, the Pages API reports `https_certificate: null`, the CNAME is correct and the apex has no CAA record. **Owner decision 2026-09-12 (D18): the AGENT removes and re-adds the custom domain through the Pages API** to restart provisioning, polls, and sets `https_enforced` itself. Nothing here is yours unless GitHub support becomes necessary, in which case a new row names it | repository settings (the agent, via the API) | `~/.claude/rules/docs-sites.md`; tracker `P3.https-writeback` | Blocked on GitHub; **the agent acts, not you** |
| 3b | Optional, and **nothing reads these three today**: `CLARITY_PROJECT_ID`, `AMPLITUDE_API_KEY`, `SENTRY_DSN`. They appear in `.env.example` and in the workflow's `env:` block, but `docusaurus.config.ts` reads only `GA_MEASUREMENT_ID`. Creating them now would have no effect - they need wiring in the config first | repository secrets | `.env.example`, `docusaurus.config.ts` L24 | Not started - **do nothing until the config reads them** |

## Completed
| # | Task | Completed | Evidence |
|---|------|-----------|----------|
| 1 | Hostinger DNS for `aoneahsan.com`: `CNAME windowsweep-docs -> aoneahsan.github.io` | 2026-09-07 | `curl -s -o /dev/null -w '%{http_code}' -m 8 http://windowsweep-docs.aoneahsan.com/` -> **200**. The host resolves and GitHub Pages is serving this site on it |
| 2a | GitHub -> Settings -> Pages: set the custom domain to `windowsweep-docs.aoneahsan.com` | 2026-09-07 | `gh api repos/aoneahsan/windowsweep-docs/pages` -> `"cname": "windowsweep-docs.aoneahsan.com"`. The domain is recorded on the Pages site; `static/CNAME` matches it |
| 3a | Actions secret `GA_MEASUREMENT_ID` on `aoneahsan/windowsweep-docs` | 2026-09-07 | Secret created on the repo. It is the one analytics key `docusaurus.config.ts` reads (L24), so gtag is now wired on CI builds |

> **Not yet true, so not ticked:** HTTPS. On 2026-09-12 `gh api repos/aoneahsan/windowsweep-docs/pages` still
> reports `"https_certificate": null` and `"https_enforced": false`, and
> `https://windowsweep-docs.aoneahsan.com/` presents the `*.github.io` certificate (curl on Windows reports
> `SEC_E_WRONG_PRINCIPAL`; the handshake completes, the name does not match). The apex publishes no CAA
> record, so nothing on your side blocks issuance. Until the re-add lands the site answers on `http://` only.
