import { STORAGE_KEYS } from '@/lib/preferences';

export function LocaleScript() {
  const script = `
(function () {
  try {
    var locale = localStorage.getItem("${STORAGE_KEYS.locale}");
    if (locale === "en" || locale === "es" || locale === "de" || locale === "fr") {
      document.documentElement.lang = locale;
    }
  } catch (e) {}
})();
`;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />
  );
}
