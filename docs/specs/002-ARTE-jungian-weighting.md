# 📜 ARTIFACT: JUNGIAN WEIGHTING & THE INDIVIDUATION MULTIPLIER

**Artifact ID:** `MECH-JUNGIAN-001` **Version:** 1.0.0 **Governing Policy:** [POLICY-02] NARRATIVE
DETERMINISM & MECHANICAL RIGOR **Parent Milestone:** MS-02 — THE MECHANICAL RESOLUTION GATE

---

### **I. THE DEFINITION OF TRUTH (Executive Summary)**

**The Function** This Artifact defines the **Jungian Weighting System and Individuation
Multiplier**. It establishes the mathematical framework for how a character's archetype (e.g.,
Shadow, Anima, Wise Old Man) resists or amplifies specific types of relational interactions. It
codifies the Role-Resistance Truth Table and the weighting functions that modify base ledger values
during the Stage 3 selection lottery.

**The Liability** Without archetypal weighting, every character interacts with the system using
flat, identical mathematics. The "Jungian dollhouse" premise fails if the Shadow character builds
rapport at the exact same systemic rate as the Anima. This weighting ensures that structural
resistance exists — making it mathematically harder for specific archetypes to achieve certain
resolutions, thus driving character-specific narrative friction.

**The Scope of Authority**

- **GOVERNS:** The `role_resistance` checks in the selection lottery. The `individuation_multiplier`
  applied to relational equity changes.
- **OVERRIDES:** Flat mathematical additions. All equity shifts must pass through the Jungian
  Weighting filter.
- **ENFORCES:** Archetypal Consistency — characters are mathematically bound by their Jungian role.

---

### **II. THE REGISTRY TAXONOMY (Identification & Classification)**

**Artifact ID:** `MECH-JUNGIAN-001`

**Classification Type**

- [ ] **TYPE A: THE LAW (Schemas)** — Zod schemas, TypeScript interfaces, protocol definitions.
- [ ] **TYPE B: THE HANDSHAKE (Protocols)** — API contracts, WebSocket frame specifications, wire
      formats.
- [x] **TYPE C: THE LIMIT (Policies)** — Performance SLAs, memory budgets, governance rules.
- [ ] **TYPE D: THE TOPOLOGY (Infrastructure)** — Build order, dependency graphs, workspace
      configuration, CI/CD pipeline definitions.
- [ ] **TYPE E: THE ASSET (Media)** — Sprites, shaders, audio, font manifests, visual assets.

**Source Locations**

| File                                                     | Purpose                                                 |
| -------------------------------------------------------- | ------------------------------------------------------- |
| `docs/architecture/role-resistance-truth-table.md`       | Matrix defining default resistances for each archetype. |
| `worker-sower-engine/src/mechanics/jungian-weighting.ts` | The Role-Resistance Detector and multiplier logic.      |
| `worker-sower-engine/src/logs/weighting-transparency.ts` | Logger outputting applied multipliers per candidate.    |

---

### **III. THE TECHNICAL SPECIFICATION (The Content)**

#### **1. The Role-Resistance Truth Table (Excerpt)**

| Archetype  | Resistant To (Multiplier < 1) | Amplifies (Multiplier > 1) |
| ---------- | ----------------------------- | -------------------------- |
| **SHADOW** | COMPROMISE (x0.5)             | ESCALATION (x1.5)          |
| **ANIMA**  | ANNIHILATION (x0.2)           | CONCESSION (x1.2)          |
| **HERO**   | EVASION (x0.1)                | SUBJUGATION (x1.1)         |

#### **2. The Weighting Function**

Before a resolution's base shift is applied to the ledger, it is processed through the character's
archetypal filter.

```typescript
export function applyJungianWeight(
  baseShift: number,
  resolution: ResolutionType,
  archetype: Archetype,
): number {
  const multiplier = ROLE_RESISTANCE_TABLE[archetype][resolution] ?? 1.0
  return Math.round(baseShift * multiplier)
}
```

#### **3. Transparency Logging**

To maintain determinism verification, the engine must log exactly which multipliers were applied
during every state transition.

---

### **IV. THE AUDIT CHECKLIST**

- [ ] **Truth Table Validation:** The matrix covers all active archetypes and all six resolution
      types.
- [ ] **Detector Unit Tests:** Each archetypal resistance pattern is tested against known base
      values.
- [ ] **Transparency Audit:** The transparency logger correctly records the applied multiplier and
      the final shifted value.

---

### **V. GOVERNANCE ATTRIBUTES**

| Attribute            | Value                                                |
| -------------------- | ---------------------------------------------------- |
| **Artifact ID**      | `MECH-JUNGIAN-001`                                   |
| **Version**          | 1.0.0                                                |
| **Classification**   | TYPE C: THE LIMIT                                    |
| **Governing Policy** | [POLICY-02] NARRATIVE DETERMINISM & MECHANICAL RIGOR |
| **Parent Milestone** | MS-02: THE MECHANICAL RESOLUTION GATE                |
| **Owner**            | Lead Architect                                       |
| **Status**           | ⚪ Draft                                             |
