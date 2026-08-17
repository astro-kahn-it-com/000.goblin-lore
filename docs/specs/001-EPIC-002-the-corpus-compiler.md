# 🧊 EPIC: [EPIC-002] THE CORPUS COMPILER

---

### **I. OVERVIEW**

**Business Goal** The entire simulation's psychological premise depends on one unglamorous
guarantee: the hand-authored Markdown corpus must compile into a relationally sound, schema-valid
JSON state, every time, with zero tolerance for a broken pointer or malformed frontmatter. This Epic
exists because **the corpus is the law, and law that silently permits contradictions is not law**.
If a possession can claim ownership by a character that doesn't exist, or a grievance can reference
a retired file without the compiler noticing, every downstream psychological calculation — every
duel, every Individuation Multiplier, every scene selection — inherits that corruption invisibly.

**Technical Outcome** Upon closure of this Epic, `goblin-bible/compile.ts` performs a strict
two-pass validation (Zod shape validation, then relational integrity checking) against the full
four-character, 40+ grievance corpus, producing `goblin-bible/compiled/bible-state.json`
deterministically. The compiler hard-fails — refuses to produce output — on any schema violation or
broken relational pointer. The Hybrid Outline extraction pipeline (`extract()`/`generate()`),
already built and tested in this project's Hybrid Authoring exploration, is confirmed compatible
with this compiled schema.

**Scope Definition**

- **IN-SCOPE:**
  - `compile.ts` Pass 1 (Zod shape validation via `gray-matter`) and Pass 2 (relational integrity
    checking).
  - The full character, grievance, location, and possession Zod schema registry.
  - Integration validation of `goblin-extract`'s `extract()`/`generate()`/`schema.ts` against the
    compiler's expected output shape.
  - The `_retired/` directory exclusion logic for the Stage 3 selection lottery pool.

- **OUT-OF-SCOPE:**
  - `worker-sower`'s actual consumption of the compiled state (that is EPIC-004's concern).
  - The Terminal OS UI for triggering a draft cycle (that is a Hybrid Authoring Gate concern,
    MS-05).
  - Any duel-resolution mathematics — this Epic only concerns the corpus's static validity, not its
    runtime behavior.

---

### **II. THE FEATURE REGISTRY (Scope Execution)**

**The Closed Ledger** _If a Feature is not listed below, it is unfunded. It does not exist. Do not
build it._

- [ ] **[FEAT-01] THE TWO-PASS COMPILER:** Implement `compile.ts`'s Pass 1 (strip YAML frontmatter
      via `gray-matter`, validate against strict per-file-type Zod schemas — character, grievance,
      location, possession — with zero tolerance for type mismatches) and Pass 2 (verify every
      relational pointer — `owner`, `participants`, `location`, `linked_grievances`,
      `linked_possessions` — resolves to an existing, non-retired file). A schema violation in Pass
      1 or a broken pointer in Pass 2 both produce a hard fail with a specific, actionable error
      identifying the offending file and field. | **Owner:** Lead Architect

- [ ] **[FEAT-02] THE COMPILED STATE ARTIFACT:** Implement the deterministic serialization of all
      validated corpus files into a single `goblin-bible/compiled/bible-state.json`, structured for
      efficient consumption by `worker-sower` (indexed by character ID, grievance ID, location ID)
      rather than as a flat file dump. Two compiler runs against an unchanged corpus must produce
      byte-identical output. | **Owner:** Lead Architect

- [ ] **[FEAT-03] THE EXTRACTION SCHEMA BRIDGE:** Validate that `goblin-extract`'s
      `SceneFrontmatterSchema` (built and tested during the Hybrid Authoring exploration) produces
      frontmatter objects that `compile.ts` can ingest without modification. Confirm the
      previously-identified and fixed drift-detection bug (`DRIFT_THRESHOLDS[key] ?? Infinity` →
      `?? 1`) remains corrected and covered by a permanent regression test within this Epic's test
      suite. | **Owner:** Backend Lead

- [ ] **[FEAT-04] THE RETIREMENT PROTOCOL ENFORCEMENT:** Implement the `_retired/` directory
      handling such that `compile.ts` correctly excludes retired files from the active Stage 3
      selection lottery pool while still validating that no _active_ file references a retired one
      without an explicit, logged exception. | **Owner:** Backend Lead

---

### **III. TECHNICAL REQUIREMENTS & RISKS**

**Required Documentation**

- [ ] **Compiler Two-Pass Specification:** Detailed description of Pass 1 and Pass 2 logic,
      including the exact Zod schemas for each corpus file type. Filed in
      `docs/architecture/compiler-spec.md`.
- [ ] **Compiled State Schema Reference:** The structure of `bible-state.json`, documented
      field-by-field for downstream consumers. Filed in `docs/architecture/bible-state-schema.md`.
- [ ] **Retirement Protocol Runbook:** Rules for moving a file to `_retired/`, including the
      required one-line frontmatter explanation. Filed in
      `docs/architecture/retirement-protocol.md`.

**Technical Risks**

- **Data Integrity — The Silent Pass Risk:** A relational integrity checker that only checks _some_
  pointer types (e.g., validates `owner` but not `linked_grievances`) creates a false sense of
  safety. This Epic's Pass 2 must be exhaustively enumerated against every relational field defined
  in every schema — an incomplete pointer-type inventory is the single highest risk to this Epic's
  core guarantee.
- **Performance — Corpus Growth:** At 40+ grievance files today, a full two-pass compile is cheap.
  As the corpus grows across future seasons, Pass 2's relational check (potentially O(n²) if
  implemented naively as nested lookups) risks becoming a bottleneck. This Epic should implement
  Pass 2 using an indexed lookup structure, not repeated linear scans, even though the current
  corpus size doesn't yet demand it.
- **Determinism — Object Key Ordering:** JavaScript object serialization order is not guaranteed to
  be stable across all environments without explicit sorting. FEAT-02's "byte-identical output"
  guarantee requires deliberately sorted key ordering in the JSON serialization step, not reliance
  on incidental V8 behavior.

---

### **IV. REQUIRED ARTIFACTS & DELIVERABLES**

**Design & Architecture Assets**

- [ ] **Two-Pass Compilation Flowchart:** Visual diagram of Pass 1 → Pass 2 → serialization,
      including every hard-fail branch.
- [ ] **Relational Pointer Inventory:** Exhaustive table of every relational field across every
      schema type, used as the Pass 2 checklist.

**Engineering & Build Assets**

- [ ] **Code — `compile.ts`:** The full two-pass compiler implementation.
- [ ] **Code — Zod Schema Registry:** Character, grievance, location, and possession schemas.
- [ ] **Code — Extraction Bridge Regression Test:** Permanent test covering the `peak_level` 9→10
      drift-detection regression case.
- [ ] **Test Suite:** Compiler test suite including at least one deliberate broken-pointer fixture
      per relational field type, confirming each produces the expected hard fail.

---

### **V. MEASURING SUCCESS**

- [ ] **Schema Compliance:** 100% of the corpus passes Pass 1 validation with zero `ZodError`
      exceptions on a known-good corpus state.
- [ ] **Relational Integrity:** Pass 2 correctly hard-fails on 100% of deliberately introduced
      broken-pointer test fixtures, across every relational field type.
- [ ] **Determinism:** Ten consecutive compiler runs against an unchanged corpus produce
      SHA-256-identical `bible-state.json` output.
- [ ] **Extraction Compatibility:** `goblin-extract`'s test suite (including the corrected
      drift-detection regression test) passes 100% against the compiler's expected schema shape.

---

### **VI. ROADMAP RELATIONSHIPS**

- **Parent Milestone:** **MS-01: THE CORPUS FOUNDATION GATE** — This Epic's Artifact 002 (the
  compiled corpus) is directly referenced in the Milestone's Audit Protocol.
- **Blocking Downstream:**
  - **EPIC-004 (THE WORKER-SOWER CORTEX):** Cannot boot without a valid compiled corpus.
  - **MS-02 through MS-06:** Every subsequent Milestone assumes a trustworthy compiled state as its
    starting condition.
- **Waiting On Upstream:**
  - **EPIC-001 (SOVEREIGN FOUNDATIONS):** The tiered compile order this Epic depends on must be
    validated first.

---

### **VII. EPIC DETAILS**

| Attribute          | Value                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Priority**       | 🔴 Critical                                                                         |
| **Status**         | ⚪ PENDING _(per MS-01 Section III source status)_                                  |
| **Lead Developer** | Lead Architect                                                                      |
| **Assigned Team**  | Packages Sextet Pillar                                                              |
| **Estimate**       | 21 Story Points _(FEAT-01: 8 · FEAT-02: 5 · FEAT-03: 5 · FEAT-04: 3)_               |
| **Target Release** | v0.1.0 — Foundation Alpha                                                           |
| **Start Date**     | Sprint 1, Day 3 _(following EPIC-001's compile-order validation)_                   |
| **Due Date**       | Sprint 2, Final Day _(Hard Stop)_                                                   |
| **Tags**           | `Packages`, `Compiler`, `Zod`, `goblin-bible`, `Relational-Integrity`, `Foundation` |
| **Progress**       | 0% _(0 of 4 features closed)_                                                       |

---

> **⚠️ ENFORCEMENT NOTICE:** This Epic document constitutes a binding scope contract. Features not
> listed in the Closed Ledger (Section II) are unfunded and must not be built. `compile.ts` is the
> **sole** authority for validating corpus integrity. No component may bypass the compiler and
> hand-construct a `bible-state.json`. Violations are architectural regressions subject to immediate
> rollback.
