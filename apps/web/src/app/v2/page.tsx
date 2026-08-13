import type { Metadata } from 'next';
import { V2Landing } from './v2-landing';

export const metadata: Metadata = {
  title: 'we build real — preview',
  robots: { index: false, follow: false },
};

export default function V2Page() {
  return <V2Landing />;
}
