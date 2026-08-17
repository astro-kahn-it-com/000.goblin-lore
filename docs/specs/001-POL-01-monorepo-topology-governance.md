# 📜 POLICY: [POL-01] MONOREPO TOPOLOGY GOVERNANCE

---

### **I. POLICY OVERVIEW**

**Core Objective** This policy governs the absolute structural integrity of the `goblin-lore`
monorepo. It establishes a non-negotiable workspace hierarchy where configuration is central,
dependencies are unidirectional, and cross-repo contamination is structurally impossible. The
isolation of the six architectural pillars (Configuration, Lore, Engine, Viewport, Assets,
Quarantine) is critical to maintaining a predictable, deterministic build pipeline.

**Primary Success Metric** **0.000% cross-workspace relative imports** across the entire codebase.
100% compliance with `goblin-config` linting and formatting rules across all constituent
repositories, verified via automated CI gating on every commit.

**Competitive Advantage** A rigidly enforced monorepo topology eliminates "works on my machine"
drift and ensures that independent teams (e.g., storyboard artists vs. engine developers) can
operate without corrupting each other's execution environments. It guarantees that the simulation
engine relies solely on mathematically validated data, not ad-hoc relative imports of unstable
source files.

**Termination Criteria (Kill Switch)** This policy is suspended and an architectural emergency is
declared if:

1. **Circular Dependency Breach:** A circular dependency is introduced between any two top-level
   workspaces, causing an infinite build loop or deadlock.
2. **Build Non-Determinism:** Consecutive clean-room builds (`npm ci && npm run build:ordered`)
   produce diverging artifacts or fail sporadically on identical commits.

---

### **II. SCOPE & REQUIREMENTS**

**Compliance Standards** _All features, services, and code paths governed by this policy must meet
these non-negotiable standards. Violations are architectural regressions subject to immediate
revert._

- **Standard 1 — Unidirectional Consumption:** Workspaces may only consume other workspaces via
  compiled, exported artifacts defined in their respective `package.json` configurations. Direct
  relative imports (e.g., `import { X } from '../../other-repo/src/X'`) are strictly banned.
- **Standard 2 — Configuration Centralization:** `goblin-config` is the sole source of truth for
  ESLint, Prettier, and basic TypeScript compiler configurations. Local overrides within individual
  workspaces are forbidden.
- **Standard 3 — Tiered Build Ordering:** The build pipeline must execute sequentially: Tier 0
  (Config/Types) -> Tier 1 (Corpus Compilation) -> Tier 2 (Engine/Viewport). Parallel execution is
  only permitted within the same tier.

**Out of Scope (Banned Features)** _The following are explicitly prohibited under this policy.
Building them is not "getting ahead" — it is waste._

1. **Workspace-Local Lint Definitions:** Custom `.eslintrc` rules that diverge from the
   `goblin-config` standard.
2. **Ad-Hoc Build Scripts:** Circumventing the `build:ordered` orchestrator with custom, out-of-band
   compile steps in CI.
3. **Shared Mutable State Modules:** Creating a "commons" workspace that mutates state across the
   engine and the viewport.

---

### **III. TECHNICAL STANDARDS & PREREQUISITES**

**Performance SLAs** _These are hard contractual limits. Exceeding any SLA triggers an automatic
incident review._

| Domain                    | SLA                                                     | Enforcement                                  |
| ------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| **Clean Build Time**      | ≤ 45 seconds for a complete Tier 0-2 clean compilation. | Monitored via CI pipeline duration tracking. |
| **Lint/Format Execution** | ≤ 10 seconds for full monorepo scan.                    | Pre-commit hook execution limits.            |

**Required Documentation** _This policy cannot be activated until the following documents are
finalized and approved:_

- **DOC-POL-001:** Workspace Dependency Matrix — defining all allowed imports.
- **DOC-POL-002:** Build Ordering Sequence Diagram.

---

### **IV. EXECUTION & TRACKING**

**Associated Milestones**

| Milestone                             | Relationship                                                                  | Status     |
| ------------------------------------- | ----------------------------------------------------------------------------- | ---------- |
| **MS-01:** THE CORPUS FOUNDATION GATE | Direct governance target — this policy defines the core requirement of MS-01. | ⚪ PENDING |

**Measurement: Key Performance Indicators (KPIs)** _All KPIs must be measurable via automated CI/CD
pipeline. Manual verification is not accepted as proof._

- [ ] **KPI 1 — Isolation Gate Pass:** The script `validate-isolation-boundary.ts` returns Code 0 on
      all PRs.
- [ ] **KPI 2 — Config Consistency:** `eslint --print-config` output matches the `goblin-config`
      baseline hash exactly across all workspaces.

---

### **V. ADMINISTRATIVE DETAILS**

| Attribute                 | Value                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Priority**              | 🔴 Critical                                                                                                                  |
| **Market Value**          | Absolute isolation ensures the simulation's mathematical core cannot be accidentally corrupted by UI/UX feature development. |
| **Status**                | ⚪ Draft                                                                                                                     |
| **Policy Owner**          | Lead Architect                                                                                                               |
| **Enforcement Mechanism** | Pre-commit hooks and CI workflow barriers.                                                                                   |
| **Review Cadence**        | Bi-annually.                                                                                                                 |
| **Version**               | 1.0.0                                                                                                                        |
| **Effective Date**        | Upon MS-01 gate approval.                                                                                                    |

---

> **⚠️ ENFORCEMENT NOTICE:** This policy document is a binding governance instrument. It is not
> advisory. All code, architecture decisions, and feature implementations within its scope must
> comply with the standards defined herein. Relative imports across workspace boundaries are
> forbidden. Violations are regressions. Regressions are reverted.
