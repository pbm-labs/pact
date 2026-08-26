import { STORAGE_KEYS } from '@/lib/preferences';

export function LocaleScript() {
  const script = `
(function () {
  try {
    var locale = localStorage.getItem("${STORAGE_KEYS.locale}");
    document.documentElement.lang = locale === "fr" ? "fr" : "en";
  } catch (e) {}
})();
`;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />
  );
}
