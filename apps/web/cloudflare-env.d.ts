/// <reference types="@cloudflare/workers-types" />

// Cloudflare Worker bindings for this app, consumed via `getCloudflareContext().env`.
// Keep in sync with the `kv_namespaces` / `services` entries in wrangler.jsonc.
declare global {
  interface CloudflareEnv {
    /** Stores diagnostic-request form submissions from the landing page. */
    DIAGNOSTIC_KV?: KVNamespace;
  }
}

export {};
