import { createProcessor, type ReportJob } from './process-report.js';
import { extractDmarcXmlFromEmail } from './extract-xml.js';
import { handleLedgerRequest } from './http.js';
import { verifyWrapperDkim } from './dkim.js';

export interface Env {
  ENVIRONMENT: string;
  REPORT_QUEUE: Queue<ReportJob>;
  DB: D1Database;
  CHAIN_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY?: string;
  LEDGER_WRITE_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleLedgerRequest(request, env);
  },

  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    try {
      const rawBytes = new Uint8Array(await new Response(message.raw).arrayBuffer());
      const dkim = await verifyWrapperDkim(rawBytes);
      if (!dkim.passed.length) {
        console.log(
          JSON.stringify({
            event: 'email_discarded',
            reason: 'dkim',
            from: message.from,
            results: dkim.results,
          }),
        );
        return;
      }

      const raw = new TextDecoder('latin1').decode(rawBytes);
      const xml = await extractDmarcXmlFromEmail(raw);

      if (!xml) {
        console.log(JSON.stringify({ event: 'email_discarded', reason: 'not_dmarc', from: message.from }));
        return;
      }

      const primary = dkim.passed[0]!;
      await env.REPORT_QUEUE.send({
        envelopeFrom: message.from,
        rawXml: xml,
        receivedAt: new Date().toISOString(),
        dkimDomains: dkim.passed.map((row) => row.domain),
        dkimDomain: primary.domain,
        dkimSelector: primary.selector,
      });

      console.log(
        JSON.stringify({
          event: 'report_enqueued',
          from: message.from,
          size: rawBytes.length,
          dkim: dkim.passed,
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
} satisfies ExportedHandler<Env>;
