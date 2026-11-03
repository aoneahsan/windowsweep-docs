import type { ReactNode } from 'react';
import ReleaseGate from '../../components/ReleaseGate';

/** Keep the release gate mounted across Docusaurus route changes. */
export default function Root({ children }: { children: ReactNode }) {
  return <ReleaseGate>{children}</ReleaseGate>;
}
