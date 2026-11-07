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

const OWNED_HOSTS = /^(?:(?:[a-z-]+\.)?aoneahsan\.com|fileshub\.zaions\.com|ztools\.zaions\.com)$/;

function isOwned(url: URL): boolean {
  if (OWNED_HOSTS.test(url.hostname)) return true;
  if (url.hostname === 'github.com') return url.pathname.startsWith('/aoneahsan/');
  return url.hostname === 'www.npmjs.com' && url.pathname.startsWith('/package/windowsweep');
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
