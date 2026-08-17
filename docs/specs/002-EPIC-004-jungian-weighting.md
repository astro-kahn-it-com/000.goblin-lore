# 🧊 EPIC: [EPIC-004] JUNGIAN WEIGHTING

---

### **I. OVERVIEW**

**Business Goal** A scene-selection lottery that ignores which character is actively resisting their
imposed family role will drift toward arbitrary, psychologically flat scene choices — technically
functional, narratively hollow. This Epic exists because **individuation is the thematic spine of
the entire simulation**, and if the Individuation Multiplier remains the unwired skeleton left over
from MS-01's EPIC-004, the Jungian premise stated throughout this project's governing documents is
decorative language, not an operating mechanism.

**Technical Outcome** Upon closure of this Epic, the Stage 3 selection-lottery weighting calculation
correctly detects when a candidate grievance intersects a character's `relationship_type_defaults`
resistance (e.g., Spleen's `caretaker_resented` dynamic with Bog), applies the documented
Individuation Multiplier to that grievance's Scene Weight, and logs the full weighting computation —
not just the final selected scene — so the multiplier's effect is independently auditable by the
Dependency Graph Visualizer or a human reviewer.

**Scope Definition**

- **IN-SCOPE:**
  - The Individuation Multiplier detection logic (grievance-to-resisted-role intersection).
  - Full wiring of the multiplier into the Stage 3 Scene Weight formula.
  - Weighting-computation transparency logging.

- **OUT-OF-SCOPE:**
  - The base Scene Weight formula itself (raw pull, cooldown, unspent Strings) — that was
    established as part of MS-01's EPIC-004 skeleton; this Epic only adds the multiplier term.
  - Ensemble balance auditing tooling (the Dependency Graph Visualizer) — that is a separate,
    unscoped tooling Epic referenced but not built here.

---

### **II. THE FEATURE REGISTRY (Scope Execution)**

**The Closed Ledger** _If a Feature is not listed below, it is unfunded. It does not exist. Do not
build it._

- [ ] **[FEAT-01] THE ROLE-RESISTANCE DETECTOR:** Implement the logic comparing a candidate
      grievance's participants and category against each involved character's
      `relationship_type_defaults` (`given` vs. `received` role framing), correctly identifying when
      a character is actively cast against a role they resist (e.g., Spleen `received: caretaker`
      from Bog, where Spleen's individuation arc pushes against being cared for). | **Owner:** Lead
      Architect

- [ ] **[FEAT-02] THE MULTIPLIER APPLICATION:** Wire the detected role-resistance signal into the
      Stage 3 Scene Weight formula as a multiplicative term, replacing MS-01's unwired skeleton hook
      with a live, tested calculation. | **Owner:** Lead Architect

- [ ] **[FEAT-03] THE WEIGHTING TRANSPARENCY LOG:** Implement structured logging of the full weight
      computation — base pull, cooldown adjustment, unspent Strings, and the applied Individuation
      Multiplier value — for every candidate grievance considered in a selection cycle, not just the
      winning selection. | **Owner:** Backend Lead

---

### **III. TECHNICAL REQUIREMENTS & RISKS**

**Required Documentation**

- [ ] **Jungian Individuation Model Specification:** The full theoretical-to-mechanical mapping from
      individuation psychology to the multiplier formula. Filed in `docs/design/jungian-model.md`
      (referenced as `DOC-INIT-008` in the governing Initiative).
- [ ] **Role-Resistance Detection Rules:** Precise definition of what constitutes "resistance" to a
      `relationship_type_defaults` role, with worked examples per character. Filed alongside the
      Jungian model spec.

**Technical Risks**

- **Design Ambiguity — Defining "Resistance" Precisely:** Individuation is a psychological concept,
  not an inherently computable one. Without a precise, testable definition of what counts as a
  character "resisting" an assigned role, FEAT-01 risks becoming subjective or inconsistent across
  characters. This Epic must produce a concrete, falsifiable rule set before implementation, not an
  implementation that improvises the definition ad hoc.
- **Ensemble Imbalance — The Multiplier Feedback Loop:** If one character's individuation conflicts
  are consistently weighted higher, that character could dominate scene selection at the expense of
  the ensemble, creating exactly the imbalance the Dependency Graph Visualizer (referenced but
  out-of-scope here) exists to catch. This Epic should include at minimum a manual sanity check
  across a 100-cycle sample, even without the full visualizer tool.
- **Transparency Overhead — Log Volume:** Logging the full weighting computation for every
  candidate, every cycle, at scale could produce significant log volume. FEAT-03 should confirm log
  output remains within reasonable bounds for a typical cycle's candidate pool size (the corpus
  minimum of 40+ grievances) before this Epic is considered closed.

---

### **IV. REQUIRED ARTIFACTS & DELIVERABLES**

**Design & Architecture Assets**

- [ ] **Role-Resistance Truth Table:** Per-character, per-relationship matrix showing which
      `relationship_type_defaults` combinations trigger the multiplier.

**Engineering & Build Assets**

- [ ] **Code — Role-Resistance Detector:** The intersection-detection logic.
- [ ] **Code — Multiplier-Wired Weighting Function:** The updated Stage 3 formula.
- [ ] **Code — Weighting Transparency Logger:** Structured per-candidate log output.
- [ ] **Test Suite:** Role-resistance detection unit tests (one per documented character resistance
      pattern), multiplier application tests, and a log-output format validation test.

---

### **V. MEASURING SUCCESS**

- [ ] **Detection Accuracy:** The role-resistance detector correctly identifies 100% of documented
      resistance patterns across all four characters' `relationship_type_defaults`.
- [ ] **Weighting Verification:** A grievance with an active individuation conflict demonstrably
      produces a higher Scene Weight than an otherwise-identical grievance without one, confirmed by
      direct comparison.
- [ ] **Transparency Completeness:** 100% of candidate grievances in a selection cycle produce a
      logged weighting breakdown, not just the winning selection.
- [ ] **Ensemble Sanity:** Across a 100-cycle manual sample, no single character's grievances are
      selected more than 2x the ensemble average (the same threshold the Initiative's KPI-08
      defines).

---

### **VI. ROADMAP RELATIONSHIPS**

- **Parent Milestone:** **MS-02: THE MECHANICAL RESOLUTION GATE.**
- **Blocking Downstream:**
  - **MS-04 (THE STORYBOARD READINESS GATE):** The Individuation Multiplier's signal is what tells a
    future storyboard artist which character's micro-expressions must carry a scene's real meaning —
    this Epic's transparency log is a direct input to that later Milestone's board notes.
- **Waiting On Upstream:**
  - **EPIC-001 (THE SIX-TYPE RESOLVER):** The base resolution engine and Scene Weight skeleton (from
    MS-01) must exist before the multiplier can be wired in.

---

### **VII. EPIC DETAILS**

| Attribute          | Value                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **Priority**       | 🟡 High                                                                                            |
| **Status**         | ⚪ PENDING _(per MS-02 Section III source status)_                                                 |
| **Lead Developer** | Lead Architect                                                                                     |
| **Assigned Team**  | Server Sextet Pillar                                                                               |
| **Estimate**       | 13 Story Points _(FEAT-01: 5 · FEAT-02: 5 · FEAT-03: 3)_                                           |
| **Target Release** | v0.2.0 — Mechanical Resolution Alpha                                                               |
| **Start Date**     | Sprint 4, Day 1                                                                                    |
| **Due Date**       | Sprint 5, Final Day _(Hard Stop)_                                                                  |
| **Tags**           | `Server`, `worker-sower`, `Jungian`, `Selection-Lottery`, `Individuation`, `Mechanical-Resolution` |
| **Progress**       | 0% _(0 of 3 features closed)_                                                                      |

---

> **⚠️ ENFORCEMENT NOTICE:** This Epic document constitutes a binding scope contract. Features not
> listed in the Closed Ledger (Section II) are unfunded and must not be built. Scene-selection
> weighting must incorporate a live-computed Individuation Multiplier, never a hardcoded priority
> list standing in for it. Violations are architectural regressions subject to immediate rollback.
