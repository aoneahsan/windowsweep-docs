import React, { type ReactNode } from 'react';
import DocTagDocListPage from '@theme-original/DocTagDocListPage';
import type { Props } from '@theme/DocTagDocListPage';
import NoIndex from '@site/src/components/NoIndex';

/**
 * A tag's page is a generated list of the docs that carry the tag, with no words of its own, so it is
 * kept out of sitemap.xml and out of the index; its links stay followable.
 */
export default function DocTagDocListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <DocTagDocListPage {...props} />
    </>
  );
}
