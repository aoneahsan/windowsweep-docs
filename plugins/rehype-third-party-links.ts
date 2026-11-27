/**
 * rehype-third-party-links - a link off our own hosts gets a new tab and
 * `rel="noopener noreferrer nofollow"`, the same policy as the website's `src/lib/links.ts`.
 *
 * The compare guides link makers' sites so a reader can check a dated fact, and those links give
 * no ranking credit. Done at build time because the pages stay plain Markdown, and it covers
 * every page, since a third party is a third party on any of them.
 */

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/* Link law (owner, 2026-11-25): every product, docs site and service of his lives on one of these, and
   zaions.com itself is his. Until 2026-11-27 zaions.com and the sibling tools' npm pages went out `nofollow`. */
const OWNED_HOSTS = /^(?:(?:[a-z0-9-]+\.)*(?:aoneahsan\.com|zaions\.com|trizlink\.com))$/;
const OWNED_NPM = /^\/(?:~aoneahsan|package\/(?:windowsweep|linux-cleanup|macleanup))(?:\/|$)/;

function isOwned(url: URL): boolean {
  if (OWNED_HOSTS.test(url.hostname)) return true;
  if (url.hostname === 'github.com') return /^\/aoneahsan(?:\/|$)/.test(url.pathname);
  if (url.hostname === 'www.linkedin.com' || url.hostname === 'linkedin.com')
    return url.pathname.startsWith('/in/aoneahsan');
  if (url.hostname === 'orcid.org') return url.pathname.startsWith('/0009-0006-2311-8687');
  return url.hostname === 'www.npmjs.com' && OWNED_NPM.test(url.pathname);
}

function walk(node: HastNode): void {
  if (node.type === 'element' && node.tagName === 'a') {
    const href = node.properties?.href;
    if (typeof href === 'string' && /^https?:\/\//.test(href) && !isOwned(new URL(href))) {
      node.properties = {
        ...node.properties,
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      };
    }
  }
  node.children?.forEach(walk);
}

/** The rehype plugin. Register it in the docs plugin's `rehypePlugins`. */
export default function rehypeThirdPartyLinks() {
  return (tree: HastNode): void => walk(tree);
}
