/**
 * The footer with the release-notes signup as its top row, above the link columns (owner decision D90; web
 * dummy amendment 35). A wrapper, not an ejected copy: the theme's own layout still draws the footer, and the
 * signup arrives through its `links` slot, so every docs page carries it in one place.
 */
import type { ComponentProps } from 'react';
import Layout from '@theme-original/Footer/Layout';
import NewsletterSignup from '../../../components/NewsletterSignup';

type Props = ComponentProps<typeof Layout>;

export default function FooterLayout(props: Props) {
  return (
    <Layout
      {...props}
      links={
        <>
          <NewsletterSignup />
          {props.links}
        </>
      }
    />
  );
}
