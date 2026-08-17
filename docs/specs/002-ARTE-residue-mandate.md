# 📜 ARTIFACT: THE RESIDUE MANDATE & DECAY MECHANICS

**Artifact ID:** `MECH-RESIDUE-001` **Version:** 1.0.0 **Governing Policy:** [POLICY-02] NARRATIVE
DETERMINISM & MECHANICAL RIGOR **Parent Milestone:** MS-02 — THE MECHANICAL RESOLUTION GATE

---

### **I. THE DEFINITION OF TRUTH (Executive Summary)**

**The Function** This Artifact defines the **Residue Accrual Engine and Decay Mechanics**. It
codifies how unresolved narrative tension ("Residue") accumulates on characters and locations over
time, and the specific triggers that cause this residue to decay. It establishes the mathematical
tracking of `residue_score`, ensuring that no emotional weight is lost or ignored between cycles.

**The Liability** Without explicit residue tracking, narrative tension evaporates between scenes. A
character who suffers a defeat in Cycle 1 might interact cheerfully with their aggressor in Cycle 5
if the ledger does not mathematically enforce the lingering resentment. The Residue Mandate ensures
that history has weight, and that unaddressed conflict eventually forces an unavoidable
confrontation.

**The Scope of Authority**

- **GOVERNS:** The `residue_score` field in the state ledger for characters and locations. The decay
  functions that reduce residue over time or through specific narrative actions.
- **OVERRIDES:** Subjective interpretation of how a character "should" feel. The ledger's residue
  score dictates the emotional baseline.
- **ENFORCES:** The Conservation of Tension — residue can only be created by conflict and destroyed
  by resolution or structural decay. It cannot vanish silently.

---

### **II. THE REGISTRY TAXONOMY (Identification & Classification)**

**Artifact ID:** `MECH-RESIDUE-001`

**Classification Type**

- [x] **TYPE A: THE LAW (Schemas)** — Zod schemas, TypeScript interfaces, protocol definitions.
- [ ] **TYPE B: THE HANDSHAKE (Protocols)** — API contracts, WebSocket frame specifications, wire
      formats.
- [ ] **TYPE C: THE LIMIT (Policies)** — Performance SLAs, memory budgets, governance rules.
- [ ] **TYPE D: THE TOPOLOGY (Infrastructure)** — Build order, dependency graphs, workspace
      configuration, CI/CD pipeline definitions.
- [ ] **TYPE E: THE ASSET (Media)** — Sprites, shaders, audio, font manifests, visual assets.

**Source Locations**

| File                                             | Purpose                                              |
| ------------------------------------------------ | ---------------------------------------------------- |
| `goblin-lore/src/schemas/character.ts`           | Zod schema extension for `base_residue`.             |
| `worker-sower-engine/src/mechanics/residue.ts`   | The Residue Accrual Engine and Decay logic.          |
| `goblin-viewport/src/widgets/residue-monitor.ts` | Terminal OS widget displaying active residue levels. |

---

### **III. THE TECHNICAL SPECIFICATION (The Content)**

#### **1. The Residue Schema Extension**

```typescript
export const ResidueTrackerSchema = z.object({
  current_residue: z.number().min(0).max(100),
  last_escalation_cycle: z.number().int(),
  decay_rate: z.number().min(0).max(5),
})
```

#### **2. Accrual and Decay Logic**

Residue increases when grievances remain unresolved (e.g., EVASION or COMPROMISE). Residue decreases
(decays) naturally over time, or sharply during ANNIHILATION or SUBJUGATION.

```typescript
export function calculateCycleResidue(
  currentState: LedgerState,
  currentCycle: number,
): LedgerState {
  // Apply natural decay
  // Apply shift-based accrual
  // Return updated state immutably
}
```

---

### **IV. THE AUDIT CHECKLIST**

- [ ] **Schema Coverage:** `base_residue` and tracking fields are correctly typed and validated.
- [ ] **Accrual Tests:** Unit tests verify that residue correctly increases after non-resolving
      conflicts.
- [ ] **Decay Tests:** Unit tests verify that natural decay applies correctly across cycle
      boundaries.
- [ ] **Widget Integration:** The Terminal OS correctly displays high-residue characters/locations
      for targeted selection.

---

### **V. GOVERNANCE ATTRIBUTES**

| Attribute            | Value                                                |
| -------------------- | ---------------------------------------------------- |
| **Artifact ID**      | `MECH-RESIDUE-001`                                   |
| **Version**          | 1.0.0                                                |
| **Classification**   | TYPE A: THE LAW                                      |
| **Governing Policy** | [POLICY-02] NARRATIVE DETERMINISM & MECHANICAL RIGOR |
| **Parent Milestone** | MS-02: THE MECHANICAL RESOLUTION GATE                |
| **Owner**            | Lead Architect                                       |
| **Status**           | ⚪ Draft                                             |
