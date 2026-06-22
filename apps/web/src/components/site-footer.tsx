import { COMPANY_SITE_URL } from '@/lib/site-urls';
import { linkMuted } from '@/lib/ui';

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 text-center sm:text-left text-xs text-muted-2 font-mono">
        <p>
          © {new Date().getFullYear()}{' '}
          <a href={COMPANY_SITE_URL} className={linkMuted}>
            PBM Labs
          </a>
          <span aria-hidden="true"> · </span>
          <span className="text-unclaimed">Staging — not yet on-chain</span>
        </p>
      </div>
    </footer>
  );
}
