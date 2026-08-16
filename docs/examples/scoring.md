# Example: scoring a PACT public record

**Status:** Informative. Not protocol.  
**Algorithm:** `example-score-0.1`  
**Display mapping:** `example-display-0.1`  
**Code:** [`examples/score/`](../../examples/score/)

PACT publishes independently confirmed history. It does not define a score, an activation label, or a verdict. Applications MAY interpret the published fields. This document is one example of how.

The public reference UI does not display this score.

## Inputs (public record only)

| Field | Meaning |
|-------|---------|
| `totalPassCount` | Sum of authenticated DKIM-pass counts |
| `reportCount` | Number of authenticated reports (leaves) |
| `reportingOrgsCount` | Distinct reporting organizations |
| `independentlyConfirmedSince` | Time of the domain’s first authenticated report |
| `domainRegisteredAt` | Domain registration date, if known — **pass-through only, never in arithmetic** |

Do not fold domain age into maturity. The two clocks stay separate (protocol §4.2).

## Formula (`example-score-0.1`)

```
T = log(V + 1) × D × A

V = totalPassCount
D = min(1, reportingOrgsCount / reportCount)
A = 1 - e^(-λ × independentlyConfirmedDays)
λ = 0.005
```

`A = 0.5` at ≈139 days. `A ≈ 0.90` at ~460 days.

A prior draft proposed `D = log(|R|+1)/log(50)`. That formula was never shipped and is not this example.

**Logarithmic volume:** bulk inflation has sub-linear returns.

**Diversity:** confirmation by many independent reporting organizations relative to the number of reports. History concentrated in a single reporter scores lower.

**Maturity:** a domain connected yesterday cannot reach high maturity regardless of volume. MUST NOT be inflated by domain registration age.

## Example policy labels

These labels are this example’s policy. They are not protocol.

| Condition | Label in this example |
|-----------|------------------------|
| `A < 0.5` | provisional |
| `A ≥ 0.5` | activated |

Applications define their own acceptance thresholds.

## Display mapping (`example-display-0.1`)

Raw `T` is not altered for presentation. A separate mapping puts it on a 0–100 scale:

```
T = 0          →  0 / 100     "No history yet"
0 < T < 1.0    →  1-10 / 100  "Provisional"
T 1-3          →  10-35 / 100 "Early"
T 3-6          →  35-65 / 100 "Established"
T 6-9          →  65-90 / 100 "High confidence"
T > 9          →  90-100 / 100 "Maximum confidence"
```

A nonzero raw score MUST NOT round down to a 0/100 display. **"No history yet"** is reserved for `T = 0`.

Changing how people see the score MUST NOT rewrite what was measured.

## Open questions (example, not protocol)

1. Is `reportingOrgs / reportCount` sufficient, or should an application adopt HHI-based concentration scoring or a logarithmic cap?
2. Empirical tuning of λ and thresholds against a representative domain corpus.
