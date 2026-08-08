import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractDmarcXmlFromEmail } from '../src/extract-xml.ts';

async function main() {
  const fixture = resolve(process.cwd(), 'fixtures/dmarc-google-pbm-labs.xml');
  const xml = readFileSync(fixture, 'utf8');

  const extracted = await extractDmarcXmlFromEmail(xml);
  if (!extracted || !extracted.includes('<feedback') || !extracted.includes('</feedback>')) {
    console.error('extract-xml smoke failed: fixture did not yield feedback XML');
    process.exit(1);
  }

  console.log('extract-xml smoke ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
