/**
 * Every place windowsweep is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the installer from the latest GitHub release (desktop-v1.5.0) downloads, `npm view windowsweep` answers,
 * the website and this site answered 200.
 */
export type PlatformId = 'desktop' | 'npm' | 'web' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in windowsweep's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {
    id: 'desktop',
    name: 'Windows desktop app',
    href: 'https://github.com/aoneahsan/windowsweep/releases/latest/download/windowsweep-setup.exe',
    title: 'For Windows',
    text: 'The desktop app: scan first, see every path, then clean what you choose. A signed installer that updates itself.',
    cta: 'Download for Windows',
    primary: true,
    verified: '2026-11-20',
  },
  {
    id: 'npm',
    name: 'npm',
    href: 'https://www.npmjs.com/package/windowsweep',
    title: 'npx windowsweep',
    text: 'The command-line engine the app runs, for terminals and scripts.',
    cta: 'View on npm',
    verified: '2026-11-20',
  },
  {
    id: 'web',
    name: 'windowsweep website',
    href: 'https://windowsweep.aoneahsan.com',
    title: 'The website',
    text: 'What it cleans, what it refuses to touch, and the plans.',
    cta: 'Open the website',
    verified: '2026-11-20',
  },
  {
    id: 'docs',
    name: 'Documentation',
    href: 'https://windowsweep-docs.aoneahsan.com',
    title: 'These docs',
    text: 'The safety model, a quick start, and the full CLI reference.',
    cta: 'Read the docs',
    verified: '2026-11-20',
  },
];

export const APPS_PAGE = {
  title: 'Get windowsweep',
  description:
    'Every place windowsweep is released: the Windows desktop app, the npm CLI, the website and these docs.',
  lead: 'The desktop app for Windows, the same engine as a CLI on npm, and these docs a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter(
  (platform) => platform.id !== CURRENT_SURFACE
);
export const PRIMARY_PLATFORM: Platform =
  PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string =
  PLATFORMS.map((platform) => platform.verified)
    .sort()
    .at(-1) ?? '2026-11-20';
