/**
 * rehype-table-scroll - every Markdown table sits in a labelled, keyboard-focusable scroll region.
 *
 * A table wider than the article column scrolls sideways, and a scrolling box a keyboard cannot reach
 * fails WCAG 2.1.1 (axe `scrollable-region-focusable`, finding F-EXP-006). So each table is wrapped, at
 * build time, in `<div class="table-scroll" role="region" tabindex="0" aria-label="...">`. The label is
 * the text of the nearest heading above the table, so a screen reader announces the region by the
 * section it belongs to, and every region on a page has its own name (axe `landmark-unique`); a second
 * table under the same heading gets " (table 2)".
 *
 * The table and the Markdown it comes from stay untouched: the pages mirror the product repo's docs/
 * byte for byte, so the fix lives in the build, not in the content.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const HEADING = /^h[1-6]$/;

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

/** The rehype plugin. Register it in the docs plugin's `rehypePlugins`. */
export default function rehypeTableScroll() {
  return (tree: HastNode): void => {
    let section = '';
    const seen = new Map<string, number>();
    const walk = (parent: HastNode): void => {
      const children = parent.children ?? [];
      children.forEach((node, index) => {
        if (node.type === 'element' && HEADING.test(node.tagName ?? '')) {
          section = textOf(node).replace(/\s+/g, ' ').trim();
        } else if (node.type === 'element' && node.tagName === 'table') {
          const name = section || 'Table';
          const count = (seen.get(name) ?? 0) + 1;
          seen.set(name, count);
          children[index] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-scroll'],
              role: 'region',
              tabIndex: 0,
              ariaLabel: count === 1 ? name : `${name} (table ${count})`,
            },
            children: [node],
          };
        } else {
          walk(node);
        }
      });
    };
    walk(tree);
  };
}
