/**
 * Redirects for addresses search engines still ask for, in one list the build-output contract re-checks
 * (`plugins/seo-contract.mts`).
 *
 * Until 2026-11-27 the docs generated a page per tag under `/tags/*`: 45 lists of pages a reader already reaches
 * from the sidebar and `/sitemap`, no words of their own. Google crawled 20 of them and indexed none, and one more
 * carried `noindex` (windowsweep-docs#1, SA-P32). Pages keep their labels as `topics:` front matter, shown as
 * chips on `/sitemap`, and every old tag address leads to the page that topic is really about.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** One redirect, in the shape `@docusaurus/plugin-client-redirects` takes. */
export interface Redirect {
  readonly to: string;
  readonly from: string[];
}

/**
 * Topics whose page has another name. Each maps to the page that answers the topic, read from that page's own
 * heading; a topic with no page of its own and no entry here lands on `/sitemap/`, which lists them all.
 */
const TOPIC_PAGES: Readonly<Record<string, string>> = {
  admin: '/admin-and-elevation/',
  elevation: '/admin-and-elevation/',
  uac: '/admin-and-elevation/',
  install: '/installation/',
  npx: '/installation/',
  cli: '/cli-reference/',
  flags: '/cli-reference/',
  reference: '/cli-reference/',
  automation: '/cli-reference/',
  'protected-paths': '/safety-model/',
  safety: '/safety-model/',
  'idle-gate': '/safety-model/',
  'self-test': '/safety-model/',
  'dry-run': '/quick-start/',
  caches: '/sections/',
  cleanup: '/sections/',
  logs: '/reports-and-logs/',
  reports: '/reports-and-logs/',
  json: '/reports-and-logs/',
  runs: '/plans/',
  tauri: '/desktop/',
  tours: '/desktop-tours/',
  agents: '/ai-integration-guide/',
  releases: '/changelog/',
  moving: '/compare/',
  licensing: '/white-label/',
  verification: '/white-label/verify/',
  setup: '/white-label/setup/',
  team: '/about/',
  terms: '/legal-notice/',
  overview: '/',
  windows: '/',
  'disk-space': '/',
  privacy: '/desktop/',
  powershell: '/installation/',
};

/** Docusaurus's tag permalink for a label: lower case, spaces to dashes. */
const slug = (label: string): string => label.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Reads every topic used in `docs/**` front matter, in either YAML form (`topics: [a, b]` or a `- a` list).
 *
 * @param docsDir - the docs folder
 * @param files - Markdown files relative to it
 * @returns the topic labels
 */
function topicsIn(docsDir: string, files: readonly string[]): Set<string> {
  const topics = new Set<string>();
  for (const file of files) {
    const source = readFileSync(path.join(docsDir, file), 'utf8');
    const frontMatter = source.startsWith('---') ? (source.split('---', 3)[1] ?? '') : '';
    const inline = /^topics:\s*\[([^\]]*)\]/m.exec(frontMatter)?.[1];
    const block = /^topics:\s*\n((?:\s+-\s+.*\n?)+)/m.exec(frontMatter)?.[1];
    const labels =
      inline?.split(',') ?? block?.split('\n').map((line) => line.replace(/^\s+-\s+/, '')) ?? [];
    for (const label of labels)
      if (label.trim()) topics.add(label.trim().replace(/^['"]|['"]$/g, ''));
  }
  return topics;
}

/** The published docs (the private records under docs/ never publish: docusaurus.config.ts `exclude`). */
const PRIVATE = /^(story|search-consoles)\/|^(MANUAL-TASKS|PACKAGES|PENDING-MIRROR-.*)\.md$/;

/**
 * Every redirect the site owns.
 *
 * @param siteDir - the docs site root
 * @returns one redirect group per target page, every path in the slashed form the site serves
 */
export function seoRedirects(siteDir: string): Redirect[] {
  const docsDir = path.join(siteDir, 'docs');
  const files = readdirSync(docsDir, { recursive: true, encoding: 'utf8' })
    .map((file) => file.split(path.sep).join('/'))
    .filter((file) => /\.mdx?$/.test(file) && !PRIVATE.test(file));
  const routes = new Set(
    files.map((file) =>
      `/${file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')}/`.replace(/\/+$/, '/')
    )
  );
  const byTarget = new Map<string, string[]>();
  const add = (to: string, from: string): void => {
    byTarget.set(to, [...(byTarget.get(to) ?? []), from]);
  };
  add('/sitemap/', '/tags/');
  // Two labels can share one permalink: one redirect per permalink.
  for (const tag of new Set([...topicsIn(docsDir, files)].map(slug))) {
    const own = [`/${tag}/`, `/compare/${tag}/`, `/white-label/${tag}/`].find((route) =>
      routes.has(route)
    );
    add(own ?? TOPIC_PAGES[tag] ?? '/sitemap/', `/tags/${tag}/`);
  }
  return [...byTarget].map(([to, from]) => ({ to, from }));
}
