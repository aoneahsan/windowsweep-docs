# Manual / User-Only Tasks - windowsweep-docs
> Fixed path: docs/MANUAL-TASKS.md - excluded from the build (`docusaurus.config.ts` `exclude`), and the
> deploy workflow fails if any file matching `*MANUAL*` reaches `build/`.
> Last updated: 2026-09-12 (row 2b CLOSED: the agent re-added the domain under D18, GitHub issued the
> certificate within the hour, and HTTPS is now enforced)

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 3b | Optional, and **nothing reads these three today**: `CLARITY_PROJECT_ID`, `AMPLITUDE_API_KEY`, `SENTRY_DSN`. They appear in `.env.example` and in the workflow's `env:` block, but `docusaurus.config.ts` reads only `GA_MEASUREMENT_ID`. Creating them now would have no effect - they need wiring in the config first | repository secrets | `.env.example`, `docusaurus.config.ts` L24 | Not started - **do nothing until the config reads them** |

## Completed
| # | Task | Completed | Evidence |
|---|------|-----------|----------|
| 1 | Hostinger DNS for `aoneahsan.com`: `CNAME windowsweep-docs -> aoneahsan.github.io` | 2026-09-07 | `curl -s -o /dev/null -w '%{http_code}' -m 8 http://windowsweep-docs.aoneahsan.com/` -> **200**. The host resolves and GitHub Pages is serving this site on it |
| 2a | GitHub -> Settings -> Pages: set the custom domain to `windowsweep-docs.aoneahsan.com` | 2026-09-07 | `gh api repos/aoneahsan/windowsweep-docs/pages` -> `"cname": "windowsweep-docs.aoneahsan.com"`. The domain is recorded on the Pages site; `static/CNAME` matches it |
| 3a | Actions secret `GA_MEASUREMENT_ID` on `aoneahsan/windowsweep-docs` | 2026-09-07 | Secret created on the repo. It is the one analytics key `docusaurus.config.ts` reads (L24), so gtag is now wired on CI builds |
| 2b | **HTTPS** - the custom domain removed and re-added through the Pages API, then enforced. 🔴 **This row was never yours after owner decision D18 (2026-09-12), which reassigned it to the agent**; it is recorded here as completed because the row existed | 2026-09-12 | `gh api -X PUT repos/aoneahsan/windowsweep-docs/pages` with `{"cname": null}`, confirmed `"cname": null`, then the same call with the domain back. GitHub issued the certificate the same hour: `.https_certificate.state` -> **`approved`**, and `openssl s_client` reports `subject=CN=windowsweep-docs.aoneahsan.com`, `issuer=C=US, O=Let's Encrypt, CN=YR1`, `notBefore=Sep 12 15:57:05 2026 GMT`. `curl https://windowsweep-docs.aoneahsan.com/` -> **200** with `ssl_verify_result=0`; `/img/social-card.png` -> 200. `https_enforced` then set to true, and `http://windowsweep-docs.aoneahsan.com/` -> **301** to the https origin. Every docs link in the product README was switched in the same pass |

> The diagnosis that made this fixable: GitHub had never issued a certificate for the host at all - it was
> presenting its own `*.github.io` certificate, which `curl` on Windows reports as `SEC_E_WRONG_PRINCIPAL`
> with HTTP code 000. That reads like a closed port and is not one. The apex publishes no CAA record, so
> nothing on the owner's side had ever blocked issuance; the Pages site simply needed the domain re-added to
> restart provisioning.
