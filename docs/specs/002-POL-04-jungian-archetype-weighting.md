# 📜 POLICY: [POL-04] JUNGIAN ARCHETYPE WEIGHTING

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy governs the application of the **Individuation Multiplier**. It
mandates that character interactions are not mathematically flat; instead, they are heavily filtered
through each character's assigned Jungian archetype (e.g., Shadow, Anima, Hero). This policy
enforces the Role-Resistance Truth Table, ensuring that certain archetypes mathematically resist
specific resolutions (e.g., the Shadow heavily resists Compromise), thereby driving
archetype-specific narrative friction.

**Primary Success Metric** **100% archetype filter compliance.** Every shift in relational equity or
global tension must pass through the Jungian multiplier function before being committed to the
ledger, and this multiplication must be explicitly logged.

**Competitive Advantage** Without archetype weighting, all characters behave exactly the same
mathematically. By introducing archetypal resistance, the simulation creates systemic personalities.
The LLM might try to force a Shadow character into a peaceful Compromise, but the math engine will
heavily suppress the equity gain from that action, ensuring the character remains structurally
antagonistic until a massive shift occurs.

**Termination Criteria (Kill Switch)** This policy is suspended if:

1. **Flat Math Breach:** The engine is found applying base ledger shifts without calling the
   `applyJungianWeight` function.
2. **Archetype Deletion:** The LLM manages to "delete" or hallucinate an unmapped archetype onto a
   character during extraction, breaking the multiplier lookup.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — The Resistance Matrix:** The system must implement a strict matrix mapping every
  archetype to its specific resistance/amplification multipliers for all six resolution types.
- **Standard 2 — Multiplier Logging:** The transparency logger must record both the raw base shift
  and the final archetype-modified shift for every transaction.
- **Standard 3 — Immutable Archetypes:** Character archetypes cannot be changed by the LLM during
  standard scene drafting. They are fundamental constants of the character's existence in the
  simulation.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Dynamic Archetype Shifting:** Allowing characters to spontaneously switch archetypes from
   "Shadow" to "Hero" mid-cycle. (True individuation is a manual, milestone-level event, not an
   automated LLM whim).
2. **Null Multipliers:** Failing to define a multiplier for a specific archetype/resolution pair.
   All pairs must have a defined float value.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain                 | SLA                                 | Enforcement                 |
| ---------------------- | ----------------------------------- | --------------------------- |
| **Weight Application** | ≤ 0.5ms per resolution calculation. | Unit test execution timing. |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-009:** Role-Resistance Truth Table.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                                 | Relationship               | Status     |
| ----------------------------------------- | -------------------------- | ---------- |
| **MS-02:** THE MECHANICAL RESOLUTION GATE | Primary governance target. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — Resistance Validation:** Unit tests confirm that an Anima archetype receiving an
      Annihilation resolution results in a mathematically penalized equity shift.
- [ ] **KPI 2 — Immutable Check:** The `extract()` pipeline correctly flags and rejects any LLM
      output attempting to alter the `archetype` string.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Priority**              | 🔴 Critical                                                                                            |
| **Market Value**          | Prevents generic "AI soup" by forcing characters to remain mechanically true to their narrative roles. |
| **Status**                | ⚪ Draft                                                                                               |
| **Policy Owner**          | Lead Game Designer                                                                                     |
| **Enforcement Mechanism** | Multiplier logic in `worker-sower-engine` and extraction drift guards.                                 |
| **Review Cadence**        | Annually.                                                                                              |
| **Version**               | 1.0.0                                                                                                  |
| **Effective Date**        | Upon MS-02 gate approval.                                                                              |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. Characters are bound by their archetypes. The math must reflect the soul. Violations are
> regressions. Regressions are reverted.
