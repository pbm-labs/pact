'use client';

import { useEffect } from 'react';

/** Force light theme on `/` so the manifesto matches the designed light layout. */
export function HomeLightShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('light');
    return () => {
      try {
        if (localStorage.getItem('theme') !== 'light') {
          document.documentElement.classList.remove('light');
        }
      } catch {
        document.documentElement.classList.remove('light');
      }
    };
  }, []);

  return children;
}
