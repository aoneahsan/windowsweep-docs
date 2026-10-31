import React, { useMemo, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import type { SitemapCard, SitemapGroup } from '@site/plugins/site-pages';
import styles from './styles.module.css';

type Props = { data: { groups: SitemapGroup[] } };

/** One SVG per group, drawn for what the group holds. */
const ICONS: Record<string, ReactNode> = {
  start: <path d="M4 12h12M12 6l6 6-6 6" />,
  'before-you-delete-anything': (
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" />
  ),
  'getting-started': <path d="M12 3v12M7 10l5 5 5-5M5 19h14" />,
  'desktop-and-sections': <path d="M3 5h18v11H3zM8 20h8M12 16v4M7 9h6M7 12h10" />,
  reference: <path d="M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h6" />,
  help: (
    <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9a2.5 2.5 0 114 2c-1 .6-1.5 1.2-1.5 2.5M12 17h.01" />
  ),
  site: (
    <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9M12 3c-2.5 2.7-3.8 5.7-3.8 9s1.3 6.3 3.8 9" />
  ),
  more: <path d="M4 6h16M4 12h16M4 18h10" />,
};

function GroupIcon({ name }: { name: string }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name] ?? ICONS.more}
    </svg>
  );
}

/** Levenshtein distance with an early exit above `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9.+-]+/)
    .filter(Boolean);

/** True when every query word is a substring of, or one or two typos from, a card word. */
function matches(card: SitemapCard, query: string): boolean {
  const haystack = words(
    [card.title, card.description, card.permalink, ...card.tags, ...card.keywords].join(' ')
  );
  return words(query).every((q) => {
    const allowed = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0;
    return haystack.some(
      (w) => w.includes(q) || distance(q, w.slice(0, q.length + allowed), allowed) <= allowed
    );
  });
}

function CardLink({ card }: { card: SitemapCard }) {
  // The website is another host: a plain link, same tab, so nothing opens unannounced.
  return card.external ? (
    <a href={card.permalink} className={styles.cardLink}>
      {card.title}
    </a>
  ) : (
    <Link to={card.permalink} className={styles.cardLink}>
      {card.title}
    </Link>
  );
}

/** /sitemap - every docs page as a card, grouped in sidebar order, with a typo-tolerant search. */
export default function SitemapPage({ data }: Props): ReactNode {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search).get('q') ?? '';
  const groups = useMemo(
    () =>
      data.groups
        .map((g) => ({
          ...g,
          cards: query.trim() ? g.cards.filter((c) => matches(c, query)) : g.cards,
        }))
        .filter((g) => g.cards.length > 0),
    [data.groups, query]
  );
  const total = groups.reduce((n, g) => n + g.cards.length, 0);

  const onChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) params.set('q', value);
    else params.delete('q');
    const search = params.toString();
    history.replace({ pathname: location.pathname, search: search ? `?${search}` : '' });
  };

  return (
    <Layout
      title="Sitemap"
      description="Every page of the windowsweep documentation, grouped in sidebar order, with a search that tolerates typos."
    >
      <main className="container margin-vert--lg">
        <h1>Sitemap</h1>
        <p>Every page of the windowsweep documentation, grouped in the order of the sidebar.</p>
        <ul className={styles.machine}>
          <li>
            <a href="/sitemap.xml">sitemap.xml</a>: the same pages, as the file search engines read.
          </li>
          <li>
            <a href="/feed.xml">feed.xml</a>: an RSS feed of windowsweep releases. The readable list
            is the <Link to="/feed">release feed</Link>.
          </li>
          <li>
            <a href="/llms.txt">llms.txt</a>: a plain-text index of these docs for AI assistants.
          </li>
        </ul>
        <label className={styles.searchLabel} htmlFor="sitemap-search">
          Search pages
        </label>
        <input
          id="sitemap-search"
          className={styles.search}
          type="search"
          value={query}
          placeholder="Try dry run, json, uac, profiles"
          onChange={(e) => onChange(e.target.value)}
        />
        <p className={styles.count} role="status">
          {query.trim()
            ? `${total} ${total === 1 ? 'page matches' : 'pages match'} “${query}”.`
            : `${total} pages.`}
        </p>
        {groups.map((group) => (
          <section key={group.key} className={styles.group} aria-labelledby={`group-${group.key}`}>
            <h2 id={`group-${group.key}`} className={styles.groupTitle}>
              <GroupIcon name={group.key} />
              {group.label}
            </h2>
            <ul className={styles.grid}>
              {group.cards.map((card) => (
                <li key={card.permalink} className={styles.card}>
                  <CardLink card={card} />
                  <p className={styles.description}>{card.description}</p>
                  {card.tags.length > 0 && (
                    <ul className={styles.tags} aria-label="Tags">
                      {card.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {total === 0 && (
          <p>
            No page matches “{query}”. Clear the search, or use the site search in the navigation
            bar for words inside a page.
          </p>
        )}
      </main>
    </Layout>
  );
}
