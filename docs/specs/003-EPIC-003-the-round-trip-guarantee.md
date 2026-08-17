# 🧊 EPIC: [EPIC-003] THE ROUND-TRIP GUARANTEE

---

### **I. OVERVIEW**

**Business Goal** Drift detection (EPIC-002) proves the pipeline notices when something _changed_.
It does not, by itself, prove the pipeline correctly preserves everything the showrunner _didn't_
touch. This Epic exists because **a hybrid authoring system that quietly loses an untouched field on
every save is just as untrustworthy as one that silently ignores a real edit** — the showrunner
needs confidence that hand-editing dialogue in Beat 4 doesn't somehow corrupt the
`linked_grievances` array they never looked at.

**Technical Outcome** Upon closure of this Epic, a `generate()` → hand-edit → `extract()` round trip
is proven, via automated test, to leave every field the human did not touch byte-identical to its
pre-edit state. Explicit `[[grievance_id]]` tags inserted by a showrunner are correctly merged with
engine-seeded `linked_grievances` without duplication, and the `**Resolution Condition:**` line —
the one field this project deliberately keeps human-authored rather than inferred — round-trips
exactly as written, with zero paraphrasing, truncation, or whitespace mangling.

**Scope Definition**

- **IN-SCOPE:**
  - Field-preservation testing across the full `generate()` → edit → `extract()` cycle.
  - Relational tag merge-without-duplication logic (`[[tag]]` passthrough).
  - Resolution Condition exact-fidelity testing.

- **OUT-OF-SCOPE:**
  - The `generate()` template's initial content quality (that was substantially built and tested
    during the Hybrid Authoring exploration) — this Epic only concerns round-trip fidelity, not
    template authoring.
  - Multi-showrunner concurrent-edit conflict resolution — explicitly out of scope per the governing
    Initiative's "last-write-wins, single showrunner" assumption.

---

### **II. THE FEATURE REGISTRY (Scope Execution)**

**The Closed Ledger** _If a Feature is not listed below, it is unfunded. It does not exist. Do not
build it._

- [ ] **[FEAT-01] THE FIELD-PRESERVATION TEST SUITE:** Implement
      `goblin-extract/scripts/round-trip-test.ts`, generating a scene, applying a single scripted
      edit to one field, running `extract()`, and asserting every other field remains byte-identical
      to its pre-edit value across a matrix of scenarios (edit a beat's dialogue only, edit the
      Discomfort Curve only, edit the Setting only). | **Owner:** Backend Lead

- [ ] **[FEAT-02] THE RELATIONAL TAG MERGE LOGIC:** Confirm and test that explicit
      `[[grievance_id]]` tags a showrunner inserts are correctly unioned with engine-seeded
      `linked_grievances` (via `Array.from(new Set([...seeded, ...explicitTags]))`, as already
      implemented) with zero duplicate entries and zero loss of either source's contributions. |
      **Owner:** Backend Lead

- [ ] **[FEAT-03] THE RESOLUTION CONDITION FIDELITY TEST:** Implement a dedicated test confirming
      the `**Resolution Condition:**` line extraction (`RESOLUTION_CONDITION_LINE` regex) preserves
      the exact showrunner-authored text — including punctuation, capitalization, and any embedded
      markdown emphasis — with zero paraphrasing or truncation, across a range of realistic
      condition-statement lengths and phrasings. | **Owner:** Backend Lead

---

### **III. TECHNICAL REQUIREMENTS & RISKS**

**Required Documentation**

- [ ] **Round-Trip Test Scenario Catalog:** Enumerated list of every field-preservation scenario
      tested, with pass/fail status. Filed in `docs/testing/round-trip-catalog.md`.

**Technical Risks**

- **Silent Truncation — Long Resolution Conditions:** If a showrunner writes an unusually long or
  multi-sentence Resolution Condition, the current regex-based single-line extraction could silently
  truncate at an unexpected character or line boundary. FEAT-03 must specifically test boundary
  cases (very long conditions, conditions containing a colon or other regex-adjacent character)
  rather than only short, simple examples.
- **Merge Ambiguity — Tag Removal:** The current relational-tag merge logic (per the existing
  `extract.ts` implementation) is additive-only — it unions seeded and explicit tags but has no
  mechanism for a showrunner to _remove_ a seeded relational link they've determined is wrong. This
  Epic should explicitly flag this as a known limitation for showrunner documentation, rather than
  let it be discovered as a surprise during real use.
- **Whitespace Fragility — Markdown Table Parsing:** The Discomfort Curve table's `CURVE_TABLE_ROW`
  regex depends on consistent pipe-delimiter spacing. A showrunner reformatting the table (e.g., via
  an auto-formatter that changes column alignment) could break extraction in a way that's hard to
  distinguish from a genuine data change. FEAT-01's test matrix should include a whitespace-only
  table reformat as a specific non-drift scenario.

---

### **IV. REQUIRED ARTIFACTS & DELIVERABLES**

**Engineering & Build Assets**

- [ ] **Code — Round-Trip Test Suite:** `goblin-extract/scripts/round-trip-test.ts`.
- [ ] **Code — Relational Tag Merge Tests:** Dedicated union-without-duplication test cases.
- [ ] **Code — Resolution Condition Fidelity Tests:** Boundary-case tests for long/complex condition
      text.
- [ ] **Documentation — Known Limitations:** The tag-removal gap and any other discovered round-trip
      edge cases, documented for showrunner awareness.

---

### **V. MEASURING SUCCESS**

- [ ] **Field Preservation:** 100% of untouched fields remain byte-identical across every scenario
      in the round-trip test matrix.
- [ ] **Tag Merge Correctness:** Zero duplicate or lost relational tags across a range of
      seeded/explicit tag combination test cases.
- [ ] **Resolution Condition Fidelity:** 100% exact-match preservation of Resolution Condition text,
      including at least one deliberately long/complex boundary-case test.
- [ ] **Whitespace Resilience:** A whitespace-only Discomfort Curve table reformat produces zero
      false-positive drift flags.

---

### **VI. ROADMAP RELATIONSHIPS**

- **Parent Milestone:** **MS-03: THE DETERMINISM & EXTRACTION FIDELITY GATE.**
- **Blocking Downstream:**
  - **MS-05 (THE HYBRID AUTHORING GATE):** A showrunner cannot trust the full draft/edit/commit
    workflow if hand-edits risk silently corrupting untouched fields.
- **Waiting On Upstream:**
  - **EPIC-002 (THE DRIFT DETECTION AUDIT):** Round-trip fidelity and drift detection are closely
    related; this Epic assumes EPIC-002's threshold-safety fix is already in place.

---

### **VII. EPIC DETAILS**

| Attribute          | Value                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| **Priority**       | 🟡 High                                                                     |
| **Status**         | ⚪ PENDING _(per MS-03 Section III source status)_                          |
| **Lead Developer** | Backend Lead                                                                |
| **Assigned Team**  | Packages Sextet Pillar                                                      |
| **Estimate**       | 8 Story Points _(FEAT-01: 3 · FEAT-02: 3 · FEAT-03: 2)_                     |
| **Target Release** | v0.3.0 — Determinism Beta                                                   |
| **Start Date**     | Sprint 7, Day 1                                                             |
| **Due Date**       | Sprint 8, Final Day _(Hard Stop)_                                           |
| **Tags**           | `Packages`, `goblin-extract`, `Round-Trip`, `Testing`, `Field-Preservation` |
| **Progress**       | 0% _(0 of 3 features closed)_                                               |

---

> **⚠️ ENFORCEMENT NOTICE:** This Epic document constitutes a binding scope contract. Features not
> listed in the Closed Ledger (Section II) are unfunded and must not be built. A hand-edit to one
> field must never silently alter another field's value on extraction. Violations are architectural
> regressions subject to immediate rollback.
