import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { BlogContent } from '@docusaurus/plugin-content-blog';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import sidebars from '../sidebars';

/**
 * site-pages - the four discovery routes every docs site ships.
 *
 * - `/sitemap`    a readable page of every docs page, grouped in sidebar order.
 * - `/feed`       a readable list of releases.
 * - `/feed.xml`   RSS 2.0 of the same releases, written after the build.
 * - `sitemap.xml` a truthful lastmod on every URL, through {@link createSitemapItems}.
 *
 * `docs/changelog.md` is the only release source. It is Keep a Changelog: every release is a
 * `## [X.Y.Z] - YYYY-MM-DD` heading with `### Added` / `### Changed` / `### Fixed` lists under it, and
 * `## [Unreleased]` is skipped. The page and the feed are both parsed from it, so neither can disagree
 * with it. Ported from macleanup-docs, whose changelog has a different shape.
 */

import {
  CHANGELOG,
  SITE_DIR,
  firstSentence,
  readReleases,
  renderFeedXml,
  type Release,
} from './site-pages-releases';

export type { Release, ReleaseSection } from './site-pages-releases';

/** One card on the /sitemap page. */
export type SitemapCard = {
  title: string;
  description: string;
  permalink: string;
  tags: string[];
  keywords: string[];
  external?: boolean;
};

/** One group of cards on the /sitemap page, in sidebar order. */
export type SitemapGroup = { key: string; label: string; cards: SitemapCard[] };

/** One blog post as /feed lists it: published on `date` (`YYYY-MM-DD`, its own front matter). */
export type FeedPost = { title: string; description: string; permalink: string; date: string };

/**
 * The blog posts the blog plugin loaded, newest first. Drafts are already gone from a production build; an unlisted
 * post stays out, as it does from the blog's own lists. Empty while the blog is off (no post in blog/ yet).
 *
 * @param blog - the blog plugin's loaded content, or undefined while the blog is off
 * @returns the posts /feed and /sitemap list
 */
function blogPosts(blog: BlogContent | undefined): FeedPost[] {
  return (blog?.blogPosts ?? [])
    .filter((post) => !post.metadata.unlisted)
    .map(({ metadata }) => ({
      title: metadata.title,
      description: metadata.description,
      permalink: metadata.permalink,
      date: new Date(metadata.date).toISOString().slice(0, 10),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const SITEMAP_PAGE = 'src/components/SitemapPage/index.tsx';
const FEED_PAGE = 'src/components/FeedPage/index.tsx';

/** Today in the local time zone, the zone `git log --format=%cs` reports a commit date in. */
function localToday(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
const TODAY = localToday();

/** The sitemap plugin's item shape (not exported by @docusaurus/plugin-sitemap). */
type SitemapItem = { url: string; lastmod?: string | null };

type SidebarItem = string | { type: string; id?: string; label?: string; items?: SidebarItem[] };
type Group = { key: string; label: string; ids: string[] };

/**
 * Labels for the runs of top-level docs between the sidebar's categories, keyed by the doc that opens the
 * run. A run opened by any other doc fails the build, so no group ships without a name.
 */
const RUN_GROUPS: Record<string, { key: string; label: string }> = {
  intro: { key: 'start', label: 'Start here' },
  desktop: { key: 'desktop-and-sections', label: 'Desktop app and sections' },
  troubleshooting: { key: 'help', label: 'Help, releases and the team' },
};

const slug = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every doc id under a sidebar item, depth first. */
function docIds(item: SidebarItem): string[] {
  if (typeof item === 'string') return [item];
  if (item.type === 'doc' && item.id) return [item.id];
  if (item.type === 'category') return (item.items ?? []).flatMap(docIds);
  return [];
}

/** Sidebar walk: each category is a group, and so is each run of top-level docs between them. */
function sidebarGroups(): Group[] {
  const groups: Group[] = [];
  let run: Group | null = null;
  for (const item of sidebars.mainSidebar as SidebarItem[]) {
    if (typeof item === 'object' && item.type === 'category') {
      run = null;
      const label = item.label ?? '';
      groups.push({ key: slug(label), label, ids: docIds(item) });
      continue;
    }
    for (const id of docIds(item)) {
      if (!run) {
        const named = RUN_GROUPS[id];
        if (!named) {
          throw new Error(
            `[site-pages] sidebars.ts: "${id}" opens a /sitemap group with no label - add it to RUN_GROUPS`
          );
        }
        run = { ...named, ids: [] };
        groups.push(run);
      }
      run.ids.push(id);
    }
  }
  return groups;
}

type DocLike = {
  id: string;
  title: string;
  description: string;
  permalink: string;
  tags: { label: string }[];
  frontMatter: { keywords?: string[] };
};

/** The cross-host card. Its description is the website's own sentence, from its llms.txt. */
const WEBSITE_CARD: SitemapCard = {
  title: 'windowsweep website',
  description:
    'Where the tool is downloaded, and where an account holds what the desktop app has synced.',
  permalink: 'https://windowsweep.aoneahsan.com',
  tags: ['download', 'account'],
  keywords: ['website', 'installer', 'contact', 'privacy', 'terms'],
  external: true,
};

const ROBOTS_META = /<meta[^>]*name=["']?robots["']?[^>]*>/g;

/**
 * Fail the build when a utility page could be indexed. `/search` and the tag listings stay out of
 * sitemap.xml, so they must also say noindex (the src/theme wrappers); otherwise the sitemap would omit
 * pages a search engine may still index. Each must carry exactly one robots meta, and it must say noindex.
 */
export function assertNoIndex(outDir: string): void {
  const tagsDir = path.join(outDir, 'tags');
  const tagPages = existsSync(tagsDir)
    ? readdirSync(tagsDir)
        .filter((f) => f.endsWith('.html'))
        .map((f) => `tags/${f}`)
    : [];
  const indexable = ['search.html', 'tags.html', ...tagPages].filter((page) => {
    const file = path.join(outDir, page);
    const metas = existsSync(file) ? (readFileSync(file, 'utf8').match(ROBOTS_META) ?? []) : [];
    return metas.length !== 1 || !metas[0].includes('noindex');
  });
  if (indexable.length) {
    throw new Error(
      `[site-pages] pages without exactly one robots noindex: ${indexable.join(', ')}`
    );
  }
}

/** The local plugin. */
export default function sitePages(context: LoadContext): Plugin<Release[]> {
  const siteUrl = context.siteConfig.url.replace(/\/$/, '');
  return {
    name: 'site-pages',
    loadContent: async () => readReleases(),
    async allContentLoaded({ allContent, actions }) {
      const docsPlugin = allContent['docusaurus-plugin-content-docs'] as {
        default: { loadedVersions: { docs: DocLike[] }[] };
      };
      const releases = (allContent['site-pages'] as { default: Release[] }).default;
      const byId = new Map(docsPlugin.default.loadedVersions[0].docs.map((d) => [d.id, d]));
      const groups: SitemapGroup[] = sidebarGroups().map((g) => ({
        key: g.key,
        label: g.label,
        cards: g.ids.map((id) => {
          const doc = byId.get(id);
          if (!doc) throw new Error(`[site-pages] sidebar id "${id}" has no doc`);
          return {
            title: doc.title,
            description: doc.description,
            permalink: doc.permalink,
            tags: doc.tags.map((t) => t.label),
            keywords: doc.frontMatter.keywords ?? [],
          };
        }),
      }));
      const listed = new Set(groups.flatMap((g) => g.cards.map((c) => c.permalink)));
      const missing = [...byId.values()].filter((d) => !listed.has(d.permalink)).map((d) => d.id);
      if (missing.length) {
        throw new Error(
          `[site-pages] docs missing from the sidebar and /sitemap: ${missing.join(', ')}`
        );
      }
      // The blog, once it has posts: led by the blog's own page, its words the blog plugin's (src/data/blog.ts).
      const blog = (
        allContent['docusaurus-plugin-content-blog'] as { default?: BlogContent } | undefined
      )?.default;
      const posts = blogPosts(blog);
      if (blog && posts.length) {
        groups.push({
          key: 'blog',
          label: 'Blog',
          cards: [
            {
              title: blog.blogTitle,
              description: blog.blogDescription,
              permalink: '/blog',
              tags: ['blog'],
              keywords: ['posts'],
            },
            ...posts.map((post) => ({
              title: post.title,
              description: post.description,
              permalink: post.permalink,
              tags: ['blog'],
              keywords: [],
            })),
          ],
        });
      }
      groups.push({
        key: 'site',
        label: 'Site',
        cards: [
          {
            title: 'Release feed',
            description:
              'Every windowsweep release, newest first, with the date it shipped and what changed.',
            permalink: '/feed',
            tags: ['releases', 'rss'],
            keywords: ['changelog', 'updates', 'version'],
          },
          WEBSITE_CARD,
        ],
      });
      // The page lists each change by its opening sentence; feed.xml carries every change in full.
      const headlines = releases.map((r) => ({
        ...r,
        sections: r.sections.map((s) => ({ kind: s.kind, items: s.items.map(firstSentence) })),
      }));
      const sitemapData = await actions.createData('sitemap-page.json', JSON.stringify({ groups }));
      const feedData = await actions.createData(
        'feed-page.json',
        JSON.stringify({ releases: headlines, posts })
      );
      actions.addRoute({
        path: '/sitemap',
        component: '@site/src/components/SitemapPage',
        exact: true,
        modules: { data: sitemapData },
      });
      actions.addRoute({
        path: '/feed',
        component: '@site/src/components/FeedPage',
        exact: true,
        modules: { data: feedData },
      });
    },
    injectHtmlTags: () => ({
      headTags: [
        {
          tagName: 'link',
          attributes: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'windowsweep releases',
            href: `${siteUrl}/feed.xml`,
          },
        },
      ],
    }),
    async postBuild({ outDir, content }) {
      writeFileSync(path.join(outDir, 'feed.xml'), renderFeedXml(siteUrl, content));
      // GitHub Pages serves 404.html for every unknown path. It must not be indexable and must not
      // name itself as a canonical page.
      const notFound = path.join(outDir, '404.html');
      if (!existsSync(notFound)) throw new Error('[site-pages] build has no 404.html');
      const html = readFileSync(notFound, 'utf8')
        .replace(/<link[^>]*rel=["']?canonical["']?[^>]*>/g, '')
        .replace(/<meta[^>]*property=["']?og:url["']?[^>]*>/g, '')
        .replace(
          /(<meta[^>]*name=["']?robots["']?[^>]*content=)("[^"]*"|[^\s>]+)/g,
          '$1"noindex, follow"'
        );
      writeFileSync(notFound, html);
      assertNoIndex(outDir);
    },
  };
}

// ---------------------------------------------------------------------------
// sitemap.xml lastmod - the day each page's words last changed.
// ---------------------------------------------------------------------------

let dirtyFiles: Set<string> | null = null;
function isDirty(file: string): boolean {
  if (!dirtyFiles) {
    const status = execSync('git status --porcelain --untracked-files=all', {
      cwd: SITE_DIR,
      encoding: 'utf8',
    });
    dirtyFiles = new Set(
      status
        .split('\n')
        .filter(Boolean)
        .map((l) => l.slice(3).trim())
    );
  }
  return dirtyFiles.has(file);
}

/** Git date of a file's last commit; today when it has uncommitted changes or was never committed. */
function fileDate(file: string): string {
  if (isDirty(file)) return TODAY;
  const date = execSync(`git log -1 --format=%cs -- "${file}"`, {
    cwd: SITE_DIR,
    encoding: 'utf8',
  }).trim();
  return date || TODAY;
}

function flatten(routes: RouteConfig[]): RouteConfig[] {
  return routes.flatMap((r) => [r, ...flatten(r.routes ?? [])]);
}

const newest = (dates: (string | undefined)[]): string | undefined =>
  dates
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

/**
 * `createSitemapItems` for the sitemap plugin: no changefreq or priority, and a truthful lastmod on
 * every URL - each doc's git date, /feed the changelog's, /sitemap the newest of the pages it lists.
 * Throws on an undated URL, and on a /search or /tags URL, which `ignorePatterns` and the noindex
 * wrappers keep out.
 */
export async function createSitemapItems<T extends SitemapItem>(params: {
  defaultCreateSitemapItems: (p: {
    siteConfig: LoadContext['siteConfig'];
    routes: RouteConfig[];
  }) => Promise<T[]>;
  siteConfig: LoadContext['siteConfig'];
  routes: RouteConfig[];
}): Promise<T[]> {
  const { defaultCreateSitemapItems, ...rest } = params;
  const siteUrl = rest.siteConfig.url.replace(/\/$/, '');
  const items = await defaultCreateSitemapItems(rest);
  const utility = items.map((i) => i.url).filter((u) => /\/(search|tags)(\/|$)/.test(u));
  if (utility.length) {
    throw new Error(`[site-pages] utility URLs reached sitemap.xml: ${utility.join(', ')}`);
  }
  const byPath = new Map<string, string>();
  for (const route of flatten(rest.routes)) {
    const source = route.metadata?.sourceFilePath?.replace(/\\/g, '/').replace(/^@site\//, '');
    if (source && !byPath.has(route.path)) byPath.set(route.path, fileDate(source));
  }
  const docDates = [...byPath.values()];
  byPath.set('/feed', newest([fileDate(CHANGELOG), fileDate(FEED_PAGE)]) ?? '');
  // The blog's own page lists its posts, so it takes the newest of their dates (each post is dated by its file).
  const postDates = [...byPath].filter(([p]) => p.startsWith('/blog/')).map(([, date]) => date);
  if (postDates.length) byPath.set('/blog', newest(postDates) ?? '');
  byPath.set(
    '/sitemap',
    newest([...docDates, fileDate('sidebars.ts'), fileDate(SITEMAP_PAGE)]) ?? ''
  );
  const undated: string[] = [];
  const result = items.map((item) => {
    const p = item.url.slice(siteUrl.length) || '/';
    const lastmod = byPath.get(p);
    if (!lastmod) undated.push(p);
    return { ...item, lastmod, changefreq: null, priority: null };
  });
  if (undated.length) {
    throw new Error(`[site-pages] sitemap URLs with no lastmod: ${undated.join(', ')}`);
  }
  return result;
}
