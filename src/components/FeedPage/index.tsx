import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import type { Release } from '@site/plugins/site-pages';
import styles from './styles.module.css';

type Props = { data: { releases: Release[] } };

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * /feed - the readable release list, newest first. Each change shows its opening sentence; feed.xml
 * carries the same releases with every change in full, and the changelog page has the complete notes.
 */
export default function FeedPage({ data }: Props): ReactNode {
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
