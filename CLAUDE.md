# WindowSweep docs — active guide

**Last Updated:** 2026-10-31
**Context pass:** 2026-10-14; next routine optimization eligible 2026-11-13.

This public Docusaurus repository is the GitHub Pages documentation site for the Windows cleanup CLI and desktop app. It is nested under the private `../windowsweep-root/` alongside public source `../windowsweep/` and private website `../windowsweep-web/`. The former detailed guide is archived in `context/docs-guide-2026-09-28.md` for a targeted lookup. Do not load it unless the task names a rule or historical incident there. Current release/version status comes from the product tracker and parent `../remaining-work-summary.md`.

## Content ownership and safety

Pages here mirror `../windowsweep/docs/`, plus the root AI integration guide. Fix the product source page first, then mirror it with Docusaurus front matter. `faq.mdx` is special: its FAQPage JSON-LD must match visible answers exactly. Never imply a deletion can be undone. The CLI is destructive; explain permanence where relevant. This public repo contains no secret or working `.env`.

`docs/MANUAL-TASKS.md` and `docs/story/` are private working records under the content source tree and must stay excluded from the generated site. The Docusaurus config enforces that exclusion. Never add Firebase Hosting or a billing target to the docs site. The canonical URL is `windowsweep-docs.aoneahsan.com` with HTTPS.

## Checks and deploy

Use Yarn: `yarn install --immutable`, `yarn gates` (typecheck and Docusaurus build), and `yarn typecheck:clean` after dependency changes. Broken internal links/anchors fail the build. Preview the built site with `yarn serve --no-open` in a controlled browser at desktop and mobile widths before publishing. GitHub Actions are disabled: a `main` push does not publish. Publish the verified static build from a detached `gh-pages` worktree with `.nojekyll`, push that branch normally, then request a Pages build with `gh api -X POST repos/aoneahsan/windowsweep-docs/pages/builds`. Confirm the live bundle hash and HTTPS at desktop and mobile widths. Do not deploy docs from a failed local build. Never run a dev server as proof of a production build.

`plugins/site-pages.ts` builds `/sitemap`, `/feed` and `/feed.xml` from the sidebar and `docs/changelog.md` (Keep a Changelog, `## [X.Y.Z] - YYYY-MM-DD`) and dates every `sitemap.xml` URL from git (an uncommitted file reads as today). The build fails on an undated release, an undated sitemap URL, or a `/search` or tag page without `noindex`. `plugins/rehype-table-scroll.ts` puts every table in a labelled, focusable scroll region.

Markdown pages need title and description front matter, sidebar registration in the same change, relative local links, Docusaurus admonitions and language-tagged code fences. The staged-file hook excludes Markdown so mirrored content stays byte-consistent. Fetch/merge remote `main` before editing and again before direct push. Never force-push. The root branch remains unrelated and private.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.

<!-- cloudflare-pages-v1 -->
## Hosting: Cloudflare Pages

This site deploys on Cloudflare Pages, project `windowsweep-docs`, domain `windowsweep-docs.aoneahsan.com` (rule: docs sites deploy on Cloudflare Pages, owner, 2026-11-05). Build and check it locally, then run `yarn deploy`. This replaces every GitHub Pages instruction elsewhere in this repo; no GitHub Actions and no `docusaurus deploy`.
