# Search-console fix log — windowsweep-docs.aoneahsan.com

Newest first. One section per issue. `live-verified` is ours; `indexed` belongs to Google and is never claimed here.
This folder sits under `docs/` and is excluded from the published site (`docusaurus.config.ts`, `exclude`).

## windowsweep-docs#1 — [SEO][URGENT][PENDING] URL-level indexing + AEO fix list (audit 2026-11-27) · 2026-11-27 · commit `<pending>`

Status: **built and contract-verified, not published yet** (publishing is the main session's step). Each row moves to
`live-verified, google-pending` once the Retest commands pass on the live host. The product-site half is in
`aoneahsan/windowsweep-web`, `docs/search-consoles/fix-log.md`.

| Box | SA | What was wrong (evidence) | Root fix (file:line) | Contract test | Live proof (command → result) |
|---|---|---|---|---|---|
| 1 · home not indexed (Discovered) | SA-P26, P30, P20 | 200 with its own title and canonical; Google has not fetched it. Also found: every slashed address (`/about/`, `/faq/`, `/sitemap/`) answered **404** under `trailingSlash: false` (probed 2026-11-27) | `trailingSlash: true`, `docusaurus.config.ts:308` (was `:271` `false`); publisher graph on every page `:87`, `:297`; FAQPage for the home page's visible questions, `plugins/faq-schema.ts` | `plugins/seo-contract.mts` (`yarn build` → `yarn seo:contract`): `<route>/index.html` only, slashed self-canonical, publisher ids, FAQPage | `curl -s -o /dev/null -w '%{http_code}' https://windowsweep-docs.aoneahsan.com/about/` → 200; `/about` → 301 |
| 2 · 13 `/compare` pages not indexed | SA-P32 | Each page is already this product's own: rival's maker, plans and prices copied with the date read (7 November 2026), a nofollow link to the rival's page, "the part this replaces", the windowsweep sections and commands in order. No thin page; the hub keeps 13 rivals | No content change; slashed URLs and entity graph as above | per-page title/description/canonical | `curl -s https://windowsweep-docs.aoneahsan.com/compare/ccleaner/ \| grep -c 'Last checked 7 November 2026'` → 1 |
| 3 · 6 `/white-label` pages | SA-P32 | Product-specific (desktop `.exe`/`.msi` and npm groups, update keys on GitHub Releases, SmartScreen) | Kept indexable and in the sitemap; FAQPage for `/white-label/faq/` from its visible `##` questions, `plugins/faq-schema.ts` | FAQPage on FAQ pages, every question visible | `curl -s https://windowsweep-docs.aoneahsan.com/white-label/faq/ \| grep -c FAQPage` → 1 |
| 4 · 20 tag pages crawled, not indexed; `/tags/plans` noindex | SA-P32, P31 | Docusaurus generated `/tags/*` from front matter `tags:`; the theme wrappers `src/theme/DocTagDocListPage`, `src/theme/DocTagsListPage` forced noindex on them | Front matter `tags:` → `topics:` in all 40 docs; wrappers deleted; `/sitemap` chips read `topics` (`plugins/site-pages.ts:172`); every old `/tags/<x>/` redirects to the page the topic is about (`plugins/seo-redirects.mts`, `@docusaurus/plugin-client-redirects`, `docusaurus.config.ts:439`); slashed `ignorePatterns` `:413`, `:416` | "a generated tag or author page" fails; "redirect … was not written" fails; no `/tags` in sitemap | `curl -sL https://windowsweep-docs.aoneahsan.com/tags/admin/ \| grep -o 'url=[^"]*'` → `url=/admin-and-elevation/` |
| 5 · feeds / `.md` mirrors | SA-P33 | `/feed.xml` and `llms.txt` "crawled, not indexed" is expected. This host serves no `.md` mirror (`/installation.md` → 404) | None needed; feed links now slashed (`plugins/site-pages-releases.ts:175`, `:188`) | sitemap excludes feeds | `curl -s https://windowsweep-docs.aoneahsan.com/feed.xml \| grep -c 'changelog/#'` → ≥1 |
| 6 · 13 other content pages | SA-P32, P06 | Manual pages specific to this tool; each in the sidebar, `/sitemap` and the footer; lastmod from git (`plugins/site-pages.ts`, `routeKey` fix `:180`, `:410`) | Slashed URLs (the slashless forms now 301 instead of the slashed ones 404ing); `llms.txt` links slashed | sitemap URLs exist, slashed, not redirects | `curl -s https://windowsweep-docs.aoneahsan.com/sitemap.xml \| grep -o '<loc>' \| wc -l` → 43 |
| 7 · AEO: no `sameAs` on the publisher | SA-P20, P30 | `WebSite.publisher` was an inline team node with no `sameAs`; no Person or Zaions node (`publisher: TEAM` at HEAD `docusaurus.config.ts:212`) | One `@graph`: Person `https://aoneahsan.com/#person` (seven `sameAs`), Organization `https://zaions.com/#organization`, the team (`parentOrganization`, product GitHub and npm `sameAs`), WebSite (publisher Zaions, author the person, about the product), SoftwareApplication, SoftwareSourceCode, `docusaurus.config.ts:87-180`, `:297`; footer credit names both, `:578`; `static/llms.txt` Publisher line | "publisher graph lacks …", "the person has no sameAs" | `curl -s https://windowsweep-docs.aoneahsan.com/ \| grep -o 'orcid.org/0009-0006-2311-8687' \| head -1` |
| 8 · AEO: FAQ visible, no FAQPage | SA-P30 | The home page shows "What people ask before they run it" (two bold questions) with no FAQPage; `/white-label/faq/` likewise. `/faq/` already had one (`docs/faq.mdx`) | `plugins/faq-schema.ts`, read off the built HTML at postBuild, in the initial HTML | "FAQPage blocks on an FAQ page", "FAQ question not visible" | `curl -s https://windowsweep-docs.aoneahsan.com/ \| grep -c '"@type":"FAQPage"'` → 1 |

Also fixed on the way (link law, owner 2026-11-25): `zaions.com`, sibling `*.aoneahsan.com` products, the owner's LinkedIn,
ORCID and npm profile and the sibling tools' npm pages were `nofollow` (`plugins/rehype-third-party-links.ts`); they are
do-follow now.

Retired with the tags (owner decision 2026-11-27): `blog/authors.yml` deleted, `onInlineAuthors: 'ignore'`
(`docusaurus.config.ts:387`), so a future post names the team inline and no `/blog/authors` page is generated. The
blog has no post, so no `/blog/*` address was ever published and none needs a redirect.

Overruled by owner law:
- Box 3 "add noindex,follow and drop white-label pages from sitemap.xml" → kept indexable and in the sitemap; they
  name this product's own groups and delivery (link law: public pages are never noindex).
- Box 4 "add noindex,follow to tag pages" → tag pages switched off and their addresses redirected; the noindex
  wrappers were deleted.
- Box 5 "send X-Robots-Tag: noindex on .md mirrors" → none exist on this host; on hosts that have them the rule is a
  `Link: rel="canonical"` header, never noindex.

### Pending

| Box | Why not done | Who | Next action |
|---|---|---|---|
| All rows · publish and live proof | Dispatch forbids deploy | main session | `git fetch o gh-pages:refs/remotes/o/gh-pages`; worktree in the workspace `temp/`; copy `build/` with `.nojekyll`; push `gh-pages`; `gh api -X POST repos/aoneahsan/windowsweep-docs/pages/builds`; render at 1440 and 390; run Retest; IndexNow the changed URLs |
| 1 · aoneahsan.com project page linking here | Portfolio repository, outside this scope | portfolio session | Link the docs home from the project page |
| 1, 2, 3, 6 · indexing | Google's decision | owner (GSC) | After publish: submit `sitemap.xml` again, Request indexing for `/`, Validate fix on the "Excluded by noindex" and tag rows |
| `docs/about.md` naming Zaions and Ahsan Mahmood in its body | The page mirrors `windowsweep/docs/author.md` (product repo, outside this scope); the footer on every page already names both | main session | If wanted, add the sentence to `windowsweep/docs/author.md` first, then mirror |

### Retest

```bash
D=https://windowsweep-docs.aoneahsan.com
for p in "" about faq compare/ccleaner white-label/faq sitemap feed; do printf '%s ' "/$p"; curl -s -o /dev/null -w '%{http_code}\n' "$D/$p${p:+/}"; done   # 200 each
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' $D/about                                 # 301 …/about/
curl -s $D/tags/plans/ | grep -o 'url=[^"]*'                                                     # url=/plans/
curl -s $D/sitemap.xml | grep -o '<loc>[^<]*' | grep -vc '/$'                                     # 0
curl -s $D/sitemap.xml | grep -c '/tags/'                                                        # 0
curl -s $D/compare/ccleaner/ | grep -o '<meta[^>]*name="robots"[^>]*>'                            # index, follow
curl -s $D/ | grep -o '"@id":"https://aoneahsan.com/#person"' | head -1
curl -s $D/ | grep -c '"@type":"FAQPage"'                                                        # 1
yarn build                                                                                       # ends in seo-contract: … passes
```
