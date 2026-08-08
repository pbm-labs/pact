import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const prose =
  'text-[15px] sm:text-base text-muted leading-[1.8] [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-txt [&_h1]:leading-tight [&_h1]:mb-2 [&_h1]:mt-0 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-txt [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-semibold [&_h3]:text-txt [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1.5 [&_strong]:text-txt [&_strong]:font-semibold [&_a]:text-accent [&_a]:font-semibold [&_a]:no-underline hover:[&_a]:opacity-90 [&_hr]:border-border [&_hr]:my-10 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-surface [&_code]:border [&_code]:border-border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded';

export function WhitepaperBody({ markdown }: { markdown: string }) {
  return (
    <article className={prose}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
