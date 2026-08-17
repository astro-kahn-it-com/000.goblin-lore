# 📜 POLICY: [POL-01] SIX-TYPE RESOLUTION MANDATE

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy governs the **Closed Set Doctrine** for narrative conflict
resolution. It dictates that every scene, interaction, or conflict drafted by the LLM must
mathematically resolve into exactly one of six predefined outcomes: Concession, Compromise,
Escalation, Evasion, Annihilation, or Subjugation. No custom, nuanced, or "in-between" resolutions
are permitted to enter the ledger.

**Primary Success Metric** **100% strict enum mapping.** The extraction layer must successfully map
the LLM's generated scene resolution to one of the six valid Zod enum values in every cycle,
discarding or flagging any hallucinated or undefined resolution types.

**Competitive Advantage** By forcing the boundless creativity of the LLM through a rigid six-lane
bottleneck, the system ensures that narrative consequences are mathematically trackable. It prevents
the simulation from drifting into an unquantifiable state where characters "kind of" make up,
ensuring that every interaction results in a definitive, calculable shift in relational equity or
tension.

**Termination Criteria (Kill Switch)** This policy is suspended if:

1. **Extraction Failure Cascade:** The LLM repeatedly (3+ consecutive cycles) generates narrative
   resolutions that the parser cannot reasonably map to the six types, indicating a fundamental
   prompt failure.
2. **Missing Matrix Shift:** A resolution type is extracted but fails to apply its designated
   equity/tension mathematical shift to the ledger.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — Enum Exclusivity:** The Zod schema for `resolution_type` must be an exact string
  enum of the six types. No `.catchall()` or `.or(z.string())` is permitted.
- **Standard 2 — Matrix Application:** The engine must possess a hardcoded Shift Matrix that
  dictates exactly how many points of equity and tension are added or subtracted for each of the six
  types.
- **Standard 3 — Prompt Injection:** The LLM prompt must explicitly list the six valid resolution
  types and instruct the model to declare which one it used in the output JSON block.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Dynamic Resolution Types:** Allowing the LLM to invent new resolution types like "Partial
   Truce" or "Mutual Destruction."
2. **Variable Point Shifts:** Allowing the LLM to decide _how much_ equity is lost. The LLM chooses
   the _type_ of resolution; the engine calculates the _math_.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain               | SLA                                    | Enforcement                       |
| -------------------- | -------------------------------------- | --------------------------------- |
| **Mapping Accuracy** | 0% unmapped resolutions in production. | Strict Zod parsing on extraction. |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-006:** The Shift Matrix Truth Table.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                                 | Relationship               | Status     |
| ----------------------------------------- | -------------------------- | ---------- |
| **MS-02:** THE MECHANICAL RESOLUTION GATE | Primary governance target. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — State Transition Completeness:** Unit tests verify that every one of the six
      resolution types successfully applies its defined ledger shift without throwing.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Priority**              | 🔴 Critical                                                                                                                 |
| **Market Value**          | Strict typification of conflict outcomes is what makes the generated narrative deterministic rather than purely generative. |
| **Status**                | ⚪ Draft                                                                                                                    |
| **Policy Owner**          | Lead Game Designer                                                                                                          |
| **Enforcement Mechanism** | `worker-sower-engine` parsing logic.                                                                                        |
| **Review Cadence**        | Annually.                                                                                                                   |
| **Version**               | 1.0.0                                                                                                                       |
| **Effective Date**        | Upon MS-02 gate approval.                                                                                                   |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. The six types are absolute. Nuance belongs in the text, not the math. Violations are
> regressions. Regressions are reverted.
