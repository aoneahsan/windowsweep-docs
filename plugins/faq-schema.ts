import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from '@docusaurus/types';

/**
 * FAQPage JSON-LD for the pages that show a reader a list of questions, read off each page as it was BUILT
 * (windowsweep-docs#1 box 8, SA-P30; ported from macleanup-docs `plugins/faq-schema.ts`).
 *
 * 🔴 WHY FROM THE BUILT HTML AND NOT A SECOND COPY. Google allows FAQ markup only over questions and answers the
 *    reader can see, word for word. A hand-typed list beside the Markdown drifts the first time an answer is
 *    edited; reading the questions and answers from the emitted page makes the markup the page.
 *
 * 🔴 IN THE INITIAL HTML. Written into the static file at postBuild, so a crawler that runs no script reads it.
 *
 * Two shapes carry a question here: a heading (`##`/`###`) that ends in `?`, answered by everything up to the next
 * heading (`white-label/faq`), and a paragraph that opens with a bold question, answered by the rest of that
 * paragraph (the home page's "What people ask before they run it"). `faq.mdx` writes its own FAQPage in the page
 * and is not listed, so no page carries two.
 *
 * Synchronous on purpose: Docusaurus starts every plugin's postBuild together, and `discovery-facts` reads the home
 * page's JSON-LD; a synchronous write here cannot interleave with it.
 */

/** The pages that ARE a list of questions; each must yield at least two, or the build fails. */
export const FAQ_PAGES = ['index.html', 'white-label/faq/index.html'] as const;

const ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/** Visible text: tags out, the heading's hidden anchor glyph out, entities decoded, whitespace folded. */
function textOf(html: string): string {
  return html
    .replace(/<a[^>]*class="?hash-link[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code: string) => {
      if (/^#x/i.test(code)) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      if (code.startsWith('#')) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      return ENTITIES[code.toLowerCase()] ?? whole;
    })
    .replace(/\u200b/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1')
    .trim();
}

/**
 * The question and answer pairs a built page shows, in page order.
 *
 * @param html - the built page
 * @returns each visible question with its visible answer
 */
export function faqPairs(html: string): { name: string; text: string }[] {
  const start = html.indexOf('theme-doc-markdown');
  const end = html.indexOf('<footer', start);
  if (start === -1 || end === -1) return [];
  const body = html.slice(start, end);
  const pairs: { name: string; text: string }[] = [];
  for (const part of body.split(/(?=<h[23][\s>])/)) {
    if (!/^<h[23][\s>]/.test(part)) continue;
    const close = part.search(/<\/h[23]>/);
    const name = textOf(part.slice(0, close));
    if (name.endsWith('?')) pairs.push({ name, text: textOf(part.slice(close + 5)) });
  }
  for (const [, question = '', answer = ''] of body.matchAll(
    /<p><strong>([^<]+\?)<\/strong>([\s\S]*?)<\/p>/g
  )) {
    pairs.push({ name: textOf(question), text: textOf(answer) });
  }
  return pairs.filter((pair) => pair.name !== '' && pair.text !== '');
}

export default function faqSchema(): Plugin {
  return {
    name: 'faq-schema',
    postBuild({ outDir }) {
      for (const page of FAQ_PAGES) {
        const file = join(outDir, page);
        const html = readFileSync(file, 'utf8');
        const pairs = faqPairs(html);
        if (pairs.length < 2)
          throw new Error(`faq-schema: ${page} shows ${pairs.length} question(s)`);
        const graph = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pairs.map((pair) => ({
            '@type': 'Question',
            name: pair.name,
            acceptedAnswer: { '@type': 'Answer', text: pair.text },
          })),
        };
        const script = `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
        writeFileSync(file, html.replace('</head>', `${script}</head>`), 'utf8');
      }
    },
  };
}
