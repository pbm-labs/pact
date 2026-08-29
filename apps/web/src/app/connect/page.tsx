import { addPactRuaToDmarc, PACT_RUA_ADDRESS } from '@pact/core';
import { ConnectView } from '@/components/connect-view';
import { parseConnectPath } from '@/lib/connect-path';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Connect your mail reports — leftover',
  description:
    'Two minutes. Mostly automatic. Add a destination so independent mail reports are kept.',
};

export default async function ConnectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorKey = typeof params.error === 'string' ? params.error : undefined;
  const domainPrefill = typeof params.domain === 'string' ? params.domain : '';
  const detail = typeof params.detail === 'string' ? params.detail : undefined;
  const initialPath = parseConnectPath(typeof params.path === 'string' ? params.path : undefined);

  const { content: dmarcSnippet } = addPactRuaToDmarc(null);

  return (
    <ConnectView
      errorKey={errorKey}
      detail={detail}
      domainPrefill={domainPrefill}
      dmarcSnippet={dmarcSnippet}
      ruaAddress={PACT_RUA_ADDRESS}
      initialPath={initialPath}
    />
  );
}
