import { hashWrapperMessage, parseDkimIdsFromRfc822, resolveWrapperDkimWitness } from '@pact/core';
import { createProcessor, type ReportJob } from './process-report.js';
import { extractDmarcXmlFromEmail } from './extract-xml.js';
import { handleLedgerRequest } from './http.js';
import { snapshotWrapperDkimKeys, verifyWrapperDkim } from './dkim.js';
import { storeWrapperBlob } from './wrapper-store.js';
import { publishAnchoredRoot } from './publish-root.js';
import { ingestCtBatch, ingestCtForDomain } from './ct-ingest.js';

export interface Env {
  ENVIRONMENT: string;
  REPORT_QUEUE: Queue<ReportJob>;
  DB: D1Database;
  CHAIN_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY?: string;
  LEDGER_WRITE_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await handleLedgerRequest(request, env);
    if (
      request.method === 'POST' &&
      new URL(request.url).pathname.replace(/\/$/, '') === '/v1/domains' &&
      response.ok
    ) {
      const body = (await response.clone().json().catch(() => null)) as { domain?: string } | null;
      if (body?.domain) {
        const domain = body.domain;
        ctx.waitUntil(
          ingestCtForDomain(env.DB, domain)
            .then((row) =>
              console.log(JSON.stringify({ event: 'ct_ingest_connect', domain, ...row })),
            )
            .catch((err) =>
              console.error(JSON.stringify({ event: 'ct_ingest_connect_failed', error: String(err) })),
            ),
        );
      }
    }
    return response;
  },

  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    try {
      const rawBytes = new Uint8Array(await new Response(message.raw).arrayBuffer());
      const raw = new TextDecoder('latin1').decode(rawBytes);

      let verified: { domain: string; selector: string }[] = [];
      let dkimResults: unknown[] = [];
      try {
        const dkim = await verifyWrapperDkim(rawBytes);
        verified = dkim.passed;
        dkimResults = dkim.results;
      } catch (err) {
        if (String(err).includes('dkim temperror')) throw err;
        console.log(JSON.stringify({ event: 'dkim_verify_failed', error: String(err), from: message.from }));
      }

      const headerIds: { domain: string; selector: string }[] = [];
      message.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'dkim-signature') {
          headerIds.push(...parseDkimIdsFromRfc822(`DKIM-Signature: ${value}\r\n\r\n`));
        }
      });

      const witness = resolveWrapperDkimWitness({
        verified,
        headerIds,
        rfc822: raw,
        envelopeFrom: message.from,
      });

      const xml = await extractDmarcXmlFromEmail(raw);
      if (!xml) {
        console.log(JSON.stringify({ event: 'email_discarded', reason: 'not_dmarc', from: message.from }));
        return;
      }

      if (!witness.ids.length) {
        console.log(
          JSON.stringify({
            event: 'email_discarded',
            reason: 'dkim',
            from: message.from,
            results: dkimResults,
          }),
        );
        return;
      }

      const primary = witness.ids[0]!;
      const wrapperHash = hashWrapperMessage(rawBytes);
      const dkimKeys = await snapshotWrapperDkimKeys(witness.ids);
      try {
        await storeWrapperBlob(env, {
          wrapperHash,
          rfc822: rawBytes,
          meta: {
            wrapperHash,
            byteLength: rawBytes.byteLength,
            receivedAt: new Date().toISOString(),
            envelopeFrom: message.from,
            dkimSource: witness.source,
            dkim: dkimKeys,
            bytesFrom: 'email-worker',
          },
        });
      } catch (err) {
        console.error(JSON.stringify({ event: 'wrapper_store_failed', error: String(err), wrapperHash }));
      }
      await env.REPORT_QUEUE.send({
        envelopeFrom: message.from,
        rawXml: xml,
        receivedAt: new Date().toISOString(),
        dkimDomains: witness.ids.map((row) => row.domain),
        dkimDomain: primary.domain,
        dkimSelector: primary.selector || null,
        wrapperHash,
        wrapperDkim: witness.ids,
      });

      console.log(
        JSON.stringify({
          event: 'report_enqueued',
          from: message.from,
          size: rawBytes.length,
          dkim: witness.ids,
          dkimSource: witness.source,
          dkimKeys: dkimKeys.length,
          wrapperHash,
        }),
      );
    } catch (err) {
      console.error(JSON.stringify({ event: 'email_handler_failed', error: String(err), from: message.from }));
      throw err;
    }
  },

  async queue(batch: MessageBatch, env: Env): Promise<void> {
    const process = createProcessor(env);

    for (const msg of batch.messages) {
      try {
        const result = await process(msg.body as ReportJob);
        console.log(JSON.stringify({ event: 'report_processed', ...result }));
        msg.ack();
      } catch (err) {
        console.error(JSON.stringify({ event: 'report_failed', error: String(err) }));
        msg.retry();
      }
    }
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    try {
      const ct = await ingestCtBatch(env.DB);
      console.log(JSON.stringify({ event: 'ct_ingest', ...ct }));
    } catch (err) {
      console.error(JSON.stringify({ event: 'ct_ingest_failed', error: String(err) }));
    }
    const result = await publishAnchoredRoot(env);
    console.log(JSON.stringify({ event: 'root_publish_scheduled', ...result }));
  },
} satisfies ExportedHandler<Env>;
