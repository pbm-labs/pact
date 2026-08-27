import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load repo-root .env.local for monorepo dev/build
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const envLocal = join(repoRoot, '.env.local');
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pact/core'],
  async redirects() {
    return [
      { source: '/v2', destination: '/', permanent: true },
      { source: '/records', destination: '/', permanent: true },
      { source: '/domains', destination: '/', permanent: true },
      { source: '/domain/:domain', destination: '/', permanent: true },
      { source: '/badge/:slug*', destination: '/', permanent: true },
      { source: '/why-pact', destination: '/whitepaper', permanent: true },
      { source: '/roadmap', destination: '/whitepaper', permanent: true },
      { source: '/docs', destination: '/whitepaper', permanent: true },
      { source: '/docs/why', destination: '/whitepaper', permanent: true },
      { source: '/docs/roadmap', destination: '/whitepaper', permanent: true },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
