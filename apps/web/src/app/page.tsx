import Link from 'next/link';
import { HeroBackdrop } from '@/components/hero-backdrop';
import { SiteNarrative } from '@/components/site-narrative';
import { actionCard, actionCardPrimary, eyebrow } from '@/lib/ui';

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackdrop />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <p className={`${eyebrow} mb-4`}>PACT Protocol</p>
          <SiteNarrative />
        </div>
      </section>

      <section className="border-b border-border bg-surface py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 max-w-2xl">
            PACT lays that foundation one domain at a time — verifiable history from authentication
            signals mail providers already send. No message content. One honest day at a time.
          </p>

          <div className="grid sm:grid-cols-2 gap-3" aria-label="Get started">
            <Link href="/connect" className={`${actionCard} ${actionCardPrimary}`}>
              <span className={`${eyebrow} text-accent`}>Start here</span>
              <span className="text-base font-semibold text-txt">Connect a domain</span>
              <span className="text-sm text-muted leading-snug">
                Cloudflare OAuth or manual DNS — about two minutes.
              </span>
            </Link>
            <Link href="/domains" className={actionCard}>
              <span className={eyebrow}>Public record</span>
              <span className="text-base font-semibold text-txt">Browse live records</span>
              <span className="text-sm text-muted leading-snug">
                Trust scores and provenance history for connected domains.
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
