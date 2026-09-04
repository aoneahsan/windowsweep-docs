import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ---------------------------------------------------------------------------
// windowsweep — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://github.com/aoneahsan/windowsweep
//                 (npm: https://www.npmjs.com/package/windowsweep)
//
// Domain derivation (see ~/.claude/rules/docs-sites.md): windowsweep is an
// npm package with no separate marketing site, so its docs domain is
// <npm-package-name>-docs.aoneahsan.com. Pinned in static/CNAME.
//
// Deployment: GitHub Pages ONLY (.github/workflows/deploy-pages.yml).
// This repo is PUBLIC and contains no Firebase config and no secrets.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://windowsweep-docs.aoneahsan.com';
const TOOL_VERSION = '1.1.0';

// Analytics are env-gated: an absent key means the provider is skipped
// entirely, so a clone with no secrets still builds. Never inline a real key.
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim();

const config: Config = {
  title: 'windowsweep',
  tagline:
    'Safe, developer-aware Windows cleanup CLI — one deletion chokepoint, a real dry-run, and it never phones home.',
  favicon: 'img/favicon.svg',

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'windowsweep-docs',

  // The build IS the link checker. Anything broken fails CI rather than
  // shipping a dead link to a page about deleting files.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // SEO + AI-citability head tags. The JSON-LD payloads let Google Rich
  // Results, Perplexity, ChatGPT and Claude extract structured entity data
  // when citing this documentation.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'canonical', href: `${SITE_URL}/` },
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
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'windowsweep Documentation',
        url: SITE_URL,
        description:
          'Documentation for windowsweep, a Windows PowerShell command-line utility that reclaims disk space by deleting regenerable package-manager, browser, editor and build caches behind one deletion chokepoint, an idle gate and a real dry-run. Author: Ahsan Mahmood.',
        inLanguage: 'en',
        publisher: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
          email: 'aoneahsan@gmail.com',
          sameAs: [
            'https://linkedin.com/in/aoneahsan',
            'https://github.com/aoneahsan',
            'https://www.npmjs.com/~aoneahsan',
          ],
        },
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
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
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
        '@type': 'SoftwareApplication',
        name: 'windowsweep',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows 10, Windows 11',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: 'https://www.npmjs.com/package/windowsweep',
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Command-line disk and cache cleanup for Windows developers, with a guided walkthrough, read-only scan mode, JSON session reports, and a safety model built on one deletion chokepoint, protected paths and an idle gate.',
        softwareVersion: TOOL_VERSION,
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ahsan Mahmood',
        alternateName: 'aoneahsan',
        url: 'https://aoneahsan.com',
        email: 'aoneahsan@gmail.com',
        sameAs: [
          'https://linkedin.com/in/aoneahsan',
          'https://github.com/aoneahsan',
          'https://www.npmjs.com/~aoneahsan',
        ],
        founder: { '@type': 'Person', name: 'Ahsan Mahmood' },
      }),
    },
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
          ],
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/windowsweep-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: 'date',
        },
        ...(gaMeasurementId ? { gtag: { trackingID: gaMeasurementId, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for windowsweep — a Windows PowerShell CLI that reclaims disk space by pruning regenerable caches (yarn, npm, pnpm, browsers, editors, Docker, Gradle, Cypress, Playwright, Android AVDs, stale node_modules) behind one deletion chokepoint and an idle gate. By Ahsan Mahmood.',
      },
      {
        name: 'keywords',
        content:
          'windows cleanup, free disk space windows, clear yarn cache, clear npm cache, delete node_modules, windows disk full, windows temp files cleanup, powershell cleanup script, safe disk cleanup, windows cache cleaner cli, windows update cache cleanup',
      },
      { name: 'author', content: 'Ahsan Mahmood' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'windowsweep Docs' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'Ahsan Mahmood' },
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
            { label: 'Sections 0-21', to: '/sections' },
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
          title: 'Built by Ahsan Mahmood',
          items: [
            { label: 'aoneahsan.com', href: 'https://aoneahsan.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan' },
            { label: 'GitHub', href: 'https://github.com/aoneahsan' },
            { label: 'npm packages', href: 'https://www.npmjs.com/~aoneahsan' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. windowsweep is MIT-licensed and provided without warranty — it deletes files.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'json', 'diff', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
