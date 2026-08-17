# 📜 POLICY: [POL-04] RELATIONAL POINTER INTEGRITY

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy governs the **Absolute Integrity of Relationships**. In the
`goblin-lore` graph, characters interact with locations, possessions, and each other via UUID
pointers (e.g., `target_id: "char_123"`). This policy dictates that no pointer may ever reference a
non-existent entity, and no entity may be deleted if it is actively referenced in a relational
grievance. The engine must operate with the strictness of a relational database foreign-key
constraint.

**Primary Success Metric** **Zero orphaned pointers.** The two-pass compiler (`compile.ts`) must
successfully validate 100% of relationship IDs against the actual corpus files before generating the
final `bible-state.json`.

**Competitive Advantage** Generative narratives frequently suffer from "hallucinated continuity"
where a character interacts with an item they don't own, or refers to a location that hasn't been
established. By enforcing strict relational integrity at the compiler level, the engine physically
prevents the LLM from executing a state transition involving an invalid or non-existent entity.

**Termination Criteria (Kill Switch)** This policy is suspended and the graph is locked if:

1. **Dangling Pointer Crash:** The `worker-sower-engine` attempts to look up a character or location
   by ID during the resolution phase and receives `undefined`.
2. **Circular Target Lock:** Character A targets Character B, who targets Character C, who targets
   Character A, creating a resolution deadlock that the engine cannot mathematically untangle.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — Two-Pass Compilation:** The compiler must first parse all files to build an index
  of valid IDs (Pass 1), and then re-evaluate all relationships against that index (Pass 2) to catch
  invalid pointers.
- **Standard 2 — Extraction Validation:** When `goblin-extract` receives a drafted scene from the
  LLM, it must verify that all participating `character_ids` and the `location_id` exist in the
  current pre-draft ledger snapshot.
- **Standard 3 — Cascading Deletion Bans:** A character markdown file cannot be deleted from the
  corpus if they are currently the target of another character's unresolved grievance.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Lazy Loading:** Assuming a character ID is valid and attempting to fetch it only when needed.
   The graph must be pre-validated entirely.
2. **Ghost Entities:** Allowing the LLM to invent a background character ("Guard #3") and assigning
   relational tension to them without a backing markdown file.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain                  | SLA                                                             | Enforcement                 |
| ----------------------- | --------------------------------------------------------------- | --------------------------- |
| **Pass 2 Verification** | ≤ 1 second to verify all pointers across a 1,000-entity corpus. | Local execution monitoring. |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-013:** Relational Schema Mapping Document.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                                             | Relationship               | Status     |
| ----------------------------------------------------- | -------------------------- | ---------- |
| **MS-03:** THE DETERMINISM & EXTRACTION FIDELITY GATE | Primary governance target. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — Compiler Rejection:** The CI pipeline runs `compile.ts` on a known-bad corpus with
      an invalid `target_id` and verifies that it throws a specific `POINTER_NOT_FOUND` error.
- [ ] **KPI 2 — Deadlock Detection:** The compiler correctly identifies and rejects circular
      relational dependencies that lack a primary instigator.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Priority**              | 🔴 Critical                                                                                                                        |
| **Market Value**          | Prevents hallucinated actors from polluting the mechanical simulation, ensuring all narrative weight is attached to actual assets. |
| **Status**                | ⚪ Draft                                                                                                                           |
| **Policy Owner**          | Backend Lead                                                                                                                       |
| **Enforcement Mechanism** | `compile.ts` Pass 2 logic.                                                                                                         |
| **Review Cadence**        | Annually.                                                                                                                          |
| **Version**               | 1.0.0                                                                                                                              |
| **Effective Date**        | Upon MS-03 gate approval.                                                                                                          |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. Every pointer must land. An entity without a file does not exist. Violations are
> regressions. Regressions are reverted.
