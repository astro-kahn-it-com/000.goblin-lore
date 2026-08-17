# 📜 ARTIFACT: THE TWO-PASS CORPUS COMPILER & BIBLE-STATE SCHEMA

**Artifact ID:** `CORPUS-COMPILE-001` **Version:** 1.0.0 **Governing Policy:** [POLICY-01] ENGINE
DETERMINISM & LEDGER INTEGRITY **Parent Milestone:** MS-01 — THE CORPUS FOUNDATION GATE

---

### **I. THE DEFINITION OF TRUTH (Executive Summary)**

**The Function** This Artifact defines the complete **Two-Pass Corpus Compilation Pipeline**
implemented in `goblin-lore/compile.ts`. Pass 1 performs strict Zod shape validation against every
hand-authored Markdown file in the four corpus categories (Character, Grievance, Location,
Possession), stripping YAML frontmatter via `gray-matter` and validating each against its
category-specific schema. Pass 2 performs exhaustive relational integrity checking, confirming that
every cross-file pointer (`owner`, `participants`, `location`, `linked_grievances`,
`linked_possessions`) resolves to an existing, non-retired file. The compiler produces a single
deterministic output artifact: `goblin-lore/compiled/bible-state.json`, indexed by entity ID for
efficient downstream consumption by `worker-sower-engine`.

**The Liability** A corpus that compiles with an undetected broken relational pointer propagates
silent corruption into every downstream calculation. If `grievance_014.md` claims
`participants: ["mordecai", "non_existent_char"]` and the compiler does not hard-fail, the Selection
Lottery will process an invalid candidate pool. The Individuation Multiplier will compute weights
against phantom entities. The entire psychological simulation inherits the error invisibly,
producing outputs that look plausible but are mathematically invalid. This compiler is the last line
of defense against data corruption.

**The Scope of Authority**

- **GOVERNS:** The shape and relational integrity of every `.md` file in the `goblin-lore/corpus/`
  directory tree. The structure and serialization order of `bible-state.json`.
- **OVERRIDES:** Any manual construction of `bible-state.json` outside the compiler pipeline. Any
  runtime code that parses corpus Markdown directly instead of consuming the compiled artifact.
- **ENFORCES:** The Retirement Protocol — files in `_retired/` are excluded from the active
  selection pool but must not be referenced by active files without an explicit logged exception.

---

### **II. THE REGISTRY TAXONOMY (Identification & Classification)**

**Artifact ID:** `CORPUS-COMPILE-001`

**Classification Type**

- [x] **TYPE A: THE LAW (Schemas)** — Zod schemas, TypeScript interfaces, protocol definitions.
- [ ] **TYPE B: THE HANDSHAKE (Protocols)** — API contracts, WebSocket frame specifications, wire
      formats.
- [ ] **TYPE C: THE LIMIT (Policies)** — Performance SLAs, memory budgets, governance rules.
- [x] **TYPE D: THE TOPOLOGY (Infrastructure)** — Build order, dependency graphs, workspace
      configuration, CI/CD pipeline definitions.
- [ ] **TYPE E: THE ASSET (Media)** — Sprites, shaders, audio, font manifests, visual assets.

**Source Locations**

| File                                      | Purpose                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `goblin-lore/compile.ts`                  | The two-pass compiler entry point.                |
| `goblin-lore/src/schemas/character.ts`    | Zod schema for character corpus files.            |
| `goblin-lore/src/schemas/grievance.ts`    | Zod schema for grievance corpus files.            |
| `goblin-lore/src/schemas/location.ts`     | Zod schema for location corpus files.             |
| `goblin-lore/src/schemas/possession.ts`   | Zod schema for possession corpus files.           |
| `goblin-lore/compiled/bible-state.json`   | The deterministic compiled output artifact.       |
| `goblin-lore/test/compiler.test.ts`       | Compiler test suite with broken-pointer fixtures. |
| `docs/architecture/compiler-spec.md`      | Two-pass compilation specification.               |
| `docs/architecture/bible-state-schema.md` | Compiled state schema reference.                  |

---

### **III. THE TECHNICAL SPECIFICATION (The Content)**

#### **1. Pass 1: Zod Shape Validation**

For each `.md` file in `goblin-lore/corpus/`:

1. Extract YAML frontmatter using `gray-matter`.
2. Determine the file's category from its directory path (`characters/`, `grievances/`,
   `locations/`, `possessions/`).
3. Validate the extracted frontmatter against the category-specific Zod schema.
4. On any `ZodError`: **HARD FAIL** — log the offending file path, field name, expected type, and
   received value. Refuse to produce output.

```typescript
// Pass 1 — Shape Validation
for (const file of corpusFiles) {
  const { data } = matter(fs.readFileSync(file, 'utf8'))
  const schema = SCHEMA_REGISTRY[getCategoryFromPath(file)]
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new CompilerError('PASS_1_SHAPE_VIOLATION', file, result.error)
  }
}
```

#### **2. Pass 2: Relational Integrity Checking**

After all files pass shape validation, build an indexed lookup map of all entity IDs. Then, for
every relational field in every file, verify that the referenced ID exists in the index and is not
retired (unless the reference carries an explicit `historical_reference: true` flag).

**Relational Pointer Inventory (Exhaustive)**

| Schema Type | Relational Field       | Points To      | Constraint                      |
| ----------- | ---------------------- | -------------- | ------------------------------- |
| Character   | `linked_grievances[]`  | Grievance IDs  | Must exist, must not be retired |
| Character   | `linked_possessions[]` | Possession IDs | Must exist, must not be retired |
| Grievance   | `owner`                | Character ID   | Must exist, must not be retired |
| Grievance   | `participants[]`       | Character IDs  | Must exist, must not be retired |
| Grievance   | `location`             | Location ID    | Must exist                      |
| Possession  | `owner`                | Character ID   | Must exist, must not be retired |
| Location    | `adjacent_locations[]` | Location IDs   | Must exist                      |

#### **3. Deterministic Serialization**

`bible-state.json` is produced with explicitly sorted keys at every nesting level using
`JSON.stringify(state, null, 2)` with a custom replacer that sorts object keys alphabetically. This
guarantees byte-identical output across V8, Bun, and Deno runtimes.

```typescript
function deterministicStringify(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce(
            (sorted, key) => {
              sorted[key] = value[key]
              return sorted
            },
            {} as Record<string, unknown>,
          )
      }
      return value
    },
    2,
  )
}
```

#### **4. The Compiled State Index Structure**

```typescript
interface BibleState {
  version: string // Semantic version of the schema
  compiled_at: string // ISO 8601 timestamp
  characters: Record<string, CompiledCharacter>
  grievances: Record<string, CompiledGrievance>
  locations: Record<string, CompiledLocation>
  possessions: Record<string, CompiledPossession>
  _metadata: {
    total_files: number
    retired_files: number
    compilation_hash: string // SHA-256 of the output
  }
}
```

---

### **IV. THE AUDIT CHECKLIST**

- [ ] **Schema Compliance:** 100% of corpus files pass Pass 1 Zod validation on a known-good state.
- [ ] **Relational Integrity:** Pass 2 hard-fails on 100% of deliberately introduced broken-pointer
      fixtures (one per relational field type).
- [ ] **Determinism:** 10 consecutive compiler runs produce SHA-256-identical `bible-state.json`.
- [ ] **Extraction Compatibility:** `goblin-extract`'s test suite passes against the compiler's
      output shape.
- [ ] **Retirement Handling:** Files in `_retired/` are excluded from active indices. Active files
      referencing retired files without `historical_reference: true` produce a hard fail.

---

### **V. GOVERNANCE ATTRIBUTES**

| Attribute            | Value                                             |
| -------------------- | ------------------------------------------------- |
| **Artifact ID**      | `CORPUS-COMPILE-001`                              |
| **Version**          | 1.0.0                                             |
| **Classification**   | TYPE A/D: SCHEMA + TOPOLOGY                       |
| **Governing Policy** | [POLICY-01] ENGINE DETERMINISM & LEDGER INTEGRITY |
| **Parent Milestone** | MS-01: THE CORPUS FOUNDATION GATE                 |
| **Owner**            | Lead Architect                                    |
| **Last Reviewed**    | 2026-08-17                                        |
| **Status**           | ⚪ Draft                                          |

---

> **⚠️ ENFORCEMENT NOTICE:** This Artifact is the root-of-truth for corpus compilation. `compile.ts`
> is the sole authority for producing `bible-state.json`. No component may bypass the compiler. No
> runtime code may parse corpus Markdown directly. The two-pass validation is exhaustive — every
> relational field type in every schema must be covered. Partial coverage is not coverage.
