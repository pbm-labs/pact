'use client';

import { useEffect, useState } from 'react';
import type { BadgeTheme } from '@/lib/badge-dimensions';

// Subscribes to the navbar's light/dark toggle by observing the
// `html.light` class. Returns the current site theme as a BadgeTheme.
export function useSiteTheme(): BadgeTheme {
  const [theme, setTheme] = useState<BadgeTheme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const read = (): BadgeTheme =>
      root.classList.contains('light') ? 'light' : 'dark';
    setTheme(read());

    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
