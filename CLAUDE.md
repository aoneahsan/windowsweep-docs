# windowsweep-docs - agent guide

**Mirror of `AGENTS.md`** - byte-identical except the header names. Change one, change both.

**Last Updated:** 2026-09-07

## What this is

The public documentation site for **[windowsweep](https://github.com/aoneahsan/windowsweep)**, a Windows
PowerShell CLI that deletes files to reclaim disk space.

| | |
|---|---|
| **Stack** | Docusaurus 3.10 · React 19 · TypeScript ~6.0.3 · yarn 4 |
| **Domain** | `windowsweep-docs.aoneahsan.com` (pinned in `static/CNAME`) |
| **Deploy** | GitHub Pages via Actions on push to `main`. **No Firebase** |
| **Repo visibility** | 🔴 **PUBLIC** |
| **Dev ports** | 5972 (start) · 5973 (serve) |
| **Source package** | `../windowsweep` (both repos sit under `D:\work\windows-cleanup-root\`) - **read-only from here** |
| **Palette** | windowsweep's registered hue 128 (lime): `#4d7c0f` light, `#a3e635` dark |

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
(`title`, `description`, `tags`) is added on top of the mirrored body.

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

## Verifying a change

```bash
yarn build      # ALSO the link checker - onBrokenLinks and onBrokenAnchors are 'throw'
yarn typecheck
```

Zero warnings, zero errors. A broken internal link fails the build by design. Until the local install exists,
**the Pages workflow is the gate**: push and read the run.

Never start a dev server to "check" something in an automated session - `yarn build` then `yarn serve` is the
sanctioned path.

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
