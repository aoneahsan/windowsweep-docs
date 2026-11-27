/**
 * The build-output SEO contract (windowsweep-docs#1; SA-P24, P26, P29, P30, P31, P32): the build fails instead of
 * a search console finding it a month later. `yarn build` runs it last (`yarn seo:contract`; `.mts` so Node runs it
 * as a module), on the files GitHub Pages will serve: a separate step, because Docusaurus starts every plugin's
 * `postBuild` together and the redirect pages may not exist yet inside one. Ported from rentparty-docs.
 *
 * - `trailingSlash: true` and `onBrokenLinks: 'throw'`: every page is `<route>/index.html`, so GitHub Pages 301s
 *   `/x` to `/x/` and never 404s the slashed form (SA-P26).
 * - Every page: one `<title>`, one description, one self-canonical in the slashed form, no `noindex` (only the
 *   404 page and the local `/search` may say it, owner 2026-11-27), every JSON-LD block parses, and the publisher
 *   graph (the person, Zaions, the team, the site, the product) is in the initial HTML (SA-P20, P24, P29, P30).
 * - The FAQ pages carry FAQPage JSON-LD whose every question is visible on the page.
 * - No generated tag or blog author page is left (SA-P32): `/tags/*` answer only with redirects.
 * - Every `sitemap.xml` URL is slashed, exists in the output and is not a redirect or utility page.
 * - Every redirect the site promises exists, and lands on a page that exists (SA-P31).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Redirect, seoRedirects } from './seo-redirects.mts';

const PAGE_EXCEPTIONS = new Set(['404.html', 'search/index.html']);
/** The pages whose questions a reader sees as a list; plugins/faq-schema.ts and faq.mdx mark them up. */
const FAQ_PAGES = ['index.html', 'faq/index.html', 'white-label/faq/index.html'];
const PUBLISHER_IDS = [
  'https://aoneahsan.com/#person',
  'https://zaions.com/#organization',
  'https://windowsweep.aoneahsan.com/#team',
  'https://windowsweep.aoneahsan.com/#software',
];

function htmlFiles(dir: string, base = dir): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'assets' ? [] : htmlFiles(full, base);
    return entry.name.endsWith('.html')
      ? [path.relative(base, full).split(path.sep).join('/')]
      : [];
  });
}

const count = (html: string, pattern: RegExp): number => html.match(pattern)?.length ?? 0;
const isRedirectPage = (html: string): boolean => /http-equiv=["']?refresh/i.test(html);

/** Every JSON-LD node in a page, `@graph` members included; a block that does not parse is reported. */
function ldNodes(html: string, problems: string[]): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  for (const [, json] of html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g
  )) {
    try {
      const block = JSON.parse(json ?? '') as Record<string, unknown>;
      nodes.push(
        ...(Array.isArray(block['@graph'])
          ? (block['@graph'] as Record<string, unknown>[])
          : [block])
      );
    } catch {
      problems.push('a JSON-LD block does not parse');
    }
  }
  return nodes;
}

/** Visible words, tags out, entities that matter decoded, whitespace folded. */
const visibleText = (html: string): string =>
  html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1');

/**
 * Checks one built page against the contract.
 *
 * @param html - the page's HTML
 * @param file - its path relative to the output folder
 * @param siteUrl - the site origin
 * @returns the problems found, empty when the page passes
 */
export function pageProblems(html: string, file: string, siteUrl: string): string[] {
  if (PAGE_EXCEPTIONS.has(file) || isRedirectPage(html)) return [];
  const problems: string[] = [];
  if (!file.endsWith('index.html'))
    problems.push('a page outside <route>/index.html is a 404 for its slashed address');
  if (/^(tags|blog\/tags|blog\/authors)\//.test(file))
    problems.push('a generated tag or author page (SA-P32)');
  const titles = count(html, /<title[\s>]/g);
  const descriptions = count(html, /<meta[^>]+name=["']?description["']?[\s>/]/g);
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']?canonical["']?[^>]*>/g)];
  if (titles !== 1) problems.push(`${titles} <title> tags`);
  if (descriptions !== 1) problems.push(`${descriptions} meta descriptions`);
  if (canonicals.length !== 1) problems.push(`${canonicals.length} canonicals`);
  const href = /href=["']?([^"'\s>]+)/.exec(canonicals[0]?.[0] ?? '')?.[1] ?? '';
  const own = `${siteUrl}/${file.replace(/index\.html$/, '')}`;
  if (canonicals.length === 1 && href !== own) problems.push(`canonical ${href} is not ${own}`);
  if (/<meta[^>]+name=["']?robots["']?[^>]+noindex/i.test(html))
    problems.push('noindex on a public page');
  const nodes = ldNodes(html, problems);
  const ids = new Set(nodes.map((node) => String(node['@id'] ?? '')));
  const missing = PUBLISHER_IDS.filter((id) => !ids.has(id));
  if (missing.length) problems.push(`publisher graph lacks ${missing.join(', ')}`);
  const person = nodes.find((node) => node['@id'] === PUBLISHER_IDS[0]);
  if (person && !(Array.isArray(person.sameAs) && person.sameAs.length >= 5))
    problems.push('the person has no sameAs');
  if (nodes.some((node) => node['@type'] === undefined))
    problems.push('a JSON-LD node without @type');
  if (nodes.some((node) => JSON.stringify(node).includes('SearchAction')))
    problems.push('a SearchAction');
  if (FAQ_PAGES.includes(file)) {
    const faqs = nodes.filter((node) => node['@type'] === 'FAQPage');
    const text = visibleText(html);
    if (faqs.length !== 1) problems.push(`${faqs.length} FAQPage blocks on an FAQ page`);
    for (const question of (faqs[0]?.mainEntity as { name?: string }[] | undefined) ?? []) {
      if (!text.includes(question.name ?? ''))
        problems.push(`FAQ question not visible: ${question.name}`);
    }
  }
  return problems.map((problem) => `${file}: ${problem}`);
}

/** The file GitHub Pages serves for a route under `trailingSlash: true`. */
const servedFile = (outDir: string, route: string): string =>
  path.join(outDir, route.replace(/^\/|\/$/g, ''), 'index.html');

/**
 * Checks the whole output folder.
 *
 * @param params.outDir - the build folder
 * @param params.siteUrl - the site origin
 * @param params.redirects - every redirect the site must serve
 * @returns the problems found
 */
export function checkBuild({
  outDir,
  siteUrl,
  redirects,
}: {
  outDir: string;
  siteUrl: string;
  redirects: readonly Redirect[];
}): string[] {
  const problems: string[] = [];
  for (const file of htmlFiles(outDir)) {
    problems.push(...pageProblems(readFileSync(path.join(outDir, file), 'utf8'), file, siteUrl));
  }
  const sitemap = path.join(outDir, 'sitemap.xml');
  if (!existsSync(sitemap)) problems.push('sitemap.xml is missing');
  else {
    for (const [, loc = ''] of readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!loc.startsWith(`${siteUrl}/`)) {
        problems.push(`sitemap: ${loc} is on another host`);
        continue;
      }
      if (!loc.endsWith('/')) problems.push(`sitemap: ${loc} is not in the slashed form`);
      if (/\/(search|tags)(\/|$)/.test(loc)) problems.push(`sitemap: ${loc} is a utility page`);
      const file = servedFile(outDir, loc.slice(siteUrl.length));
      if (!existsSync(file)) problems.push(`sitemap: ${loc} has no page in the output`);
      else if (isRedirectPage(readFileSync(file, 'utf8')))
        problems.push(`sitemap: ${loc} is a redirect`);
    }
  }
  for (const { to, from } of redirects) {
    const target = servedFile(outDir, to);
    if (!existsSync(target) || isRedirectPage(readFileSync(target, 'utf8')))
      problems.push(`redirect target ${to} has no page`);
    for (const source of from) {
      const file = servedFile(outDir, source);
      if (!existsSync(file) || !isRedirectPage(readFileSync(file, 'utf8')))
        problems.push(`redirect ${source} → ${to} was not written`);
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const siteDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const config = readFileSync(path.join(siteDir, 'docusaurus.config.ts'), 'utf8');
  const siteUrl = /const SITE_URL\s*=\s*'(https?:\/\/[^']+)'/.exec(config)?.[1] ?? '';
  const problems: string[] = [];
  if (!siteUrl) problems.push('SITE_URL not found in docusaurus.config.ts');
  if (!/^\s*trailingSlash: true,/m.test(config))
    problems.push('trailingSlash must be true: GitHub Pages 404s the slashed form otherwise');
  if (!/^\s*onBrokenLinks: 'throw',/m.test(config)) problems.push("onBrokenLinks must be 'throw'");
  if (existsSync(path.join(siteDir, 'blog', 'authors.yml')))
    problems.push('blog/authors.yml generates /blog/authors (SA-P32)');
  problems.push(
    ...checkBuild({
      outDir: path.join(siteDir, 'build'),
      siteUrl,
      redirects: seoRedirects(siteDir),
    })
  );
  if (problems.length > 0) {
    process.stderr.write(
      `seo-contract: ${problems.length} problem(s)\n${problems.slice(0, 60).join('\n')}\n`
    );
    process.exit(1);
  }
  process.stdout.write('seo-contract: every page, sitemap URL and redirect passes\n');
}
