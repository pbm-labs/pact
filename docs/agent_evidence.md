# PACT — Evidence interface for agents

**Status:** Live on the reference ledger (August 2026). Complements `docs/pact_protocol.md`; does not replace it.
**Live API:** `GET https://ledger.webuildreal.dev/v1/kinds` and `GET https://ledger.webuildreal.dev/v1/evidence?kind=&identity=`. Domain-scoped `GET /v1/domains` remains for mail/CT connect leftovers.
**Public site:** [webuildreal.dev](https://webuildreal.dev) is the movement and the query. Mail intake stays at `/connect`. There is no domain profile. This note is not the homepage.
**Audience:** whoever builds a policy / governance / execution layer on top of leftover traces. PACT does not define that layer.

---

## 1. What broke

PACT records leftover traces as **separate kinds** on a Merkle tree. Bindings MUST NOT share a preimage. Applications MUST NOT blend kinds into a score. Judgement stays outside.

That taxonomy is real. The **query interface** still assumes the unit of evidence is a domain:

```
GET /v1/domains/:domain
```

That was true when the only leftover was mail (DMARC `header_from`). It stops being true once Certificate Transparency, Rekor/Sigstore, and any later kind are first-class, because **each kind has a different identity key**:

| Kind (live) | Tag | Identity the log already used |
| --- | --- | --- |
| Mail | untagged v0.2 | Sending domain (`header_from`) |
| Certificates | `pact-ct-v1` | Hostname in SAN/CN (as CT leftover) |
| Signatures | `pact-rekor-v1` | Rekor leftover subject (often a GitHub URI or email, rarely a website hostname) |

An agent cannot verify a counterparty’s **mail leftover** and **GitHub-shaped signature leftover** in one domain call. `/v1/domains/:domain` encodes an assumption the kinds already broke.

Leftover is whatever an independent system already logged. Domain is one identity mail and CT often use — not the type of the whole world. There is no human evidence UI in this design: no domain profile, no ranked records, no three stream cards. The interface is the catalog and kind-scoped query.

---

## 2. Split of responsibility

```
Someone else          PACT                    Someone else
─────────────         ────                    ─────────────
policies              leftover + proofs       execution
governance            kind-scoped query
"is this allowed?"    inclusion vs a named root
```

PACT is the agent’s **world of evidence**. It does not decide. The agent composes queries in real time from identities **the task actually used** (From domain, DKIM `d=`, cert SAN, GitHub URI, Rekor UUID, leaf hash). It hands a bundle of checkable facts to policy. Policy says yes, no, or wait.

PACT MUST NOT correlate identities across kinds (e.g. MUST NOT treat `github.com/acme/pay` as `acme.com`). That map is interpretation.

---

## 3. Query model

The agent does not start from “open this domain.” It extracts leftover identities from the moment, then asks **per kind**.

**Shape (live):**

- Catalog: `GET /v1/kinds`
- Query: **kind + identity** (`GET /v1/evidence?kind=mail|ct|rekor&identity=`)
- Result: leaves for that kind whose leftover key is that identity, **or zero rows** (HTTP 200)
- Each result **echoes the identity it actually used**
- Proof: list rows include `included` (membership in the live shared tree). The inclusion proof is on `GET /v1/leaves/:hash` against a **named** root (`shared`). List responses MUST NOT dump proof arrays.

Zero rows is a successful answer: “this log has no leftover under that identity.” It is not a missing setup step.

### 3.1 Echo the identity actually used

A well-formed, cryptographically valid answer about the **wrong** key is worse than a miss. Inclusion proves the leaf is in the tree, not that the caller meant that counterparty.

PACT does not fix the caller’s extraction bugs. It makes the responsibility **auditable**:

- Every query is kind + identity.
- Every response repeats the identity that was looked up.
- The catalog states the key shape in machine-readable form.

A naive caller can still ask the wrong question. They cannot pretend PACT resolved entities for them.

**Entity resolution** (From domain vs DKIM `d=` vs GitHub URI vs cert SAN) is policy-layer engineering. It does not disappear. It moves.

---

## 4. Kind catalog

A catalog is a **standing** cost, not a one-time schema. Each kind needs: identity key, ingest path, coverage rule, empty-is-success, frozen encoding, tests, API, docs — and a ban on blending.

Direction: **small leftover-only catalog**. New leftover MAY be added as tagged kinds. Adding a kind is a product decision, not a new column on a domain page.

**Discipline:**

- Frozen encodings (`pact-ct-v1`, `pact-rekor-v1`; mail v0.2 untagged and frozen).
- Runtime discovery (`GET /v1/kinds`) so old agents **ignore kinds they do not understand**.
- Cut rather than pad. BGP, Wayback, guessed mailboxes, forge identities that do not cover a name — not kinds just because they are interesting.

### 4.1 Stake label: `calendar` | `accumulated`

This is a **static property of the kind**, not an interpretation of a particular name. It replaces a binary “zero stake” test with a more precise one: **what is the series made of?**

| Label | Meaning |
| --- | --- |
| `accumulated` | Leftover only grows if independent third parties keep acting for their own reasons (report, resolve, depend). One mint does not create the history. |
| `calendar` | A single entry is cheap. Any weight is in a *sustained series*, not in one fact. A new cert or a new signature can appear in minutes. |

PACT publishes the flag. The policy engine decides what to do with it. PACT does not score.

**Live kinds (catalog, `GET /v1/kinds`):**

| Kind | Stake |
| --- | --- |
| Mail | `accumulated` |
| Certificates | `calendar` |
| Signatures (Rekor) | `calendar` |

**Not in the protocol.** If a kind were ever added, it would declare the same test at birth — not inferred later:

| Candidate (not live, not promised) | Stake if it were a kind |
| --- | --- |
| Passive DNS | `accumulated` (third parties keep resolving) |
| Package reverse-dependencies / downloads | `accumulated` (third parties keep depending) |
| BGP | `calendar` (announcing a route is instant) |
| Raw GitHub publish / release dates | `calendar` (a push is instant) |

Listing them here does **not** add them. The catalog stays small.

---

## 5. One tree vs forest

**Live today:** all kinds share one sparse Merkle tree and one `leaf_index` space. One published root. Spec: tree is kind-agnostic; bindings MUST NOT share a preimage; kinds MUST NOT be merged into one leaf.

That is a **choice**, not the only coherent option.

| | One tree | Forest (a tree per kind) |
| --- | --- | --- |
| Checker | One root to verify against | N roots; must not treat “mail root is fine” as “Rekor is fine” |
| Failure | Bad ingest of kind K still **commits junk into the latest root**. Other kinds’ leaf hashes unchanged; old roots still verify. The *current world* includes garbage of K. | A poisoned Rekor pipeline does not move the mail root. Isolation matches “no shared preimage” at the **anchor**, not only in hash layout. |
| Ops (this operator, this week) | One `publishRoot`, one monitor | N anchoring pipelines, N on-chain publishes, N things to watch |

One tree optimizes the checker and the solo operator. A forest isolates failure. If the agent world is the point, the forest stays on the table.

### 5.1 Seam (ship now, split later)

Do not choose “correct” against “buildable this week.” Choose **one tree with a seam**.

The catalog and the query are already kind-scoped. A v1 caller asks `kind + identity` and verifies against a **named** root. It does not need to know whether that root is a shared tree or that kind’s tree.

**v1 (buildable now)**

- One tree, one `publishRoot`.
- Each kind **declares** a `kind_root` (today it MAY be the same shared root).
- A `meta_root` is the ordered commitment `kind_id → kind_root` (layout reserved even if on-chain is still one root).
- Proofs name which root they used: `shared` or `kind_id`.

**v2 (no breaking callers)**

- Split the forest. Kind-roots diverge. Meta-root is the one checker of checkers.
- v1 callers keep working if proofs already named the root.

That is how you avoid a surprise migration without paying N chains today.

---

## 6. What PACT will not do

- Score, activation label, or verdict.
- Blend kinds.
- Guess mailboxes to search Rekor.
- Treat `github.com/…` as covering a customer domain.
- Map identities across kinds.
- Invent a ritual so a kind fills (mail leftover still needs DNS so reports are kept — that is intake for one kind, not a consumer “connect your domain” product, and not “sign to Rekor”).

Sigstore’s usual identity is the **signer** (GitHub Actions URI, OIDC email), not the website hostname. Empty signature leftover for a hostname is the honest record.

---

## 7. Closed pressures

1. **Identity extraction** — burden on the caller; PACT echoes the identity actually used.
2. **Kind catalog** — small, frozen encodings, runtime discovery, stake labeled kind-by-kind.
3. **Forest vs one tree** — operational cost is real; meta-root + named proof root is the v1 seam; forest is v2 without breaking callers.

No pressure point left open in this note.
