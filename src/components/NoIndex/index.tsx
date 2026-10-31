import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';

/**
 * `noindex, follow` for a utility page that sitemap.xml leaves out. Rendered inside the page, it
 * replaces the site-wide `name="robots"` meta from themeConfig.metadata: Helmet keeps one tag per name,
 * and the page's own wins. The page's links stay followable.
 */
export default function NoIndex(): ReactNode {
  return (
    <Head>
      <meta name="robots" content="noindex, follow" />
    </Head>
  );
}
