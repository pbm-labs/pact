export const LOCAL_WHITEPAPER_MARKDOWN = `
# PACT Protocol
## Provenance of Accumulated Checkable Traces

**Version 1.11 — August 2026**  
**hello@pbm-labs.com**

---

## Abstract

PACT records leftover traces. It does not invent a ceremony and ask the world to perform it.

Mail systems already emit DMARC aggregate reports. Browsers already required Certificate Transparency logs. Neither feed exists for PACT. Both are exhaust from infrastructure that had to exist anyway. PACT buckets that exhaust into one Merkle tree as **separate kinds**. It does not blend them into a score.

v0.2 binds mail reports. That encoding is frozen and untagged. v0.3 adds Certificate Transparency as a tagged kind (\`pact-ct-v1\`) on the same tree. A CT leaf is a first-seen calendar, not an HTTPS badge. Let's Encrypt will issue a real certificate in minutes. That is a weak history, not a missing history.

Judgement stays outside. The public record is stubbornly boring: days independently confirmed, reports, reporting organizations, certificate first-seen dates, wrapper openings, Merkle proofs. Roots are published on-chain so inclusion does not depend on this operator's database. Leaves stay off-chain.

Domains connect by pointing an existing DNS field at mail intake. Certificate logs are indexed after connect. There is no second ritual.

---

## 1. The problem is empty history

Identifiers are cheap. A domain, a profile, a PDF, a "verified" badge — all of it can be manufactured. What cannot be manufactured is yesterday, provided someone else was already watching.

PACT does not ask whether a name is legitimate. It publishes independently confirmed leftover trace for that name, and it refuses to turn that trace into a verdict.

The test for a leftover source is simple: **they can cause the event; they cannot be the witness.**

---

## 2. Leftover traces, not a new network

PACT is source-agnostic. Further leftover kinds MAY be added. They MUST NOT share a preimage layout with an existing kind. Applications MUST NOT blend kinds into a single score.

### 2.1 Mail (v0.2)

Receiving systems — Gmail, Outlook, Yahoo, and others — already generate DMARC aggregate reports. Those reports contain no message bodies, subjects, recipients, or personal identities. They say whether authenticated mail showed up, how often, from which infrastructure, according to whom.

A domain joins that stream by adding PACT as a report destination in DNS — usually \`rua\` on an existing DMARC record. Canonical intake is \`rua@pact.webuildreal.dev\`. Nothing about how the domain sends mail changes. History starts when the first valid independent report arrives, not when the DNS line is saved.

The v0.2 mail leaf is frozen. It stays untagged so existing hashes remain valid.

### 2.2 Certificate Transparency (v0.3)

CT logs exist because browsers demanded a public diary of issuance. Nobody built them for PACT. A domain that appears there has a first-seen date someone else wrote down.

The reference ingest reads **crt.sh**, a public *index* over logs, not a log operator. Stored \`log_id\` is \`crt.sh\`. Stored \`log_index\` is the crt.sh certificate id. That is weaker than a specific log's signed tree head. It is still leftover trace.

A CT leaf attests calendar, not certificate quality, not "this domain has HTTPS." Inclusion requires the certificate to cover the connected domain. Dedup is \`(domain, fingerprint)\`. CT leaves share the same sparse Merkle tree and \`leaf_index\` space as mail leaves. They are not merged into mail leaves.

### 2.3 Kinds are not a score

Mail volume is not CT age. CT first-seen is not mail maturity. A domain that obtained a certificate this morning and a domain that has been in the logs since 2016 are both real certificates. Only one has a calendar. Applications that want a number may compute one from published fields. The protocol will not do it for them.

---

## 3. From leftover to proof

When a valid mail report arrives, ingest DKIM-verifies the wrapper, discards the XML after aggregation, and commits a leaf. The leaf includes a wrapper witness: keccak256 of the received RFC822 and the passing \`d=\` / selector pairs. The wrapper bytes and a DKIM TXT snapshot are stored off-chain, content-addressed by that hash. A checker can confirm stored bytes match the leaf, and that the DNS key is on record. That is not a stranger re-running the original SMTP signature. The mail is not on-chain.

When CT rows are indexed for a connected domain, ingest commits a tagged leaf: kind id, domain, fingerprint, first-seen / not-before / not-after, log id, log index. Fingerprint is SHA-256 of the certificate when known; otherwise a keccak of serial, issuer, and not-before.

Leaves insert into a 32-level keccak256 sparse Merkle tree. The root is published to \`PactRoots\` on **Base Sepolia** at [\`0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee\`](https://sepolia.basescan.org/address/0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee) — testnet, permissioned publisher. Anyone can call \`getLatestRoot()\` and \`verifyProof\`. Roots supersede one another; none can be edited, backdated, or withdrawn. The contract does not store leaves. Inclusion is attested. Availability is not.

---

## 4. Connecting is not the evidence

Cloudflare OAuth, a pasted DNS line, or an existing reporting tool all do the same thing: point mail reports at intake. They do not submit a score. They do not unlock CT. CT is leftover public exhaust, indexed after the domain exists on the ledger.

Manual and tool paths do not require returning to the site. The domain appears when the first valid aggregate report arrives.

---

## 5. Two clocks, then a calendar

**Domain registered** answers how long the name has existed.

**Independently confirmed since** answers how long independent mail reporters have been confirming the domain inside PACT.

**CT first-seen** answers when a covering certificate first appeared in the indexed public logs.

These must not be collapsed. Registration age MUST NOT inflate PACT mail history. A CT date MUST NOT be sold as an HTTPS quality claim. A hijacker who seizes DNS inherits none of the mail clock, and a fresh Let's Encrypt certificate does not mint a past.

---

## 6. Privacy is the data source

PACT never reads mailboxes. DMARC aggregates and CT log metadata do not contain message content. CT data is already public log exhaust. On-chain: roots, leaf counts, timestamps. Off-chain: hashed mail signal, wrapper openings, CT calendar fields.

---

## 7. Honest limits

- Roots are on Base Sepolia, permissioned publisher — not mainnet, not permissionless.
- Reporter-wrapper DKIM is verified at ingest. SPF of the connecting MTA is not.
- RFC 6376 on the Email Worker copy may fail. Stored bytes can still be checked against the leaf hash.
- Leaf availability is the operator's database. Roots attest inclusion, not availability.
- crt.sh is an index. It is not a CT log's Merkle proof.
- Scoring examples in the repository are informative. They are not protocol.

The normative specification is [docs/pact_protocol.md](https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol.md). This essay is the public reading of that spec. Encoding, threat model, and leaf preimages live there (mail: Appendix C.4–C.5; CT: C.6).

---

## 8. Status

**Live.** Connect, mail ingest, wrapper witness, sparse Merkle tree, \`PactRoots\` on Base Sepolia, public records, CT as a second kind.

**Waiting on the world.** History only compounds while independent mail reports keep arriving.

**Later.** Content-addressed leaf blobs, independent mirrors, Base mainnet, permissionless publication.

PBM Labs LLC operates the first reference implementation under [we build real](https://webuildreal.dev). PACT is an open protocol. Third-party implementations are encouraged.

---

*PACT — Provenance of Accumulated Checkable Traces*  
*Whitepaper v1.11 — August 2026*  
*hello@pbm-labs.com*
`;
