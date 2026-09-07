/** GET JSON from the public ledger. Avoid Worker-incompatible fetch options. */
export async function ledgerGet(url: string): Promise<unknown | null> {
  try {
    const init: RequestInit = {
      method: 'GET',
      headers: { Accept: 'application/json' },
    };
    if (typeof AbortSignal.timeout === 'function') {
      init.signal = AbortSignal.timeout(15_000);
    }
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`ledgerGet: ${url} -> HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`ledgerGet: ${url} -> ${String(err)}`);
    return null;
  }
}
