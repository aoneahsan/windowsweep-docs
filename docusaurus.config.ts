import { existsSync } from 'node:fs';
import { themes as prismThemes, type PrismTheme, type PrismThemeEntry } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { createSitemapItems } from './plugins/site-pages';
import rehypeTableScroll from './plugins/rehype-table-scroll';
import rehypeThirdPartyLinks from './plugins/rehype-third-party-links';

// ---------------------------------------------------------------------------
// windowsweep — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://github.com/aoneahsan/windowsweep
//                 (npm: https://www.npmjs.com/package/windowsweep)
//
// Domain derivation (see ~/.claude/rules/docs-sites.md): the product's deployed
// domain is https://windowsweep.aoneahsan.com (the marketing site, live since
// 2026-09-08), so the docs domain is windowsweep-docs.aoneahsan.com. Pinned in
// static/CNAME. The rule derives a docs domain from the VERIFIED deployed
// domain, and both halves now resolve to the same base. HTTPS has been live
// here since 2026-09-12.
//
// Deployment: GitHub Pages ONLY, published manually from a verified build.
// This repo is PUBLIC and contains no Firebase config and no secrets.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://windowsweep-docs.aoneahsan.com';
const TOOL_VERSION = '1.4.5';

// 🔴 The release gate's two public client identifiers come from the environment, never a literal in
// this public repo. Docusaurus loads no .env of its own, so the untracked `.env.local` (then `.env`) is
// loaded here; a variable already set in the shell wins, because loadEnvFile never overwrites one.
for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}
const supabaseUrl = process.env.DOCS_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = process.env.DOCS_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
// 🔴 A production build without them ships a release gate that never reads a record: the live docs
// ran so from 2026-11-04 until this guard (found on the test channel, 2026-11-05). Refuse to build.
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabasePublishableKey)) {
  throw new Error(
    'DOCS_SUPABASE_URL and DOCS_SUPABASE_PUBLISHABLE_KEY are required for a build (the release gate). ' +
      'Put the two public client identifiers in .env.local (see CLAUDE.md "Checks and deploy").'
  );
}
const releaseChannel = process.env.DOCS_RELEASE_CHANNEL === 'test' ? 'test' : 'production';
/* The release-notes signup in the footer (D90): the FilesHub list, its subscribe-only browser key (FilesHub key
   92, a public client identifier) and an optional Turnstile site key. All optional: without the first two the
   footer has no signup row. */
const newsletterListId = process.env.DOCS_NEWSLETTER_LIST_ID?.trim() ?? '';
const newsletterKey = process.env.DOCS_FILESHUB_NEWSLETTER_KEY?.trim() ?? '';
const turnstileSiteKey = process.env.DOCS_TURNSTILE_SITE_KEY?.trim() ?? '';

// The one agent this site's structured data names (team-voice TV-11, owner decisions D45 and
// D46, 2026-09-25: a product speaks as its team, never as one person). Its name is the footer
// column's title on every page and its url the team page, the same pair both llms.txt files
// carry, so a machine reading any of them finds one entity.
const TEAM = {
  '@type': 'Organization',
  name: 'The windowsweep team',
  url: 'https://windowsweep-docs.aoneahsan.com/about',
} as const;

/** A code theme with every token style passed through `fix`. */
function restyle(theme: PrismTheme, fix: (style: PrismThemeEntry) => PrismThemeEntry): PrismTheme {
  return { ...theme, styles: theme.styles.map((s) => ({ ...s, style: fix(s.style) })) };
}

// The code themes, with every token colour that fell under WCAG AA on its own code background darkened
// within its hue to 4.6:1 or more (contrast sweep, 2026-10-31). Light, GitHub on #f6f8fa: comments
// 2.71:1, strings 4.32:1, numbers and properties 2.58:1, at-rules and attribute names 2.69:1,
// functions 4.30:1, and namespaces dimmed to 0.7 opacity 4.48:1. Dark, Dracula on #282a36: comments
// 3.03:1; its other colours pass.
const LIGHT_CODE_COLOURS: Record<string, string> = {
  '#999988': '#717161',
  '#e3116c': '#da1067',
  '#36acaa': '#277b7a',
  '#00a4db': '#0078a0',
  '#d73a49': '#d42d3d',
};
const lightCodeTheme = restyle(prismThemes.github, (style) => ({
  ...style,
  ...(style.color && LIGHT_CODE_COLOURS[style.color]
    ? { color: LIGHT_CODE_COLOURS[style.color] }
    : {}),
  ...(style.opacity === 0.7 ? { opacity: 0.8 } : {}),
}));
const darkCodeTheme = restyle(prismThemes.dracula, (style) =>
  style.color === 'rgb(98, 114, 164)' ? { ...style, color: '#8b9ac9' } : style
);

// Analytics are env-gated: an absent key means the provider is skipped
// entirely, so a clone with no secrets still builds. Never inline a real key.
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim();

const config: Config = {
  title: 'windowsweep',
  tagline:
    'Windows cleanup CLI: dry-run first, personal files chosen row by row, zero install via npx.',
  favicon: 'img/favicon.svg',

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'windowsweep-docs',

  customFields: {
    releaseVersion: TOOL_VERSION,
    releaseChannel,
    supabaseUrl,
    supabasePublishableKey,
    newsletterListId,
    newsletterKey,
    turnstileSiteKey,
  },

  // The build IS the link checker. Anything broken fails CI rather than
  // shipping a dead link to a page about deleting files.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // SEO + AI-citability head tags. The JSON-LD payloads let Google Rich
  // Results, Perplexity, ChatGPT and Claude extract structured entity data
  // when citing this documentation.
  // 🔴 NOTHING PAGE-SPECIFIC GOES IN HERE. Every entry is emitted on EVERY page.
  // A hardcoded `rel="canonical"` pointing at `${SITE_URL}/` used to sit at the top of
  // this array. Docusaurus already emits a correct PER-PAGE canonical (react-helmet,
  // `data-rh="true"`) from `url` + `baseUrl`, so the hardcoded one was a second, wrong
  // canonical on all 50 non-home pages - each of them declaring the front page as its
  // canonical version, i.e. telling search engines the whole site is duplicates of `/`.
  // Measured 2026-09-07: 51 of 51 pages carried both tags. Do not re-add it.
  headTags: [
    {
      tagName: 'meta',
      attributes: { name: 'application-name', content: 'windowsweep Docs' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'apple-mobile-web-app-title', content: 'windowsweep' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#4d7c0f' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'windowsweep Documentation',
        url: SITE_URL,
        description:
          'Documentation for windowsweep, a Windows command-line utility that clears regenerable caches and offers large or old files in Downloads and folders you add for individual Recycle Bin removal. Credentials and browser state remain protected.',
        inLanguage: 'en',
        publisher: TEAM,
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'windowsweep',
        codeRepository: 'https://github.com/aoneahsan/windowsweep',
        programmingLanguage: 'PowerShell',
        runtimePlatform: 'Windows PowerShell 5.1 or PowerShell 7 on Windows 10 and 11',
        license: 'https://opensource.org/licenses/MIT',
        author: TEAM,
        description:
          'Windows PowerShell cleanup utility with a zero-dependency Node launcher. Prunes yarn/npm/pnpm/bun/deno/pip/NuGet/Cargo/Go caches, browser and editor caches, Docker layers, Android emulator images, Windows Update leftovers, stale node_modules and partial downloads — every deletion through one chokepoint with a declared root, an idle gate and a real dry-run.',
        keywords:
          'windows, cleanup, disk-cleanup, cache-cleanup, disk-space, node-modules, npm-cache, yarn-cache, developer-tools, powershell, cli, dry-run',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        // One entity across the site and the docs (search audit SA-WINDOWSWEEP-005, 2026-10-31):
        // the same `@id`, url, category and operating systems as the website's node, so
        // answer engines see one product. The plan set (D56, 2026-10-30) replaced the
        // 2026-09-05 no-pricing decision; `offers` lives on the website's /pricing node,
        // generated from the plan rows, and is not repeated here.
        // 🔴 `@type` is required on every node (SA-WINDOWSWEEP-013, 2026-11-05: the 005 fix left
        // it out and every probe still matched); plugins/discovery-facts.ts fails the build without it.
        '@type': 'SoftwareApplication',
        '@id': 'https://windowsweep.aoneahsan.com/#software',
        name: 'windowsweep',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Windows 10 (1809 and later), Windows 11',
        url: 'https://windowsweep.aoneahsan.com/',
        author: TEAM,
        description:
          'Command-line disk and cache cleanup for Windows developers: a guided walkthrough, a read-only scan, a real dry-run, JSON reports, and an optional large or old file scanner with individual Recycle Bin removal.',
        softwareVersion: TOOL_VERSION,
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    /* No separate `Organization` node: the three nodes above carry `TEAM` inline, and the footer
       column names it on every page. Until 2026-09-25 they named a `Person`; the team-voice run
       (content-map row 9, D45) replaced it - and an earlier node naming a person as an
       organisation with himself as founder was removed on 2026-09-13 for describing an entity no
       page showed. Schema that describes what no page shows is the one thing this data may not do. */
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Offline/local search — no third-party service, no API key, nothing to
      // leak from a public repo.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // `docs/` is BOTH the published content dir and the home of the
          // fixed-path internal file docs/MANUAL-TASKS.md. Keep the path (the
          // global rule fixes it) but never publish it — this repo is public.
          // NOTE: `exclude` REPLACES the plugin defaults, so they are restated.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            'PACKAGES.md',
            // docs/PENDING-MIRROR-<version>.md holds replacement lines staged for a release that has
            // not shipped yet. Same problem as MANUAL-TASKS.md: it sits under docs/, so without this
            // entry it would publish as a page announcing a version that does not exist.
            'PENDING-MIRROR-*.md',
            // docs/story/ (the Story Bible, voice fingerprint, content map, decision log and
            // drafts) is internal working material for the storytelling system. It sits under
            // docs/ like MANUAL-TASKS.md does, so without this entry it would ship as public
            // pages. See ~/.claude/rules/storytelling-content.md.
            'story/**',
          ],
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/windowsweep-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
          // Every table sits in a labelled, keyboard-focusable scroll region (F-EXP-006).
          rehypePlugins: [rehypeTableScroll, rehypeThirdPartyLinks],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        // Google ignores changefreq and priority, so neither is emitted. lastmod is the day each
        // page's words last changed, and /search and the tag listings (noindex) stay out - see
        // createSitemapItems in plugins/site-pages.ts.
        sitemap: {
          changefreq: null,
          priority: null,
          lastmod: 'date',
          ignorePatterns: ['/tags', '/tags/**', '/search', '/search/**'],
          createSitemapItems,
        },
        ...(gaMeasurementId ? { gtag: { trackingID: gaMeasurementId, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
  ],

  // /sitemap, /feed, /feed.xml, the 404 page's head and the noindex check on utility pages.
  plugins: [
    './plugins/site-pages.ts',
    './plugins/worker-fingerprint.ts',
    ['./plugins/discovery-facts.ts', { version: TOOL_VERSION }],
  ],

  themeConfig: {
    // Most social scrapers ignore SVG, so the card was effectively missing. The SVG stays the
    // master and this PNG is a re-runnable 1200x630 export of it - re-export whenever the master changes.
    image: 'img/social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for windowsweep — a Windows PowerShell CLI that reclaims disk space by pruning regenerable caches (yarn, npm, pnpm, browsers, editors, Docker, Gradle, Cypress, Playwright, Android AVDs, stale node_modules) behind one deletion chokepoint and an idle gate.',
      },
      {
        name: 'keywords',
        content:
          'windows cleanup, free disk space windows, clear yarn cache, clear npm cache, delete node_modules, windows disk full, windows temp files cleanup, powershell cleanup script, safe disk cleanup, windows cache cleaner cli, windows update cache cleanup',
      },
      { name: 'author', content: 'The windowsweep team' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'windowsweep Docs' },
      { property: 'og:locale', content: 'en_GB' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'The windowsweep team' },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'windowsweep',
      logo: {
        alt: 'windowsweep logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/safety-model', label: 'Safety model', position: 'left' },
        { to: '/quick-start', label: 'Quick start', position: 'left' },
        { to: '/cli-reference', label: 'CLI', position: 'left' },
        { to: '/changelog', label: 'Changelog', position: 'right' },
        {
          // The product's canonical homepage, live since 2026-09-08. It is a
          // different site in a different repository, so this is an href and it
          // leaves the origin.
          href: 'https://windowsweep.aoneahsan.com',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/aoneahsan/windowsweep',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start here',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Safety model', to: '/safety-model' },
            { label: 'Quick start', to: '/quick-start' },
            { label: 'Installation', to: '/installation' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'CLI reference', to: '/cli-reference' },
            { label: 'Sections 0-29', to: '/sections' },
            { label: 'Reports and logs', to: '/reports-and-logs' },
            { label: 'Changelog', to: '/changelog' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Source (GitHub)', href: 'https://github.com/aoneahsan/windowsweep' },
            { label: 'npm package', href: 'https://www.npmjs.com/package/windowsweep' },
            { label: 'Report an issue', href: 'https://github.com/aoneahsan/windowsweep/issues' },
          ],
        },
        {
          title: 'The windowsweep team',
          items: [
            { label: 'About the team', to: '/about' },
            { label: 'Contact', href: 'https://windowsweep.aoneahsan.com/contact' },
          ],
        },
        {
          title: 'Find everything',
          items: [
            { label: 'Sitemap', to: '/sitemap' },
            { label: 'Release feed', to: '/feed' },
            // feed.xml is written after the build, where the link checker cannot see it, so it and
            // llms.txt are linked by their absolute URLs.
            { label: 'RSS (feed.xml)', href: `${SITE_URL}/feed.xml` },
            { label: 'llms.txt', href: `${SITE_URL}/llms.txt` },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. windowsweep is MIT-licensed and provided without warranty — it deletes files.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['powershell', 'json', 'diff', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
