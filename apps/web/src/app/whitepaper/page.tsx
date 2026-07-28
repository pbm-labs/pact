import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { Reveal } from '@/components/reveal';
import { renderInline } from '@/lib/inline-text';
import { whitepaperAbstract, whitepaperBlocks, whitepaperMeta } from '@/content/whitepaper';
import { eyebrow, linkAccent, pageTitle } from '@/lib/ui';

export const metadata = {
  title: 'Whitepaper — We build real',
  description:
    'PACT Protocol: how a public, verifiable trust score for institutional domains is built from infrastructure that already exists.',
};

const sections = whitepaperBlocks.filter((b) => b.type === 'h2') as Extract<
  (typeof whitepaperBlocks)[number],
  { type: 'h2' }
>[];

export default function WhitepaperPage() {
  return (
    <PageShell backHref="/" backLabel="Home" width="default">
      <Reveal>
        <header className="mb-10 sm:mb-12">
          <p className={`${eyebrow} mb-3`}>Technical spec</p>
          <h1 className={`${pageTitle} mb-2`}>{whitepaperMeta.title}</h1>
          <p className="text-base sm:text-lg text-muted mb-5">{whitepaperMeta.subtitle}</p>
          <p className="text-xs font-mono text-muted-2">
            v{whitepaperMeta.version} — {whitepaperMeta.date} ·{' '}
            <a href={`mailto:${whitepaperMeta.contact}`} className={linkAccent}>
              {whitepaperMeta.contact}
            </a>
          </p>
        </header>
      </Reveal>

      <Reveal delay={40}>
        <div className="rounded-xl border border-border bg-surface px-5 py-5 sm:px-6 sm:py-6 mb-10 sm:mb-12">
          {whitepaperAbstract.map((paragraph, i) => (
            <p
              key={i}
              className={`text-[15px] leading-relaxed text-muted ${
                i === whitepaperAbstract.length - 1 ? 'mb-0' : 'mb-4'
              }`}
            >
              {renderInline(paragraph)}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <nav aria-label="Table of contents" className="mb-12 sm:mb-14">
          <p className={`${eyebrow} mb-3`}>Contents</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-none p-0 m-0">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2.5 py-1 text-sm text-muted hover:text-txt transition-colors no-underline"
                >
                  <span className="font-mono text-xs text-muted-2 tabular-nums">{s.number}</span>
                  {s.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      <Reveal delay={80}>
        <article>
          {whitepaperBlocks.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2
                  key={i}
                  id={block.id}
                  className="scroll-mt-8 text-xl sm:text-2xl font-bold tracking-tight text-txt mt-14 sm:mt-16 pt-10 border-t border-border mb-5 flex items-baseline gap-3"
                >
                  <span className="font-mono text-sm font-normal text-muted-2">{block.number}</span>
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'h3') {
              return (
                <h3 key={i} className="text-base font-semibold text-txt mt-8 mb-3">
                  {block.text}
                </h3>
              );
            }
            return (
              <p key={i} className="text-[15px] leading-relaxed text-muted mb-4">
                {renderInline(block.text)}
              </p>
            );
          })}
        </article>
      </Reveal>

      <Reveal delay={100}>
        <footer className="mt-14 sm:mt-16 pt-8 border-t border-border">
          <p className="text-xs font-mono text-muted-2 leading-relaxed mb-6">
            PACT — Provenance Attestation and Chain of Trust
            <br />
            Whitepaper v{whitepaperMeta.version} — {whitepaperMeta.date}
            <br />
            {whitepaperMeta.contact}
          </p>
          <p className="text-sm text-muted">
            Prefer the short version?{' '}
            <Link href="/how-it-works" className={linkAccent}>
              See how it works
            </Link>{' '}
            or{' '}
            <Link href="/" className={linkAccent}>
              read the manifesto
            </Link>
            .
          </p>
        </footer>
      </Reveal>
    </PageShell>
  );
}
