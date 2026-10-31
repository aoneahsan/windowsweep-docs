import React, { type ReactNode } from 'react';
import SearchPage from '@theme-original/SearchPage';
import NoIndex from '@site/src/components/NoIndex';

/**
 * The local-search results page is a utility screen, not content. The search plugin marks it with
 * `<meta property="robots">`, which search engines do not read as a robots rule, so /search stayed
 * indexable (search-audit SA-P06). This wrapper adds the real `name="robots"` noindex.
 */
export default function SearchPageWrapper(props: Record<string, unknown>): ReactNode {
  return (
    <>
      <NoIndex />
      <SearchPage {...props} />
    </>
  );
}
