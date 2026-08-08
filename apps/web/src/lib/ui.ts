// Standardized on a single content width (max-w-3xl) across every page, the
// same measure signet-witness uses everywhere on its marketing surfaces.
export const container = 'max-w-3xl mx-auto px-4 sm:px-6';
export const containerNarrow = container;
export const containerDefault = container;
export const containerWide = container;

export const eyebrow = 'text-[0.65rem] font-mono uppercase tracking-widest text-muted-2';
export const pageTitle = 'text-3xl sm:text-4xl font-bold tracking-tight text-txt leading-[1.05]';
export const pageIntro = 'text-sm sm:text-base text-muted leading-relaxed';
export const sectionTitle = 'text-base font-semibold text-txt';

export const btnPrimary =
  'inline-flex items-center justify-center h-11 px-5 rounded-lg bg-accent text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed no-underline';
export const btnGhost =
  'inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border bg-bg text-[0.7rem] font-semibold text-muted hover:text-txt hover:border-muted-2 no-underline';

export const input =
  'w-full min-w-0 h-11 bg-bg border border-border rounded-lg px-3.5 text-base sm:text-sm font-mono text-txt placeholder:text-muted-2 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15';
export const label = 'block text-xs font-mono uppercase tracking-widest text-muted-2';

export const panel = 'rounded-xl border border-border bg-surface shadow-sm overflow-hidden';
export const panelBody = 'p-5';
export const panelHeader =
  'px-5 py-3.5 border-b border-border flex items-center justify-between gap-3';
export const panelSectionTitle = `${sectionTitle} mb-4`;

export const alertError =
  'rounded-lg border border-rose-400/30 bg-rose-400/5 px-4 py-3 text-sm font-semibold text-rose-500 mb-6';
export const alertStaging =
  'rounded-lg border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-amber mb-6';

export const badgeVerified =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-verified/40 bg-verified/10 text-verified text-xs font-semibold shrink-0';
export const badgeAmber =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber/40 bg-amber/10 text-amber text-xs font-semibold shrink-0';

export const linkMuted = 'text-muted-2 hover:text-muted no-underline';

export const pathCard =
  'group flex flex-col items-start gap-2 rounded-lg border border-border bg-surface px-4 py-4 text-left hover:border-muted-2 cursor-pointer w-full';

export const statCard =
  'rounded-xl border border-border bg-surface px-4 sm:px-5 py-4';
export const statValue = 'text-2xl sm:text-3xl font-bold font-mono tabular-nums leading-none';
export const statLabel = 'text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mt-1.5';
