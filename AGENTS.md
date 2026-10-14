# WindowSweep docs — active guide

**Last Updated:** 2026-10-14
**Context pass:** 2026-10-14; next routine optimization eligible 2026-11-13.

This public Docusaurus repository is the GitHub Pages documentation site for the Windows cleanup CLI and desktop app. It is nested under the private `../windowsweep-root/` alongside public source `../windowsweep/` and private website `../windowsweep-web/`. The former detailed guide is archived in `context/docs-guide-2026-09-28.md` for a targeted lookup. Do not load it unless the task names a rule or historical incident there. Current release/version status comes from the product tracker and parent `../remaining-work-summary.md`.

## Content ownership and safety

Pages here mirror `../windowsweep/docs/`, plus the root AI integration guide. Fix the product source page first, then mirror it with Docusaurus front matter. `faq.mdx` is special: its FAQPage JSON-LD must match visible answers exactly. Never imply a deletion can be undone. The CLI is destructive; explain permanence where relevant. This public repo contains no secret or working `.env`.

`docs/MANUAL-TASKS.md` and `docs/story/` are private working records under the content source tree and must stay excluded from the generated site. Both the Docusaurus config and Pages workflow enforce that exclusion. Never add Firebase Hosting or a billing target to the docs site. The canonical URL is `windowsweep-docs.aoneahsan.com` with HTTPS.

## Checks and deploy

Use Yarn: `yarn install --immutable`, `yarn gates` (typecheck and Docusaurus build), and `yarn typecheck:clean` after dependency changes. Broken internal links/anchors fail the build. Preview the built site with `yarn serve --no-open` in a controlled browser at desktop and mobile widths before pushing. A `main` push triggers GitHub Pages; confirm Actions success and live HTTPS after it. Do not deploy docs from a failed local build. Never run a dev server as proof of a production build.

Markdown pages need title and description front matter, sidebar registration in the same change, relative local links, Docusaurus admonitions and language-tagged code fences. The staged-file hook excludes Markdown so mirrored content stays byte-consistent. Fetch/merge remote `main` before editing and again before direct push. Never force-push. The root branch remains unrelated and private.
