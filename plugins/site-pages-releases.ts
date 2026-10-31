import { readFileSync } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';

/**
 * The release half of site-pages: parses docs/changelog.md (Keep a Changelog) into releases and renders
 * them as RSS 2.0 for /feed.xml. Split out of site-pages.ts on 2026-10-31 to keep each file under 500 lines.
 */

export const SITE_DIR = path.resolve(__dirname, '..');
export const CHANGELOG = 'docs/changelog.md';

/** One `### Added` / `### Changed` / `### Fixed` list of a release, as plain text. */
export type ReleaseSection = { kind: string; items: string[] };

/** One release, parsed from the changelog. Every string is plain text, Markdown removed. */
export type Release = {
  version: string;
  date: string;
  anchor: string;
  intro: string[];
  sections: ReleaseSection[];
};

/** Strip inline Markdown so a release reads as plain text. Code spans keep their contents verbatim. */
function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .split(/(`[^`]+`)/)
    .map((part, i) => (i % 2 === 1 ? part.slice(1, -1) : part.replace(/\*{1,3}/g, '')))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The first sentence of a plain-text change: every changelog entry opens with its point. */
export function firstSentence(text: string): string {
  return /^(.+?[.!?])(?=\s|$)/.exec(text)?.[1] ?? text;
}

/** A release while its lines are still being read. */
type Draft = Release & { paragraph: string[]; bullet: string[] | null };

function endBullet(draft: Draft): void {
  if (draft.bullet)
    draft.sections[draft.sections.length - 1].items.push(plainText(draft.bullet.join(' ')));
  draft.bullet = null;
}

function endParagraph(draft: Draft): void {
  if (draft.paragraph.length) draft.intro.push(plainText(draft.paragraph.join(' ')));
  draft.paragraph = [];
}

function finish(draft: Draft): Release {
  endBullet(draft);
  endParagraph(draft);
  return {
    version: draft.version,
    date: draft.date,
    anchor: draft.anchor,
    intro: draft.intro,
    sections: draft.sections.filter((s) => s.items.length > 0),
  };
}

/** Parse every dated release from docs/changelog.md, newest first. Throws on an undated release. */
export function readReleases(): Release[] {
  const source = readFileSync(path.join(SITE_DIR, CHANGELOG), 'utf8').replace(/\r\n/g, '\n');
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
  const slugger = new GithubSlugger();
  const releases: Release[] = [];
  let draft: Draft | null = null;
  let inFence = false;
  let afterBlank = false;

  for (const line of body.split('\n')) {
    const fence = line.trim().startsWith('```');
    if (fence) inFence = !inFence;
    if (fence || inFence) continue;
    const h2 = /^## (.+)$/.exec(line);
    if (h2) {
      if (draft) releases.push(finish(draft));
      const text = h2[1].trim();
      // Docusaurus slugs every heading with github-slugger, so this is the changelog page's own id.
      const anchor = slugger.slug(text);
      const dated = /^\[?(\d+\.\d+\.\d+)\]?\s+-\s+(\d{4}-\d{2}-\d{2})$/.exec(text);
      if (!dated && /^\[?\d+\.\d+\.\d+/.test(text)) {
        throw new Error(
          `[site-pages] ${CHANGELOG}: "## ${text}" has no "- YYYY-MM-DD" release date`
        );
      }
      draft = dated
        ? {
            version: dated[1],
            date: dated[2],
            anchor,
            intro: [],
            sections: [],
            paragraph: [],
            bullet: null,
          }
        : null;
      afterBlank = false;
      continue;
    }
    if (!draft) continue;
    const h3 = /^### (.+)$/.exec(line);
    if (!line.trim() || /^(-{3,}|\*{3,})$/.test(line.trim())) {
      endParagraph(draft);
      afterBlank = true;
      continue;
    }
    if (h3) {
      endBullet(draft);
      endParagraph(draft);
      draft.sections.push({ kind: plainText(h3[1]), items: [] });
    } else if (line.startsWith('- ')) {
      endBullet(draft);
      endParagraph(draft);
      if (!draft.sections.length) draft.sections.push({ kind: 'Changes', items: [] });
      draft.bullet = [line.slice(2)];
    } else if (draft.bullet && (/^\s/.test(line) || !afterBlank)) {
      draft.bullet.push(line.trim());
    } else if (!draft.sections.length) {
      draft.paragraph.push(line.trim());
    } else {
      // A loose paragraph inside a section is kept as an entry of its own rather than dropped.
      endBullet(draft);
      draft.bullet = [line.trim()];
    }
    afterBlank = false;
  }
  if (draft) releases.push(finish(draft));
  if (!releases.length)
    throw new Error(`[site-pages] ${CHANGELOG}: no "## [X.Y.Z] - YYYY-MM-DD" release`);
  return releases;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Escape HTML text content. Quotes stay literal: `&apos;` is not an HTML 4 entity, and feed readers vary. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

/**
 * One release as HTML for a feed reader: its opening paragraphs, then every change in full. The HTML is
 * escaped once more as XML by {@link renderFeedXml}, the usual way RSS carries markup.
 */
function releaseHtml(release: Release): string {
  const intro = release.intro.map((p) => `<p>${escapeHtml(p)}</p>`);
  const sections = release.sections.map(
    (s) =>
      `<p><strong>${escapeHtml(s.kind)}</strong></p><ul>${s.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
  );
  return [...intro, ...sections].join('');
}

/** RSS 2.0 for the releases, newest first, with an Atom self link naming /feed.xml. */
export function renderFeedXml(siteUrl: string, releases: Release[]): string {
  const items = releases.map((r) =>
    [
      '    <item>',
      `      <title>windowsweep ${r.version}</title>`,
      `      <link>${escapeXml(`${siteUrl}/changelog#${r.anchor}`)}</link>`,
      `      <guid isPermaLink="false">windowsweep-${r.version}</guid>`,
      `      <pubDate>${rfc822(r.date)}</pubDate>`,
      '      <category>release</category>',
      `      <description>${escapeXml(releaseHtml(r))}</description>`,
      '    </item>',
    ].join('\n')
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>windowsweep releases</title>',
    `    <link>${siteUrl}/feed</link>`,
    '    <description>Every windowsweep release, newest first: the version, the date and what changed.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${rfc822(releases[0].date)}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
