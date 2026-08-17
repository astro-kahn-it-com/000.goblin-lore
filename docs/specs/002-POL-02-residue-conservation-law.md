# 📜 POLICY: [POL-02] RESIDUE CONSERVATION LAW

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy governs the **Conservation of Narrative Tension**. It dictates that
unresolved conflict ("Residue") must not spontaneously disappear from the simulation. If a conflict
results in an Evasion or a Compromise, the underlying tension must be mathematically accrued to the
characters' or locations' `residue_score`. This score must dictate future lottery weights, ensuring
that deferred conflict inevitably boils over into confrontation.

**Primary Success Metric** **0 lost tension points.** Every non-resolving scene must result in a
mathematically verifiable increase in systemic residue, and that residue must persist across cycles
until it is spent via an Explosive resolution or natural decay function.

**Competitive Advantage** This law prevents the "amnesia" common in generative storytelling, where
characters forget grudges because the context window rolled over. By tracking unresolved tension
mathematically on the ledger, the engine forces the LLM to acknowledge historical grudges, creating
long-arc, systemic melodrama.

**Termination Criteria (Kill Switch)** This policy is suspended if:

1. **Residue Leak:** Residue scores reset to zero between cycles without an accompanying
   Annihilation or Subjugation event.
2. **Runaway Accrual:** Residue accrual loops cause all characters to hit the maximum `100` score
   simultaneously, breaking the variance of the lottery weighting.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — Mandatory Accrual:** Evasion and Compromise resolutions must trigger a positive
  increase in `residue_score`.
- **Standard 2 — Weighted Pressure:** The `residue_score` must act as a direct multiplier during the
  Stage 3 Grievance Lottery. High residue characters must be statistically forced into scenes.
- **Standard 3 — Structured Decay:** Residue can only decrease via explicit system mechanics (e.g.,
  a massive fight that clears the air) or a slow, mathematically defined cycle-over-cycle decay.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Manual Residue Clearing:** Allowing human operators to manually reset a character's residue to
   zero because "they made up off-screen." If it's not in the ledger, it didn't happen.
2. **Infinite Scaling:** Allowing residue to scale infinitely past `100`, which would eventually
   cause floating-point instability in the lottery weights.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain                      | SLA                                    | Enforcement                   |
| --------------------------- | -------------------------------------- | ----------------------------- |
| **Accrual Logic Execution** | O(1) mathematical shift per character. | Code review logic constraint. |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-007:** Residue Accrual and Decay Rate Formulas.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                                 | Relationship               | Status     |
| ----------------------------------------- | -------------------------- | ---------- |
| **MS-02:** THE MECHANICAL RESOLUTION GATE | Primary governance target. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — Accrual Test:** A simulation test consisting of 5 consecutive Evasions correctly
      demonstrates a compounding `residue_score`.
- [ ] **KPI 2 — Boundary Enforcement:** Unit tests verify that `residue_score` clamps perfectly at
      `0` and `100` regardless of the mathematical inputs.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Priority**              | 🔴 Critical                                                                                             |
| **Market Value**          | Ensures long-term narrative memory, preventing characters from acting out of character in later cycles. |
| **Status**                | ⚪ Draft                                                                                                |
| **Policy Owner**          | Lead Game Designer                                                                                      |
| **Enforcement Mechanism** | `worker-sower-engine` state transition logic.                                                           |
| **Review Cadence**        | Annually.                                                                                               |
| **Version**               | 1.0.0                                                                                                   |
| **Effective Date**        | Upon MS-02 gate approval.                                                                               |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. Tension cannot be destroyed, only transformed. Violations are regressions. Regressions
> are reverted.
