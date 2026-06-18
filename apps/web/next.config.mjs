import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Load env from monorepo root (.env.local)
  envDir: '../..',
  transpilePackages: ['@pact/core'],
};

export default nextConfig;

initOpenNextCloudflareForDev();
