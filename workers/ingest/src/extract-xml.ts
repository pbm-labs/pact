import { unzipSync } from 'fflate';

/** Pull DMARC aggregate XML from a raw RFC822 message or plain XML payload. */
export async function extractDmarcXmlFromEmail(raw: string): Promise<string | null> {
  const trimmed = raw.trim();
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<feedback')) {
    return extractFeedback(trimmed);
  }

  const embedded = extractFeedback(raw);
  if (embedded) return embedded;

  for (const bytes of collectAttachmentBytes(raw)) {
    const xml = await bytesToXml(bytes);
    if (xml) return xml;
  }

  return null;
}

function extractFeedback(text: string): string | null {
  const match = text.match(/<feedback[\s\S]*?<\/feedback>/);
  return match?.[0] ?? null;
}

function collectAttachmentBytes(raw: string): Uint8Array[] {
  const results: Uint8Array[] = [];
  const seen = new Set<string>();

  const boundary = raw.match(/boundary="?([^"\r\n;]+)"?/i)?.[1];
  if (boundary) {
    const escaped = boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const part of raw.split(new RegExp(`--${escaped}(?:--)?`))) {
      if (!part.trim()) continue;
      const type = part.match(/Content-Type:\s*([^\r\n;]+)/i)?.[1]?.toLowerCase() ?? '';
      const looksLikeReport =
        type.includes('zip') ||
        type.includes('gzip') ||
        type.includes('xml') ||
        type.includes('octet-stream');
      if (!looksLikeReport) continue;

      const b64 = extractBase64Body(part);
      if (!b64) continue;
      pushUniqueBytes(results, seen, b64);
    }
  }

  for (const part of raw.match(/(?:^|\n)[A-Za-z0-9+/=\r\n]{80,}(?:\n|$)/g) ?? []) {
    pushUniqueBytes(results, seen, part);
  }

  return results;
}

function pushUniqueBytes(results: Uint8Array[], seen: Set<string>, b64: string): void {
  try {
    const bytes = decodeBase64(b64);
    const key = `${bytes.length}:${bytes[0]}:${bytes[1]}:${bytes[2]}`;
    if (seen.has(key)) return;
    if (!looksLikeAttachment(bytes)) return;
    seen.add(key);
    results.push(bytes);
  } catch {
    // not valid base64
  }
}

function looksLikeAttachment(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return true; // PK zip (Google)
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return true; // gzip
  const head = new TextDecoder().decode(bytes.subarray(0, 16));
  return head.startsWith('<?xml') || head.startsWith('<feedback');
}

function extractBase64Body(part: string): string | null {
  const encoding = part.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i)?.[1]?.toLowerCase();
  if (encoding && encoding !== 'base64') return null;

  const body = part.split(/\r?\n\r?\n/).slice(1).join('\n\n').trim();
  if (!body || !/^[A-Za-z0-9+/=\s]+$/.test(body.replace(/\s/g, ''))) return null;
  return body;
}

function decodeBase64(input: string): Uint8Array {
  const normalized = input.replace(/\s/g, '');
  return Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
}

async function bytesToXml(bytes: Uint8Array): Promise<string | null> {
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return xmlFromZip(bytes);
  }

  let text: string;
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    text = await gunzip(bytes);
  } else {
    text = new TextDecoder().decode(bytes);
  }

  return extractFeedback(text);
}

function xmlFromZip(bytes: Uint8Array): string | null {
  try {
    const files = unzipSync(bytes);
    for (const name of Object.keys(files).sort()) {
      const text = new TextDecoder().decode(files[name]!);
      const xml = extractFeedback(text);
      if (xml) return xml;
    }
  } catch {
    return null;
  }
  return null;
}

async function gunzip(data: Uint8Array): Promise<string> {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}
