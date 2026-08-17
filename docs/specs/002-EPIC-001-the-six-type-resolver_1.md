# 🧊 EPIC: [EPIC-001] THE SIX-TYPE RESOLVER

---

### **I. OVERVIEW**

**Business Goal** A duel resolution engine that quietly collapses ambiguous outcomes into a binary
win/lose is indistinguishable, from the audience's perspective, from an unconstrained generator
rolling dice behind the curtain. This Epic exists because **the six-type taxonomy is the entire
mechanical thesis of the project** — Clean Win, Costly Win, Mutual Wound, Backfire, True Tie, and
Withdrawal each carry distinct narrative consequences, and if even one type is implemented as a thin
wrapper around another, the psychological granularity this Initiative is built to deliver quietly
degrades into noise.

**Technical Outcome** Upon closure of this Epic, `worker-sower`'s Stage 4 resolution engine computes
2d6 Argument Scores via a seeded PRNG, compares them against character `base_stats` and leverage
expenditure, and classifies every result into exactly one of the six exhaustively-typed outcome
branches with no default fallthrough. The True Tie fallback correctly and deterministically resolves
to Mutual Wound, logged explicitly rather than silently.

**Scope Definition**

- **IN-SCOPE:**
  - The 2d6 Argument Score computation via seeded PRNG.
  - All six outcome-type resolution branches, exhaustively implemented.
  - The "String" leverage-expenditure ledger tracking.
  - The True Tie → Mutual Wound deterministic fallback.

- **OUT-OF-SCOPE:**
  - The Residue Mandate's scar-tissue and false-relief mechanics — that is EPIC-002's concern.
  - Withdrawal's specific cooldown-halving behavior — that is EPIC-003's concern (though this Epic
    must correctly _classify_ a Withdrawal outcome).
  - The Individuation Multiplier's effect on scene _selection_ — that is EPIC-004's concern; this
    Epic resolves duels that have already been selected.

---

### **II. THE FEATURE REGISTRY (Scope Execution)**

**The Closed Ledger** _If a Feature is not listed below, it is unfunded. It does not exist. Do not
build it._

- [ ] **[FEAT-01] THE 2D6 ARGUMENT SCORE ENGINE:** Implement the seeded-PRNG 2d6 roll mechanic,
      combining the raw roll with character `base_stats` (spite, cunning, charm, nerve, warmth) and
      any spent leverage ("Strings") into a final Argument Score per combatant. `Math.random()` is
      banned; the PRNG must accept an explicit seed for reproducibility. | **Owner:** Backend Lead

- [ ] **[FEAT-02] THE EXHAUSTIVE OUTCOME CLASSIFIER:** Implement the classification logic mapping
      Argument Score differentials to exactly one of the six outcome types, using an
      exhaustively-typed switch/match construct with no `default` branch — the TypeScript compiler
      must be able to prove every case is handled. | **Owner:** Backend Lead

- [ ] **[FEAT-03] THE LEVERAGE LEDGER:** Implement per-character "String" tracking — leverage that
      can be spent to influence an Argument Score, decremented correctly on expenditure, and
      validated against a character's available leverage before a spend is permitted (no overdraft).
      | **Owner:** Backend Lead

- [ ] **[FEAT-04] THE TRUE TIE FALLBACK:** Implement the deterministic True Tie detection (exact
      Argument Score equality) and its explicit, logged fallback to Mutual Wound — the fallback must
      be distinguishable in logs from a "genuine" Mutual Wound outcome, preserving audit honesty
      about which path produced the result. | **Owner:** Backend Lead

---

### **III. TECHNICAL REQUIREMENTS & RISKS**

**Required Documentation**

- [ ] **Six-Type Outcome Mechanical Spec:** Complete specification of Argument Score computation and
      outcome classification thresholds. Filed in `docs/design/outcome-mechanics.md` (referenced as
      `DOC-INIT-007` in the governing Initiative).
- [ ] **Leverage Ledger Rules:** String acquisition, expenditure, and overdraft-prevention rules.
      Filed in `docs/design/leverage-ledger.md`.

**Technical Risks**

- **Correctness — The Silent Default Branch:** The single highest risk to this Epic is a classifier
  that technically compiles but includes an unreachable or catch-all branch masquerading as
  exhaustive. Code review must specifically verify the TypeScript compiler's exhaustiveness checking
  is actually active (e.g., via a `never`-typed assertion in an unreachable default), not just
  visually absent.
- **Determinism — PRNG Seed Propagation:** If the seed is not threaded correctly through every roll
  within a single duel (e.g., accidentally re-seeding mid-calculation), reproducibility silently
  breaks in a way that's invisible until a determinism audit in MS-03 catches it much later. This
  Epic's tests must include an explicit seed-propagation assertion, not just an output-comparison
  test.
- **Balance — Leverage Overdraft:** Without FEAT-03's overdraft prevention, a character could
  theoretically spend more Strings than they possess, producing an Argument Score that isn't
  reproducible from the character's actual documented state — a subtle integrity violation that
  wouldn't be caught by schema validation alone.

---

### **IV. REQUIRED ARTIFACTS & DELIVERABLES**

**Design & Architecture Assets**

- [ ] **Argument Score Computation Diagram:** Flowchart from raw 2d6 roll through stat modification
      through leverage expenditure to final score.
- [ ] **Outcome Classification Threshold Table:** The exact score-differential ranges mapping to
      each of the six outcome types.

**Engineering & Build Assets**

- [ ] **Code — Argument Score Engine:** `worker-sower/src/resolution/argumentScore.ts`.
- [ ] **Code — Outcome Classifier:** `worker-sower/src/resolution/outcomeTaxonomy.ts`.
- [ ] **Code — Leverage Ledger:** String tracking and overdraft-prevention logic.
- [ ] **Test Suite:** Exhaustiveness-proof test, seed-propagation test, one test fixture per outcome
      type (six total minimum), and a True Tie fallback test.

---

### **V. MEASURING SUCCESS**

- [ ] **Exhaustiveness:** TypeScript compiler confirms the outcome classifier is exhaustively typed
      with zero reachable default branches.
- [ ] **Determinism:** Ten consecutive resolutions with an identical seed and identical inputs
      produce byte-identical Argument Scores.
- [ ] **Outcome Coverage:** All six outcome types are demonstrably reachable, confirmed by six
      independent passing test fixtures.
- [ ] **Leverage Integrity:** Zero overdraft conditions possible, confirmed by an adversarial test
      attempting to spend more Strings than available.

---

### **VI. ROADMAP RELATIONSHIPS**

- **Parent Milestone:** **MS-02: THE MECHANICAL RESOLUTION GATE** — This Epic's classifier is the
  core subject of the Milestone's Binary Pass Condition (0.000% taxonomy misclassification across
  1,000+ duels).
- **Blocking Downstream:**
  - **EPIC-002 (THE RESIDUE MANDATE):** Cannot attach residue effects to outcomes that aren't yet
    reliably classified.
  - **EPIC-003 (WITHDRAWAL MECHANICS):** Depends on this Epic's Withdrawal classification being
    correctly reachable.
- **Waiting On Upstream:**
  - **MS-01, all four Epics:** `worker-sower`'s ledger authority and boot sequence must be
    operational before resolution logic can run.

---

### **VII. EPIC DETAILS**

| Attribute          | Value                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Priority**       | 🔴 Critical                                                                         |
| **Status**         | ⚪ PENDING _(per MS-02 Section III source status)_                                  |
| **Lead Developer** | Backend Lead                                                                        |
| **Assigned Team**  | Server Sextet Pillar                                                                |
| **Estimate**       | 21 Story Points _(FEAT-01: 8 · FEAT-02: 5 · FEAT-03: 5 · FEAT-04: 3)_               |
| **Target Release** | v0.2.0 — Mechanical Resolution Alpha                                                |
| **Start Date**     | Sprint 3, Day 1 _(immediately following MS-01 gate approval)_                       |
| **Due Date**       | Sprint 5, Final Day _(Hard Stop)_                                                   |
| **Tags**           | `Server`, `worker-sower`, `Resolution`, `PRNG`, `Taxonomy`, `Mechanical-Resolution` |
| **Progress**       | 0% _(0 of 4 features closed)_                                                       |

---

> **⚠️ ENFORCEMENT NOTICE:** This Epic document constitutes a binding scope contract. Features not
> listed in the Closed Ledger (Section II) are unfunded and must not be built. Duel resolution
> **must** classify through all six outcome types with no binary win/lose shortcuts. `Math.random()`
> is banned without exception. Violations are architectural regressions subject to immediate
> rollback.
