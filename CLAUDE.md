# WindowSweep docs — active guide

**Last Updated:** 2026-11-27

<!-- fleet:node-26-13-1 v1 --> Node 26.13.1 LTS (.nvmrc), packages latest — 2026-11-16

**Context pass:** 2026-11-13; next routine optimization eligible 2026-12-13.

This public Docusaurus repository is the GitHub Pages documentation site for the Windows cleanup CLI and desktop app. It is nested under the private `../windowsweep-root/` alongside public source `../windowsweep/` and private website `../windowsweep-web/`. The former detailed guide is archived in `context/docs-guide-2026-09-28.md` for a targeted lookup. Do not load it unless the task names a rule or historical incident there. Current release/version status comes from the product tracker and parent `../remaining-work-summary.md`.

## Content ownership and safety

Pages here mirror `../windowsweep/docs/`, plus the root AI integration guide. Fix the product source page first, then mirror it with Docusaurus front matter. `faq.mdx` is special: its FAQPage JSON-LD must match visible answers exactly. Never imply a deletion can be undone. The CLI is destructive; explain permanence where relevant. This public repo contains no secret or working `.env`.

`docs/MANUAL-TASKS.md` and `docs/story/` are private working records under the content source tree and must stay excluded from the generated site. The Docusaurus config enforces that exclusion. Never add Firebase Hosting or a billing target to the docs site. The canonical URL is `windowsweep-docs.aoneahsan.com` with HTTPS.

## Checks and deploy

Use Yarn: `yarn install --immutable`, `yarn gates` (typecheck and Docusaurus build), and `yarn typecheck:clean` after dependency changes. A build needs the untracked `.env.local` holding four public client identifiers, the same values as the website's `.env`: `DOCS_SUPABASE_URL` and `DOCS_SUPABASE_PUBLISHABLE_KEY` for the release gate, and `DOCS_NEWSLETTER_LIST_ID` and `DOCS_FILESHUB_NEWSLETTER_KEY` (the website's `VITE_NEWSLETTER_LIST_ID` and `VITE_FILESHUB_NEWSLETTER_KEY`) for the footer signup. `docusaurus.config.ts` loads it and refuses a production build without any of them: the live docs ran with no gate from 2026-11-04 to 2026-11-05, and a 2026-11-14 publish from a machine holding only the first pair shipped every page without the signup. Broken internal links/anchors fail the build. Preview the built site with `yarn serve --no-open` in a controlled browser at desktop and mobile widths before publishing. GitHub Actions are disabled: a `main` push does not publish. Publish the verified static build from a detached `gh-pages` worktree with `.nojekyll`, push that branch normally, then request a Pages build with `gh api -X POST repos/aoneahsan/windowsweep-docs/pages/builds`. Confirm the live bundle hash and HTTPS at desktop and mobile widths. Do not deploy docs from a failed local build. Never run a dev server as proof of a production build.

`plugins/site-pages.ts` builds `/sitemap`, `/feed` and `/feed.xml` from the sidebar and `docs/changelog.md` (Keep a Changelog, `## [X.Y.Z] - YYYY-MM-DD`) and dates every `sitemap.xml` URL from git (an uncommitted file reads as today). The build fails on an undated release, an undated sitemap URL, or a `/search` page without `noindex`. `plugins/rehype-table-scroll.ts` puts every table in a labelled, focusable scroll region.

SEO contract (2026-11-27, windowsweep-docs#1): `trailingSlash: true` (GitHub Pages 301s `/x` to `/x/`); front matter uses `topics:`, never `tags:` (no generated tag pages; old `/tags/*` redirect through `plugins/seo-redirects.mts` and `@docusaurus/plugin-client-redirects`); `plugins/faq-schema.ts` writes FAQPage from the built home and white-label FAQ pages; the publisher `@graph` (Ahsan Mahmood, Zaions, the team, the product) is in `docusaurus.config.ts`. `yarn build` ends with `yarn seo:contract` (`plugins/seo-contract.mts`) over `build/`. Only the 404 page and `/search` may carry `noindex`. Search-console work is recorded in `docs/search-consoles/fix-log.md` (never published).

`blog/` holds the team's posts, one `.md` each (front matter: `slug`, `title`, `description`, `authors: [{ name: The windowsweep team, url: https://windowsweep-docs.aoneahsan.com/about/ }]` inline - no `authors.yml`, so no author pages - no `tags`, `image`, `date`; `{/* truncate */}` after the opening line), each image in `static/img/social/`. Empty, the blog stays off; the first post turns on the blog, its RSS and Atom feeds (`/blog/rss.xml`, beside the release feed `/feed.xml`), its search index, its sitemap entries (dated from git; `/blog` by its newest post), its Blog group on `/sitemap` and Posts on `/feed`, and the Blog links. The words live in `src/data/blog.ts` (2026-11-22).

Markdown pages need title and description front matter, sidebar registration in the same change, relative local links, Docusaurus admonitions and language-tagged code fences. The staged-file hook excludes Markdown so mirrored content stays byte-consistent. Fetch/merge remote `main` before editing and again before direct push. Never force-push. The root branch remains unrelated and private.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.


## Context measurement

| Field | Value |
|---|---|
| Last optimized | 2026-11-18 |
| Next routine optimization eligible | 2026-12-18 |
| Guide bytes | 4,830 B |
| Covered subtree | This repository; parent windowsweep-root measured separately |
| Method | Due review: compact project-specific guidance retained; mirrors, routing, task headings and inherited root checked; current release facts corrected where needed |
| Fleet record | code/docs/tracking/project-context-budget-tracker.json |
