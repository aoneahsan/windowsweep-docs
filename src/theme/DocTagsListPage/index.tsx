import React, { type ReactNode } from 'react';
import DocTagsListPage from '@theme-original/DocTagsListPage';
import type { Props } from '@theme/DocTagsListPage';
import NoIndex from '@site/src/components/NoIndex';

/**
 * /tags is a generated index of tag names, with no words of its own, so it is kept out of sitemap.xml
 * and out of the index; its links stay followable.
 */
export default function DocTagsListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <NoIndex />
      <DocTagsListPage {...props} />
    </>
  );
}
