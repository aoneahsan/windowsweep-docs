# windowsweep-docs - agent guide

**Mirror of `AGENTS.md`** - byte-identical except the header names. Change one, change both.

**Last Updated:** 2026-09-25 (latest: D37 - the fleet package baseline for a docs site: prettier and a husky hook that never touches Markdown, .nvmrc, the script contract, the Pages workflow on .nvmrc. Earlier: the site follows `desktop-v1.3.0` and CLI 1.3.1 - `desktop.md` re-mirrored, the changelog page gains 1.3.1, `TOOL_VERSION` 1.3.1, and `llms.txt` names the new release and says what the index says about telemetry. Earlier: `desktop.md`'s second front-matter block removed - it rendered as a visible heading on the live page since 2026-09-08 - and rule 4's exception for a source that carries its own. Earlier the same day: the safety model re-mirrored from windowsweep 332e7c8 as docs b4f6a4f: the approved tier table that never landed, the two duplicated headings and two doubled table cells fixed; build and typecheck green, broken links and anchors throwing. Earlier 2026-09-17: the v4 audit: typecheck and build re-run green, no MANUAL or story file in `build/`, the site answering 200 over HTTPS with its own certificate and `https_enforced`. 🔴 **CLI 1.3.0 ships in this run** (owner decision D23), so this site follows it: `TOOL_VERSION`, the footer labels, `static/llms.txt` and the changelog page all move in the same pass, re-mirrored from the product's `docs/`. Earlier 2026-09-12: the workspace root is `windowsweep-root`; the product site is live; the docs site went HTTPS - the domain was re-added under D18 and the certificate issued the same day)

## What this is

The public documentation site for **[windowsweep](https://github.com/aoneahsan/windowsweep)**, a Windows
PowerShell CLI that deletes files to reclaim disk space.

| | |
|---|---|
| **Stack** | Docusaurus 3.10 · React 19.3 · TypeScript ~6.0.3 (ledger pin) · yarn 4 · Node 24.13.0 (`.nvmrc`) |
| **Domain** | `windowsweep-docs.aoneahsan.com` (pinned in `static/CNAME`) |
| **Deploy** | GitHub Pages via Actions on push to `main`. **No Firebase** |
| **Repo visibility** | 🔴 **PUBLIC** |
| **Dev ports** | 5972 (start) · 5973 (serve) |
| **Source package** | `../windowsweep` (the three repos sit under `D:\work\windowsweep-root\`) - **read-only from here** |
| **Product site** | `https://windowsweep.aoneahsan.com` - the product's canonical homepage, live since 2026-09-08 (its own private repo, `../windowsweep-web`). The navbar carries a `Website` item and the config header derives this docs domain from it, both landed in the 2026-09-12 HTTPS write-back (RW-102 / RW-112) |
| **Palette** | windowsweep's registered hue 128 (lime): `#4d7c0f` light, `#a3e635` dark |
| Context Budget Last Verified | 2026-09-17 — CLAUDE.md 6,825 B / no PENDING-TASKS.md; re-check due 2026-10-17 |

## 🔴 The rules that matter most here

**1. This repo is PUBLIC - no secret ever enters it.** Only `.env.example`, placeholders only. Every
analytics key is optional and an absent key skips its provider, so the build never needs one. Sweep before
committing:

```bash
git ls-files | grep -iE '(^|/)\.env$|secret|credential|serviceaccount|\.pem$|\.jks$|\.npmrc'
```

**2. `docs/MANUAL-TASKS.md` must stay excluded from the build.** It sits in `docs/`, which is also the
published content directory, so without the `exclude` entry in `docusaurus.config.ts` it ships as a public
page. Note that `exclude` **replaces** the plugin defaults - the defaults are restated there deliberately.
The deploy workflow also fails when any `*MANUAL*` file reaches `build/`.

**3. Never add Firebase.** No `firebase.json`, no `.firebaserc`, no `firebase:deploy` script. A docs site is
not a Firebase app. GitHub Pages is the only deploy path (`~/.claude/rules/docs-sites.md`).

**4. The content is a MIRROR of `windowsweep/docs/`.** One page per source page, flat, same file names,
plus `ai-integration-guide.md` from the CLI repo root. **Fix the CLI repo first, then re-mirror** - never
patch a page here and leave the source wrong. Every CLI release re-mirrors, and the front matter
(`title`, `description`, `tags`) is added on top of the mirrored body - 🔴 **unless the source already carries
it**, as `desktop.md` has since 2026-09-07: that page is a plain copy. A second block is not ignored, it renders
as a visible H2 made of the front matter's text, which the live `/desktop` page showed from 2026-09-08 to
2026-09-25. Check every re-mirror with `grep -c '^title: '` per page -> 1.

`faq` is the one page whose mirror is not a plain copy: it is mirrored into `faq.mdx`, and the page-scoped
`<Head>` FAQPage JSON-LD block is re-applied on top of the mirrored body. Google requires every question and
answer in that block to be visible on the page, so its strings are re-checked against the rendered text on
every re-mirror - an answer that changes in the source changes the block in the same edit.

**5. Never imply a deletion is reversible.** This documents a destructive tool with no undo for caches. Say
what is permanent, plainly, every time it is relevant.

**6. The local install is done (2026-09-05).** `yarn install` ran here for the first time - 40 minutes on a
cold global cache, 846 packages - and **the lockfile did not change by a single line**, which retires the
standing caution: the lockfile inherited from `linux-cleanup-docs` was genuinely valid, because the
dependency set really is identical. `yarn build` and `yarn typecheck` are green locally, so the gates no
longer depend on pushing and reading the Pages run. A dependency may now be added or bumped normally.

**7. 🔴 `docs/story/` never ships.** Phase P7 (the storytelling retrofit) puts a Story Bible, a voice
fingerprint, a content map, a decision log and drafts under `docs/story/`, which is also the published content
directory. It is excluded in `docusaurus.config.ts` and swept for in the deploy workflow - the same two lines
of defence `MANUAL-TASKS.md` has. Neither may be removed.

**8. HTTPS is live, and the re-add is how it got there.** Until 2026-09-12 the host presented GitHub's own
`*.github.io` certificate (`https_certificate: null`, the CNAME correct, no CAA record on the apex) - GitHub
had never issued one, which `curl` on Windows reports as `SEC_E_WRONG_PRINCIPAL` with code 000 and which reads
like a closed port. Under owner decision D18 the agent removed and re-added the custom domain through
`gh api -X PUT repos/aoneahsan/windowsweep-docs/pages` (cname `null`, confirmed empty, then the domain back);
GitHub issued a Let's Encrypt certificate naming the host within the hour, `https_enforced` was set, and
`http://` now returns 301. 🔴 The link switch was ONE pass across the fleet on that first 200 - never one link
early. If provisioning ever regresses, the same two calls are the remedy; re-adding is cheap and does not
change DNS.

## Verifying a change

```bash
yarn gates             # typecheck, then build - the build is ALSO the link checker
yarn typecheck:clean   # after any dependency change
```

Zero warnings, zero errors. A broken internal link or anchor fails the build by design (`onBrokenLinks` and
`onBrokenAnchors` are `'throw'`).

Never start a dev server to "check" something in an automated session - `yarn build` then
`yarn serve --no-open` is the sanctioned path. Without `--no-open`, `docusaurus serve` opens the system's default
browser, which on the owner's machines is his own Chrome.

**The commit hook** (husky, installed by `postinstall`; an existing checkout runs `yarn postinstall` once) runs
`yarn lint-staged --no-stash`: prettier on staged TypeScript, JSON, CSS and YAML. 🔴 **Never on Markdown** - the
pages are the mirror (rule 4), so `.lintstagedrc.json` names no Markdown pattern and `.prettierignore` excludes
`*.md` and `*.mdx`. Never run `yarn format` over the tree. No ESLint: the repo has no application source; add it
(ESLint 10, `lint` in `gates`) the day `src/` gains a `.ts`, `.tsx` or `.js` file. (D37, 2026-09-25.)

## Content conventions

- Every page carries `title` and `description` front matter; without them the page is unsearchable and ships
  an empty meta description. `tags` power discovery.
- The sidebar is updated in the **same change** that adds a page - a page not in `sidebars.ts` is unreachable.
- Links between pages are relative (`./sections.md`); links to files that live only in the CLI repo are
  absolute GitHub URLs.
- Admonitions are Docusaurus `:::note` blocks, not GitHub's `> [!NOTE]` callouts.
- Code fences always name a language; PowerShell blocks use `powershell`.

Global records (rules, policy, audit reports) live in the `ahsan-notebook` repo at
`static/assets/claude-code/`; the `~/.claude/...` paths are symlinks into it. Full text: `~/.claude/CLAUDE.md`.
