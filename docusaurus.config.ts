import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { themes as prismThemes, type PrismTheme, type PrismThemeEntry } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { createSitemapItems } from './plugins/site-pages';
import { seoRedirects } from './plugins/seo-redirects.mts';
import faqSchema from './plugins/faq-schema';
import rehypeTableScroll from './plugins/rehype-table-scroll';
import rehypeThirdPartyLinks from './plugins/rehype-third-party-links';
import { BLOG_DESCRIPTION, BLOG_PATH, BLOG_TITLE } from './src/data/blog';
import { OTHER_PLATFORMS } from './src/data/platforms';

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
const SITE_DIR = fileURLToPath(new URL('.', import.meta.url));

/**
 * Whether blog/ holds a post yet. Until it does, the blog stays off: an empty blog page would sit in sitemap.xml with
 * nothing on it, and a Blog link would point at it. The first post added to blog/ turns on the blog, its RSS and Atom
 * feeds, its search index, its dated sitemap entries, its Blog group on /sitemap and Posts on /feed, and the Blog links.
 */
const BLOG_DIR = fileURLToPath(new URL('./blog', import.meta.url));
const HAS_POSTS =
  existsSync(BLOG_DIR) &&
  readdirSync(BLOG_DIR).some((name) => name.endsWith('.md') || name.endsWith('.mdx'));
const TOOL_VERSION = '1.5.0';

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
   92, a public client identifier) and an optional Turnstile site key. Without the first two the footer has no
   signup row, so a production build needs both. */
const newsletterListId = process.env.DOCS_NEWSLETTER_LIST_ID?.trim() ?? '';
const newsletterKey = process.env.DOCS_FILESHUB_NEWSLETTER_KEY?.trim() ?? '';
const turnstileSiteKey = process.env.DOCS_TURNSTILE_SITE_KEY?.trim() ?? '';
// 🔴 A build without them drops the signup from every page and still passes: the 2026-11-14 publish from a
// machine whose .env.local held only the release-gate pair shipped the docs without it. Refuse to build.
if (process.env.NODE_ENV === 'production' && (!newsletterListId || !newsletterKey)) {
  throw new Error(
    'DOCS_NEWSLETTER_LIST_ID and DOCS_FILESHUB_NEWSLETTER_KEY are required for a build (the footer signup). ' +
      'Put the two public client identifiers in .env.local (see CLAUDE.md "Checks and deploy").'
  );
}

// The publisher entity on every page (owner decision 2026-11-27; windowsweep-docs#1 AEO, SA-P20/P30): the
// person behind the product and the Zaions organisation, the same `@id`s and values as aoneahsan.com
// (projects-finalization-record/ecosystem/owner-profile.json), so answer engines join this site to them.
// The windowsweep team stays the visible author: its name is a footer column on every page and its
// url the team page, which names Zaions and Ahsan Mahmood (docs/about.md). The footer credits both on
// every page, so no node here describes an entity the reader cannot see.
const PERSON_ID = 'https://aoneahsan.com/#person';
const ZAIONS_ID = 'https://zaions.com/#organization';
const TEAM_ID = 'https://windowsweep.aoneahsan.com/#team';
const SOFTWARE_ID = 'https://windowsweep.aoneahsan.com/#software';
const PUBLISHER_GRAPH = [
  {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Ahsan Mahmood',
    alternateName: ['Ahsan', 'aoneahsan', 'a1ahsan', 'A1 Ahsan', 'AOne Ahsan'],
    url: 'https://aoneahsan.com',
    jobTitle: 'Founder and developer, Zaions',
    worksFor: { '@id': ZAIONS_ID },
    sameAs: [
      'https://aoneahsan.com',
      'https://zaions.com',
      'https://github.com/aoneahsan',
      'https://www.linkedin.com/in/aoneahsan',
      'https://www.npmjs.com/~aoneahsan',
      'https://www.upwork.com/freelancers/aoneahsan',
      'https://orcid.org/0009-0006-2311-8687',
    ],
  },
  {
    '@type': 'Organization',
    '@id': ZAIONS_ID,
    name: 'Zaions',
    alternateName: ['Zaions products', 'Zaions projects'],
    url: 'https://zaions.com',
    logo: 'https://zaions.com/assets/logos/zaions-mark.png',
    founder: { '@id': PERSON_ID },
    sameAs: ['https://zaions.com', 'https://github.com/aoneahsan'],
  },
  {
    '@type': 'Organization',
    '@id': TEAM_ID,
    name: 'The windowsweep team',
    url: `${SITE_URL}/about/`,
    parentOrganization: { '@id': ZAIONS_ID },
    sameAs: [
      'https://github.com/aoneahsan/windowsweep',
      'https://www.npmjs.com/package/windowsweep',
    ],
  },
  {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'windowsweep Documentation',
    url: `${SITE_URL}/`,
    description:
      'Documentation for windowsweep, a Windows command-line utility that clears regenerable caches and offers large or old files in Downloads and folders you add for individual Recycle Bin removal. Credentials and browser state remain protected.',
    inLanguage: 'en',
    publisher: { '@id': ZAIONS_ID },
    author: { '@id': PERSON_ID },
    about: { '@id': SOFTWARE_ID },
    license: 'https://opensource.org/licenses/MIT',
  },
  {
    // One entity across the site and the docs (search audit SA-WINDOWSWEEP-005, 2026-10-31): the same
    // `@id`, url, category and operating systems as the website's node. `offers` lives on the website's
    // /pricing node, generated from the plan rows, and is not repeated here. 🔴 `@type` is required on
    // every node (SA-WINDOWSWEEP-013); plugins/discovery-facts.ts fails the build without it.
    '@type': 'SoftwareApplication',
    '@id': SOFTWARE_ID,
    name: 'windowsweep',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows 10 (1809 and later), Windows 11',
    url: 'https://windowsweep.aoneahsan.com/',
    author: { '@id': TEAM_ID },
    publisher: { '@id': ZAIONS_ID },
    sameAs: [
      'https://github.com/aoneahsan/windowsweep',
      'https://www.npmjs.com/package/windowsweep',
    ],
    description:
      'Command-line disk and cache cleanup for Windows developers: a guided walkthrough, a read-only scan, a real dry-run, JSON reports, and an optional large or old file scanner with individual Recycle Bin removal.',
    softwareVersion: TOOL_VERSION,
    license: 'https://opensource.org/licenses/MIT',
  },
  {
    '@type': 'SoftwareSourceCode',
    '@id': 'https://github.com/aoneahsan/windowsweep#code',
    name: 'windowsweep',
    codeRepository: 'https://github.com/aoneahsan/windowsweep',
    programmingLanguage: 'PowerShell',
    runtimePlatform: 'Windows PowerShell 5.1 or PowerShell 7 on Windows 10 and 11',
    license: 'https://opensource.org/licenses/MIT',
    author: { '@id': TEAM_ID },
    targetProduct: { '@id': SOFTWARE_ID },
    description:
      'Windows PowerShell cleanup utility with a zero-dependency Node launcher. Prunes yarn/npm/pnpm/bun/deno/pip/NuGet/Cargo/Go caches, browser and editor caches, Docker layers, Android emulator images, Windows Update leftovers, stale node_modules and partial downloads — every deletion through one chokepoint with a declared root, an idle gate and a real dry-run.',
  },
];

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
      attributes: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    },
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Content-Security-Policy',
        content: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "form-action 'self'",
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "worker-src 'self' blob:",
          'frame-src https://challenges.cloudflare.com',
          [
            "connect-src 'self'",
            ...(supabaseUrl
              ? [
                  new URL(supabaseUrl).origin,
                  new URL(supabaseUrl).origin.replace(/^https:/, 'wss:'),
                ]
              : []),
            'https://fileshub.zaions.com',
            'https://*.google-analytics.com',
            'https://*.analytics.google.com',
            'https://www.googletagmanager.com',
          ].join(' '),
        ].join('; '),
      },
    },
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
      innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': PUBLISHER_GRAPH }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // GitHub Pages serves `x/index.html` at `/x/` and 301s `/x` to it; with `false` it served `x.html` at `/x` and
  // answered `/x/` with a 404 (SA-P26, owner decision 2026-11-27). Canonicals, sitemap.xml and links follow.
  trailingSlash: true,

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
      // The package name, never require.resolve(): Docusaurus ships the site config to the browser, and a resolved
      // path would publish this machine's folders in main.js (the site-pages gate fails the build if it does).
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: HAS_POSTS,
        blogRouteBasePath: BLOG_PATH,
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
            // docs/search-consoles/ is the fleet's fixed-path record of search-console work, never a page.
            'search-consoles/**',
          ],
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/windowsweep-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
          // Every table sits in a labelled, keyboard-focusable scroll region (F-EXP-006).
          rehypePlugins: [rehypeTableScroll, rehypeThirdPartyLinks],
        },
        blog: HAS_POSTS && {
          path: 'blog',
          routeBasePath: BLOG_PATH.slice(1),
          blogTitle: BLOG_TITLE,
          blogDescription: BLOG_DESCRIPTION,
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 10,
          postsPerPage: 10,
          showReadingTime: false,
          // A post's last update comes from git, like a doc's: shown under the post, and its sitemap lastmod.
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          // 🔴 No author or tag pages (SA-P32, owner 2026-11-27): an authors.yml always generates /blog/authors,
          // so a post names the team inline (`authors: { name: The windowsweep team, url: … }`) and there is no
          // authors.yml; with no tags file, an inline tag fails the build, so no /blog/tags page can appear.
          onInlineAuthors: 'ignore',
          onInlineTags: 'throw',
          onUntruncatedBlogPosts: 'throw',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: BLOG_TITLE,
            description: BLOG_DESCRIPTION,
            copyright: 'Made by the windowsweep team.',
            language: 'en-GB',
          },
        },
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
          // The blog's tag, author, archive and later list pages only repeat its posts; each post is listed once.
          // Each pattern in both forms: with trailingSlash the routes end in `/` (SA-P26 switch trap).
          ignorePatterns: [
            '/tags',
            '/tags/',
            '/tags/**',
            '/search',
            '/search/',
            '/search/**',
            '/blog/tags/**',
            '/blog/authors/**',
            '/blog/archive',
            '/blog/archive/',
            '/blog/page/**',
          ],
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
    // FAQPage JSON-LD read off the built pages whose questions a reader sees (SA-P30).
    faqSchema,
    // The retired tag pages' addresses lead to the page each topic is about (SA-P31/P32).
    ['@docusaurus/plugin-client-redirects', { redirects: seoRedirects(SITE_DIR) }],
  ],

  themeConfig: {
    // Most social scrapers ignore SVG, so the card was effectively missing. The SVG stays the
    // master and this PNG is a re-runnable 1200x630 export of it - re-export whenever the master changes.
    image: 'img/social-card.png',
    metadata: [
      { name: 'yandex-verification', content: 'bfb02722189028cf' },
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
        // the header's mark in each appearance's page ink, as windowsweep.aoneahsan.com draws it
        srcDark: 'img/logo-dark.svg',
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
        ...(HAS_POSTS ? [{ to: BLOG_PATH, label: 'Blog', position: 'left' as const }] : []),
        { to: '/changelog', label: 'Changelog', position: 'right' },
        {
          // Every released surface, from src/data/platforms.ts (the website is one of them).
          type: 'dropdown',
          label: 'Get windowsweep',
          position: 'right',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
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
          title: 'Get windowsweep',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
        },
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
            { label: 'Sections 0-32', to: '/sections' },
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
            { label: 'White-label & licensing', to: '/white-label' },
            { label: 'Contact', href: 'https://windowsweep.aoneahsan.com/contact' },
          ],
        },
        {
          title: 'Find everything',
          items: [
            ...(HAS_POSTS ? [{ label: 'Blog', to: BLOG_PATH }] : []),
            { label: 'Sitemap', to: '/sitemap' },
            { label: 'Release feed', to: '/feed' },
            // feed.xml is written after the build, where the link checker cannot see it, so it and
            // llms.txt are linked by their absolute URLs.
            { label: 'RSS (feed.xml)', href: `${SITE_URL}/feed.xml` },
            { label: 'llms.txt', href: `${SITE_URL}/llms.txt` },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. windowsweep is MIT-licensed and provided without warranty — it deletes files.<br />windowsweep is developed with love by the <a href="https://zaions.com" target="_blank" rel="noopener">Zaions team</a>, founded by <a href="https://aoneahsan.com" target="_blank" rel="noopener">Ahsan Mahmood</a>.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['powershell', 'json', 'diff', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
