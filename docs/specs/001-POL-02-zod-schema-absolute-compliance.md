# 📜 POLICY: [POL-02] ZOD SCHEMA ABSOLUTE COMPLIANCE

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy establishes the uncompromising authority of Zod schema validation
across the entire `goblin-lore` compilation pipeline. Every single hand-authored Markdown file
representing a character, location, possession, or grievance must strictly conform to a predefined
Zod schema before it is permitted into the compiled `bible-state.json`. There are no "warnings,"
"fallbacks," or "default fills" for missing required data. Validation is binary: perfect compliance
or total failure.

**Primary Success Metric** **0% malformed data transmission.** The `compile.ts` script must
guarantee that 100% of generated `bible-state.json` artifacts perfectly mirror their TypeScript
interface declarations without any `any` or `unknown` escape hatches.

**Competitive Advantage** By shifting data validation entirely to the compile-time step (prior to
engine consumption), the `worker-sower-engine` can operate under the assumption of perfect data
integrity. This eliminates the need for defensive programming, null-checks, and error-handling
boilerplate within the core simulation loop, drastically improving execution speed and reducing
cognitive load on engine developers.

**Termination Criteria (Kill Switch)** This policy is suspended and a post-mortem is required if:

1. **Schema Evasion:** A runtime error occurs in `worker-sower-engine` due to a missing or malformed
   property in `bible-state.json` that the Zod schema failed to catch.
2. **Type Disconnect:** The inferred TypeScript interfaces (`z.infer<typeof Schema>`) drift from
   their actual usage in the engine due to manual type assertions.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — Zero `any` Usage:** The use of `any` or `unknown` is strictly banned in all Zod
  schemas defining the corpus structure.
- **Standard 2 — Exhaustive Field Validation:** Every field extracted from YAML frontmatter must
  have explicit length, format, and type validation (e.g., UUID formats, positive integer
  constraints).
- **Standard 3 — Hard Fail on Exception:** The compiler must immediately halt and exit with a
  non-zero code upon the first Zod validation error, displaying the exact file, field, and
  constraint violated.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Auto-Correction Hooks:** Logic that attempts to "guess" or "fix" invalid author input (e.g.,
   clamping a score of 105 down to 100 instead of rejecting it).
2. **Partial Compilation:** Allowing the compiler to output a "partial" state containing only the
   files that passed validation.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain                | SLA                                             | Enforcement                 |
| --------------------- | ----------------------------------------------- | --------------------------- |
| **Compilation Speed** | Validation of 1,000 Markdown files ≤ 2 seconds. | Local execution monitoring. |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-003:** Zod Schema Registry Documentation.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                             | Relationship              | Status     |
| ------------------------------------- | ------------------------- | ---------- |
| **MS-01:** THE CORPUS FOUNDATION GATE | Direct governance target. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — Rejection Accuracy:** The compiler successfully catches and rejects 100% of injected
      malformed test fixtures during CI.
- [ ] **KPI 2 — Build Strictness:** The TypeScript compiler (`tsc`) is configured to `strict: true`
      across all packages involving Zod schemas.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Priority**              | 🔴 Critical                                                                                                    |
| **Market Value**          | Absolute data integrity allows the simulation engine to run at maximum performance without defensive overhead. |
| **Status**                | ⚪ Draft                                                                                                       |
| **Policy Owner**          | Backend Lead                                                                                                   |
| **Enforcement Mechanism** | `compile.ts` hard-fail execution in CI.                                                                        |
| **Review Cadence**        | Annually.                                                                                                      |
| **Version**               | 1.0.0                                                                                                          |
| **Effective Date**        | Upon MS-01 gate approval.                                                                                      |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. The Zod schemas are the absolute law of the corpus. Malformed data must not survive
> compilation. Violations are regressions. Regressions are reverted.
