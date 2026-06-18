import { createProcessor, type ReportJob } from './process-report.js';
import { extractDmarcXmlFromEmail } from './extract-xml.js';

export interface Env {
  ENVIRONMENT: string;
  REPORT_QUEUE: Queue<ReportJob>;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    try {
      const raw = await new Response(message.raw).text();
      const xml = await extractDmarcXmlFromEmail(raw);

      if (!xml) {
        console.log(JSON.stringify({ event: 'email_discarded', reason: 'not_dmarc', from: message.from }));
        return;
      }

      await env.REPORT_QUEUE.send({
        envelopeFrom: message.from,
        rawXml: xml,
        receivedAt: new Date().toISOString(),
      });

      console.log(JSON.stringify({ event: 'report_enqueued', from: message.from, size: raw.length }));
    } catch (err) {
      console.error(JSON.stringify({ event: 'email_handler_failed', error: String(err), from: message.from }));
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
