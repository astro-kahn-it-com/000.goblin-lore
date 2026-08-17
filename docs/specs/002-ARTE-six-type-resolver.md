# 📜 ARTIFACT: THE SIX-TYPE RESOLVER REGISTRY

**Artifact ID:** `MECH-RESOLVE-001` **Version:** 1.0.0 **Governing Policy:** [POLICY-02] NARRATIVE
DETERMINISM & MECHANICAL RIGOR **Parent Milestone:** MS-02 — THE MECHANICAL RESOLUTION GATE

---

### **I. THE DEFINITION OF TRUTH (Executive Summary)**

**The Function** This Artifact defines the **Six-Type Resolver Registry** — the immutable,
mathematical mapping between the six valid narrative resolution types (Concession, Compromise,
Escalation, Evasion, Annihilation, Subjugation) and their precise numerical impacts on the ledger.
It codifies the Zod enums, the state transition logic, and the validation middleware that ensures
every compiled scene commits a valid, mathematically sound resolution.

**The Liability** If a scene is permitted to resolve with an undefined outcome, or if a "Concession"
deducts the wrong amount of relational equity, the simulation's emotional economy collapses. The
characters' grudges and bonds are entirely determined by these mathematical shifts. An untracked or
incorrectly resolved conflict results in silent narrative drift, breaking the determinism guarantee
and invalidating all downstream psychological weighting.

**The Scope of Authority**

- **GOVERNS:** The `resolution_type` field in every scene's Markdown frontmatter. The ledger state
  transition logic in `worker-sower-engine`.
- **OVERRIDES:** Any narrative text claiming a different outcome. The mathematical ledger is the
  sole arbiter of truth.
- **ENFORCES:** The Closed Set Doctrine — there are exactly six ways a grievance can resolve. No
  custom resolution types are permitted.

---

### **II. THE REGISTRY TAXONOMY (Identification & Classification)**

**Artifact ID:** `MECH-RESOLVE-001`

**Classification Type**

- [x] **TYPE A: THE LAW (Schemas)** — Zod schemas, TypeScript interfaces, protocol definitions.
- [ ] **TYPE B: THE HANDSHAKE (Protocols)** — API contracts, WebSocket frame specifications, wire
      formats.
- [ ] **TYPE C: THE LIMIT (Policies)** — Performance SLAs, memory budgets, governance rules.
- [ ] **TYPE D: THE TOPOLOGY (Infrastructure)** — Build order, dependency graphs, workspace
      configuration, CI/CD pipeline definitions.
- [ ] **TYPE E: THE ASSET (Media)** — Sprites, shaders, audio, font manifests, visual assets.

**Source Locations**

| File                                                      | Purpose                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| `goblin-lore/src/schemas/resolution.ts`                   | Zod enum defining the six valid resolution types.                  |
| `worker-sower-engine/src/mechanics/resolver.ts`           | The state transition logic mapping types to numeric ledger shifts. |
| `worker-sower-engine/src/middleware/ledger-validation.ts` | Validation middleware ensuring post-resolution state integrity.    |
| `docs/architecture/six-type-resolver.md`                  | Theoretical framework and truth table diagram.                     |

---

### **III. THE TECHNICAL SPECIFICATION (The Content)**

#### **1. The Resolution Enum**

```typescript
export const ResolutionTypeSchema = z.enum([
  'CONCESSION',
  'COMPROMISE',
  'ESCALATION',
  'EVASION',
  'ANNIHILATION',
  'SUBJUGATION',
])
export type ResolutionType = z.infer<typeof ResolutionTypeSchema>
```

#### **2. The Shift Matrix**

| Resolution Type  | Aggressor Equity Shift | Target Equity Shift | Global Tension Shift |
| ---------------- | ---------------------- | ------------------- | -------------------- |
| **CONCESSION**   | +1                     | -1                  | -1                   |
| **COMPROMISE**   | 0                      | 0                   | -2                   |
| **ESCALATION**   | +2                     | +2                  | +3                   |
| **EVASION**      | 0                      | 0                   | +1                   |
| **ANNIHILATION** | +5                     | -5                  | +5                   |
| **SUBJUGATION**  | +3                     | -3                  | +2                   |

#### **3. State Transition Validation**

The engine must validate that a scene commit includes exactly one of these six resolution types, and
apply the corresponding shift to the relational ledger.

```typescript
export function applyResolution(
  state: LedgerState,
  resolution: ResolutionType,
  aggressorId: string,
  targetId: string,
): LedgerState {
  const shifts = RESOLUTION_SHIFT_MATRIX[resolution]
  // ... apply shifts immutably ...
  return newState
}
```

---

### **IV. THE AUDIT CHECKLIST**

- [ ] **Schema Coverage:** The Zod schema explicitly restricts inputs to the six defined types.
- [ ] **Unit Tests:** Every resolution type has a corresponding state-transition unit test verifying
      the exact equity shifts.
- [ ] **Middleware Integrity:** The ledger validation middleware catches and rejects any invalid or
      undefined resolution type during the commit phase.

---

### **V. GOVERNANCE ATTRIBUTES**

| Attribute            | Value                                                |
| -------------------- | ---------------------------------------------------- |
| **Artifact ID**      | `MECH-RESOLVE-001`                                   |
| **Version**          | 1.0.0                                                |
| **Classification**   | TYPE A: THE LAW                                      |
| **Governing Policy** | [POLICY-02] NARRATIVE DETERMINISM & MECHANICAL RIGOR |
| **Parent Milestone** | MS-02: THE MECHANICAL RESOLUTION GATE                |
| **Owner**            | Lead Architect                                       |
| **Status**           | ⚪ Draft                                             |
