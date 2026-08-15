import type { Metadata } from 'next';

/** Unlisted: reachable by URL, not linked from the site, not indexed. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
