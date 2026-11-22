import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import type { FeedPost, Release } from '@site/plugins/site-pages';
import styles from './styles.module.css';

type Props = { data: { releases: Release[]; posts?: FeedPost[] } };

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * /feed - the readable release list, newest first. Each change shows its opening sentence; feed.xml
 * carries the same releases with every change in full, and the changelog page has the complete notes. Once the blog
 * has posts, they are listed first, with the blog's own RSS feed; feed.xml stays the release feed.
 */
export default function FeedPage({ data }: Props): ReactNode {
  const posts = data.posts ?? [];
  return (
    <Layout
      title="Release feed"
      description="Every windowsweep release, newest first, with the date it shipped and what changed. Subscribe with the RSS feed."
    >
      <main className="container margin-vert--lg">
        <h1>Release feed</h1>
        <p className={styles.intro}>
          Every windowsweep release, newest first. Subscribe in any feed reader with{' '}
          <a href="/feed.xml">feed.xml</a>. The full notes for each release are on the{' '}
          <Link to="/changelog">changelog</Link>.
        </p>
        {posts.length > 0 ? (
          <section className={styles.release} aria-labelledby="posts">
            <h2 id="posts" className={styles.version}>
              <Link to="/blog">Posts</Link>
            </h2>
            <p>
              Posts from the windowsweep team, newest first. Follow them with the blog's{' '}
              <a href="/blog/rss.xml">RSS feed</a>.
            </p>
            <ul>
              {posts.map((post) => (
                <li key={post.permalink}>
                  <Link to={post.permalink}>{post.title}</Link>
                  {' · '}
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <br />
                  {post.description}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {data.releases.map((release) => (
          <article key={release.version} className={styles.release}>
            <h2 id={`v${release.version.replace(/\./g, '-')}`} className={styles.version}>
              <Link to={`/changelog#${release.anchor}`}>windowsweep {release.version}</Link>
            </h2>
            <p className={styles.date}>
              <time dateTime={release.date}>{formatDate(release.date)}</time>
            </p>
            {release.intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {release.sections.map((section) => (
              <section key={section.kind}>
                <h3 className={styles.kind}>{section.kind}</h3>
                <ul>
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
        ))}
      </main>
    </Layout>
  );
}
