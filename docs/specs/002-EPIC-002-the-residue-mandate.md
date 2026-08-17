# 🧊 EPIC: [EPIC-002] THE RESIDUE MANDATE

---

### **I. OVERVIEW**

**Business Goal** A domestic melodrama where every argument resolves cleanly back to baseline is not
a melodrama — it's a reset button. This Epic exists because **institutional memory is the entire
emotional engine of this project**: family conflict compounds, and a simulation that allows any
release mechanic to fully erase the emotional residue of what preceded it produces flat, repetitive,
unearned drama instead of the accumulating psychological weight the Sovereign Objective demands.

**Technical Outcome** Upon closure of this Epic, every implemented release mechanic — Near Miss and
Relational Catharsis — is proven, via automated regression test, to leave a non-zero, persistent
trace on the relationship ledger. No tension-release code path can return any relationship matrix
entry to its pre-conflict baseline state.

**Scope Definition**

- **IN-SCOPE:**
  - Near Miss mechanics (`false_relief` flag, `next_climb_start_offset` hidden acceleration).
  - Relational Catharsis mechanics (`scar_tissue` modifier on resentment zero-out).
  - The Residue Mandate regression test suite, covering every release mechanic.

- **OUT-OF-SCOPE:**
  - The core outcome classification itself — that is EPIC-001's concern; this Epic attaches residue
    to already-classified outcomes.
  - Paranoia Clock tick mechanics beyond their role as a Near Miss trigger — full Clock behavior is
    documented in the Initiative's world registries and assumed as an input here, not built by this
    Epic.

---

### **II. THE FEATURE REGISTRY (Scope Execution)**

**The Closed Ledger** _If a Feature is not listed below, it is unfunded. It does not exist. Do not
build it._

- [ ] **[FEAT-01] THE NEAR MISS MECHANIC:** Implement the Near Miss release path — triggered when a
      Paranoia Clock fills but its consequence is narrowly avoided — setting a `false_relief` flag
      on the relevant ledger entry and a hidden `next_climb_start_offset` value guaranteeing the
      next crisis climb begins from a higher baseline, not zero. | **Owner:** Lead Architect

- [ ] **[FEAT-02] THE RELATIONAL CATHARSIS MECHANIC:** Implement the Relational Catharsis release
      path — an explosive resentment zero-out — that simultaneously writes a persistent
      `scar_tissue` modifier onto the relationship matrix entry, guaranteeing the relationship's
      baseline is permanently altered even as acute resentment clears. | **Owner:** Lead Architect

- [ ] **[FEAT-03] THE RESIDUE REGRESSION SUITE:** Implement an automated test suite that runs every
      implemented release mechanic against a known starting ledger state and asserts the
      post-release state is never byte-identical to a "fully reset" baseline — this is the
      enforcement mechanism proving `002-POL-02` is actually upheld, not just documented policy. |
      **Owner:** Backend Lead

---

### **III. TECHNICAL REQUIREMENTS & RISKS**

**Required Documentation**

- [ ] **Residue Mandate Specification:** Formal definition of "residue" for each release mechanic
      type, with the exact ledger fields each must touch. Filed in `docs/design/residue-mandate.md`.
- [ ] **Near Miss / Relational Catharsis Trigger Conditions:** The precise conditions under which
      each release mechanic activates. Filed in `docs/design/release-mechanics.md`.

**Technical Risks**

- **Policy Drift — The Convenient Reset:** Under development-velocity pressure, it is tempting to
  implement a "simple" release mechanic that resets a value to zero for debugging convenience,
  intending to add residue "later." This Epic's Definition of Done must treat any residue-free
  release path as a hard blocker, not a follow-up ticket — per the governing Initiative, the Residue
  Mandate is structural law, not a nice-to-have.
- **Testability — Residue as a Negative Assertion:** Proving "this value is never fully reset" is a
  negative-space test, which is inherently harder to write comprehensively than a positive
  assertion. FEAT-03 must enumerate every ledger field a release mechanic touches and assert
  non-baseline state for each individually, not just check a single summary flag.
- **Narrative Risk — Residue Without Bound:** If residue accumulates without any decay or narrative
  resolution mechanism, relationships could mathematically trend toward permanent maximum resentment
  over a long enough season, which may not be the intended narrative shape. This Epic should flag
  (not necessarily solve) whether a long-term residue-decay policy is needed as a follow-on Epic.

---

### **IV. REQUIRED ARTIFACTS & DELIVERABLES**

**Design & Architecture Assets**

- [ ] **Release Mechanic Ledger-Field Map:** Table listing every relationship-matrix field each
      release mechanic type writes to.

**Engineering & Build Assets**

- [ ] **Code — Near Miss Handler:** `false_relief` and `next_climb_start_offset` implementation.
- [ ] **Code — Relational Catharsis Handler:** `scar_tissue` modifier implementation.
- [ ] **Test Suite — Residue Regression:** Per-mechanic, per-field non-baseline assertions.

---

### **V. MEASURING SUCCESS**

- [ ] **Residue Coverage:** 100% of implemented release mechanics have a passing non-baseline
      regression test.
- [ ] **Near Miss Correctness:** A simulated Near Miss demonstrably shortens the time-to-next-crisis
      compared to an identical scenario without the `next_climb_start_offset` applied.
- [ ] **Catharsis Correctness:** A simulated Relational Catharsis zeroes acute resentment while
      leaving `scar_tissue` non-null, confirmed by direct ledger inspection.

---

### **VI. ROADMAP RELATIONSHIPS**

- **Parent Milestone:** **MS-02: THE MECHANICAL RESOLUTION GATE** — This Epic's residue guarantees
  are a named Binary Pass Condition component (100% Residue Mandate compliance).
- **Blocking Downstream:**
  - Any future long-term season-pacing Epic depends on residue accumulation behaving predictably.
- **Waiting On Upstream:**
  - **EPIC-001 (THE SIX-TYPE RESOLVER):** Outcomes must be classified before residue can attach to
    them.

---

### **VII. EPIC DETAILS**

| Attribute          | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **Priority**       | 🔴 Critical                                                            |
| **Status**         | ⚪ PENDING _(per MS-02 Section III source status)_                     |
| **Lead Developer** | Lead Architect                                                         |
| **Assigned Team**  | Server Sextet Pillar                                                   |
| **Estimate**       | 13 Story Points _(FEAT-01: 5 · FEAT-02: 5 · FEAT-03: 3)_               |
| **Target Release** | v0.2.0 — Mechanical Resolution Alpha                                   |
| **Start Date**     | Sprint 3, Day 3 _(following EPIC-001's classifier availability)_       |
| **Due Date**       | Sprint 5, Final Day _(Hard Stop)_                                      |
| **Tags**           | `Server`, `worker-sower`, `Residue`, `Ledger`, `Mechanical-Resolution` |
| **Progress**       | 0% _(0 of 3 features closed)_                                          |

---

> **⚠️ ENFORCEMENT NOTICE:** This Epic document constitutes a binding scope contract. Features not
> listed in the Closed Ledger (Section II) are unfunded and must not be built. No release mechanic
> may return any relationship ledger entry to a pure baseline state. Violations are architectural
> regressions subject to immediate rollback.
