# AGENTS.md — goblin-lore (`@snailicid3/consumer-npm`)

> This document is the single source-of-truth for AI agents operating on this repository. Follow
> every section literally. If a rule conflicts with an ad-hoc user request, ask for clarification
> before proceeding.

---

## 1. Repository Identity

| Field               | Value                                                             |
| ------------------- | ----------------------------------------------------------------- |
| **Package name**    | `@snailicid3/consumer-npm`                                        |
| **Visibility**      | `private` — never published to npm                                |
| **Package manager** | **npm only** (`npm@10.9.2`). Never substitute pnpm, yarn, or bun. |
| **Node version**    | `^20.11.0` (CI uses Node 20)                                      |
| **Module system**   | ESM (`"type": "module"` in `package.json`)                        |
| **Language**        | TypeScript 6.x, compiled via `tsc` and bundled via `tsdown`       |
| **Test framework**  | Vitest 4.x                                                        |
| **Repository URL**  | `https://github.com/gbtunney/snailicid3-consumer-npm`             |
| **Author**          | Gillian Tunney (`gbtunney@mac.com`)                               |

### 1.1 What This Repo Does

This repository implements the **Goblin Lore** corpus compilation pipeline — a two-pass compiler
that validates and compiles hand-authored Markdown lore files (characters, grievances, locations,
possessions) into a deterministic `bible-state.json` artifact. It is part of a larger narrative
simulation system.

**Domain concepts:**

- **Corpus** — a collection of `.md` files with YAML frontmatter describing fictional entities
  (characters, grievances, locations, possessions).
- **Two-Pass Compiler** — Pass 1 validates YAML frontmatter shapes against Zod schemas; Pass 2
  validates relational integrity (cross-entity references).
- **Bible State** — the compiled JSON artifact (`bible-state.json`) consumed by downstream
  `worker-sower` engine.
- **Retirement Protocol** — retired entities are excluded from the active lottery pool but validated
  for reference integrity.
- **Deterministic Serialization** — object keys sorted alphabetically to guarantee byte-identical
  JSON across runtimes.
- **Atomic Write** — compiled output is written via temp file + rename to prevent corruption.

### 1.2 Workspace Topology

This repo uses **npm workspaces** linking to two sibling repos:

```json
"workspaces": [
    "../../campc-it-com/worker-sower",
    "../../campc-it-com/goblin-extract"
]
```

These are external repos consumed via workspace protocol. Never add workspace entries without
explicit approval.

### 1.3 Shared Configuration

All tooling configurations are consumed from `@snailicid3/config` and `@snailicid3/build-config`.
Every config builder receives `cwd: import.meta` for path resolution.

| Tool         | Config file             | Config source                                       |
| ------------ | ----------------------- | --------------------------------------------------- |
| ESLint       | `eslint.config.ts`      | `EsLint.config()` from `@snailicid3/config`         |
| Prettier     | `prettier.config.ts`    | `Prettier.config()` from `@snailicid3/config`       |
| Markdownlint | `.markdownlint-cli2.ts` | `Markdownlint.config()` from `@snailicid3/config`   |
| Lint-staged  | `.lintstagedrc.ts`      | `LintStaged.config()` with `packageManager: 'npm'`  |
| Commitlint   | `commitlint.config.ts`  | `Commitlint.config()` from `@snailicid3/config`     |
| tsdown       | `tsdown.config.ts`      | `defineBuildPlan()` from `@snailicid3/build-config` |

> **CRITICAL**: When modifying any config file, always use the shared config builder pattern with
> `cwd: import.meta`. Never create standalone local config objects.

---

## 2. Directory Structure

```text
.
├── .changeset/           # Changeset config for versioning
│   ├── config.json       # baseBranch: "main", access: "restricted"
│   └── README.md
├── .github/workflows/    # CI/CD (see Section 9)
│   ├── call-pipeline.yml       # Reusable pipeline (build, check, fix, commit)
│   ├── dispatch-pipeline.yml   # Manual trigger for call-pipeline
│   ├── dispatch-workspace-update.yml  # Manual fix/docs/api-report + commit
│   ├── pr-checks.yml           # PR validation (build → test → docs → api)
│   └── push-main.yml          # Changeset version PR or GitHub Release
├── .husky/               # Git hooks
│   ├── pre-commit        # Branch protection, filename check, lint-staged
│   ├── commit-msg        # Commitlint validation
│   └── pre-push          # Branch protection
├── .vscode/              # Editor config
│   ├── settings.json     # TS server memory, ESLint rule customizations
│   └── extensions.json   # Recommended extensions
├── bin/                  # Binary scripts and utilities
│   ├── esbuild-patch.ts  # macOS Catalina esbuild binary patch
│   ├── esbuild-darwin-x64  # Vendored esbuild binary for Catalina
│   ├── Esbuild.md
│   └── git-hooks/
│       └── functions.sh  # Shell utilities for git hooks
├── compile.ts            # Two-pass corpus compiler runner script
├── compiled/             # Compiled state JSON output (bible-state.json)
├── corpus/               # Markdown lore source files (characters, grievances, locations, possessions)
├── dist/                 # Bundled library output (ESM + CJS)
├── docs/
│   ├── architecture/     # Architecture runbooks
│   │   └── compile-order.md
│   ├── operations/       # Operations protocols
│   │   └── re-entry-protocol.md
│   ├── specs/            # Full spec hierarchy (87 files) — see Section 7
│   └── testing/          # Testing catalogs
│       └── round-trip-catalog.md
├── patches/              # patch-package patches
│   └── @snailicid3+config+0.2.0.patch
├── public/               # Static assets (favicon.svg, icons.svg)
├── scripts/
│   └── build-ordered.ts  # Tiered build orchestration CLI
├── src/                  # Source code — 34 feature modules + entry
│   ├── index.ts          # Barrel export (re-exports all modules)
│   ├── index.test.ts     # Root test file
│   └── <module>/         # Each module has index.ts + index.test.ts
├── types/                # TypeScript declaration output
├── tsconfig.json         # Silent checker (no emit)
├── tsconfig.build.json   # Library build (emits JS + declarations)
├── tsconfig.config.json  # Root config files (emits JS, no declarations)
├── vitest.config.ts      # Test config (includes cross-workspace tests)
├── package.json          # Package manifest
└── install-catalina.sh   # macOS Catalina two-stage installer
```

---

## 3. Installation & Setup

### 3.1 Standard Install

```sh
git clone https://github.com/gbtunney/snailicid3-consumer-npm.git
cd snailicid3-consumer-npm
npm install
```

The `postinstall` hook automatically:

1. Runs `patch-package` to apply patches in `patches/`.
2. Runs `bin/esbuild-patch.ts` to fix macOS Catalina esbuild binary compatibility.
3. Runs `npm run build:config:ts` to compile root config TypeScript files to JavaScript.

The `prepare` hook installs Husky git hooks.

### 3.2 macOS Catalina Install

If `npm install` fails on an esbuild native binary error:

```sh
./install-catalina.sh
```

This runs `npm install --ignore-scripts && npm install` — first pass installs without lifecycle
scripts, second pass runs them with the Catalina-compatible binary available.

### 3.3 Fork as New Project

```sh
git remote rename origin upstream
git remote add origin https://github.com/OWNER/REPOSITORY.git
```

---

## 4. TypeScript Configuration — The Three-Config System

This repo uses three TypeScript project configs with distinct responsibilities. **Always use the
correct config for the task.**

### 4.1 `tsconfig.json` — Silent Checker

- **Purpose**: Full-project type checking (no emit).
- **Extends**: `@snailicid3/config/tsconfig.typecheck`
- **Includes**: Root `.ts` files, `src/**/*.ts`, `**/*.test.ts`, `bin/**/*.ts`, `scripts/**/*.ts`
- **Excludes**: `node_modules`, `scratch`
- **When to use**: `npm run check:ts` — validates the entire project.

### 4.2 `tsconfig.build.json` — Library Build

- **Purpose**: Emits JS + declarations for the distributable library.
- **Extends**: `@snailicid3/config/tsconfig.library`
- **Includes**: `src/**/*.ts`
- **Excludes**: `**/*.test.ts`
- **Output**: `types/` directory
- **When to use**: `npm run build:ts` — generates declarations.

### 4.3 `tsconfig.config.json` — Root Config Compilation

- **Purpose**: Compiles root-level config `.ts` files to `.js` so Node can execute them.
- **Extends**: `@snailicid3/config/tsconfig.typecheck` with `noEmit: false`
- **Includes**: Root `.ts` files, `.markdownlint-cli2.ts`, `.lintstagedrc.ts`
- **Excludes**: `node_modules`, `scratch`, `vitest.config.ts`, `tsdown.ts`
- **When to use**: `npm run build:config:ts` — must run before lint-staged or commitlint can work.

> **CRITICAL RULE**: Before running any linting, committing, or tool that reads config files, always
> ensure `build:config:ts` has been run. The npm scripts already orchestrate this.

---

## 5. npm Scripts — Complete Reference

Scripts are organized into named sections in `package.json`. Use these exact commands.

### 5.1 Build Scripts

| Command                   | What it does                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `npm run build`           | Full build: `build:all:ts` → `tsdown` bundling                                       |
| `npm run build:ts`        | `tsc --build tsconfig.build.json` — emits JS + declarations to `types/`              |
| `npm run build:config:ts` | `tsc --build tsconfig.config.json` — compiles root config `.ts` → `.js`              |
| `npm run build:all:ts`    | `build:config:ts` → `build:ts` → `check:ts` (full TypeScript pipeline)               |
| `npm run build:ordered`   | Runs `scripts/build-ordered.ts` via jiti — tiered multi-workspace build              |
| `npm run compile`         | Runs `compile.ts` via jiti — compiles `corpus/*.md` into `compiled/bible-state.json` |

### 5.2 Test Scripts

| Command              | What it does                           |
| -------------------- | -------------------------------------- |
| `npm test`           | `check:ts` → `vitest run` (single run) |
| `npm run test:watch` | `vitest` in watch mode                 |

**Vitest configuration** (`vitest.config.ts`):

- Includes: `**/*.{test,spec}.?(c|m)[jt]s?(x)`, `**/test.ts`, and cross-workspace
  `../../campc-it-com/goblin-extract/test.ts`
- Excludes: `node_modules`, `dist`, `build`, `scratch`

### 5.3 Check & Lint Scripts

| Command                | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `npm run check`        | `build:all:ts` → `lint` (full check)                        |
| `npm run check:ts`     | `tsc --build tsconfig.json` — type-check only, no emit      |
| `npm run check:md`     | `build:config:ts` → prettier on docs → markdownlint on docs |
| `npm run lint`         | `eslint .`                                                  |
| `npm run lint:md`      | `markdownlint-cli2 "docs/**/*.md"`                          |
| `npm run lint:verbose` | `eslint . --debug`                                          |

### 5.4 Fix & Format Scripts

| Command          | What it does                                                             |
| ---------------- | ------------------------------------------------------------------------ |
| `npm run format` | `prettier . --write`                                                     |
| `npm run fix`    | Full fix pipeline: `build:all:ts` → `check:ts` → `format` → `lint --fix` |
| `npm run fix:md` | Fix markdown: `build:config:ts` → prettier on docs → markdownlint fix    |

### 5.5 Commit Scripts

| Command                                | What it does                                |
| -------------------------------------- | ------------------------------------------- |
| `npm run commit`                       | Scoped conventional commit with lint-staged |
| `npm run commit:feat -- "message"`     | Feature commit                              |
| `npm run commit:fix -- "message"`      | Bug fix commit                              |
| `npm run commit:chore -- "message"`    | Chore commit                                |
| `npm run commit:refactor -- "message"` | Refactor commit                             |
| `npm run commit:test -- "message"`     | Test commit                                 |
| `npm run commit:build -- "message"`    | Build commit                                |
| `npm run commit:docs -- "message"`     | Docs commit                                 |
| `npm run commit:direct`                | Commit without lint-staged                  |
| `npm run commitlint`                   | Run commitlint manually                     |

**Important**: The `commit` script sets `SCOPE_COMMIT_MANAGES_LINT_STAGED=1` so the pre-commit hook
defers lint-staged to `scope-commit`. Direct `git commit` calls still trigger lint-staged via the
Husky pre-commit hook.

### 5.6 Publish & Release Scripts

| Command                     | What it does                                                         |
| --------------------------- | -------------------------------------------------------------------- |
| `npm run changeset`         | Create a new changeset via `gbt-changeset`                           |
| `npm run changeset:status`  | Check pending changeset status                                       |
| `npm run changeset:version` | Apply changeset versions to package.json                             |
| `npm run release`           | `changeset publish` (creates npm publish — note: package is private) |

### 5.7 Inspect Scripts

| Command                        | What it does                                                            |
| ------------------------------ | ----------------------------------------------------------------------- |
| `npm run inspect:dependencies` | `build:all:ts` → `knip` — finds unused dependencies, exports, and files |
| `npm run inspect:deps`         | Alias for `inspect:dependencies`                                        |
| `npm run inspect:lint`         | `eslint-config-inspector --no-open` — inspect ESLint flat config        |

### 5.8 Clean Scripts

| Command               | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `npm run clean:ts`    | `tsc --build --clean` on all three tsconfigs      |
| `npm run clean:build` | `rm -rf dist types`                               |
| `npm run clean`       | `clean:ts` → `clean:build`                        |
| `npm run uninstall`   | `clean` → `rm -rf node_modules package-lock.json` |

### 5.9 Dev Server

| Command       | What it does                                |
| ------------- | ------------------------------------------- |
| `npm run dev` | `check:ts` → `build:ts` → `vite` dev server |

This serves `index.html` with Vite's HMR for development.

---

## 6. Source Code Architecture

### 6.1 Module Organization

Every feature is its own directory under `src/` containing:

- `index.ts` — implementation
- `index.test.ts` — co-located Vitest tests

The barrel file `src/index.ts` re-exports all modules. **When adding a new module:**

1. Create `src/<module-name>/index.ts` and `src/<module-name>/index.test.ts`.
2. Add `export * from './<module-name>/index.js'` to `src/index.ts`.
3. Use the `.js` extension in the import path (ESM requirement).

### 6.2 Feature Module Inventory (34 modules)

Modules are grouped by the Epic/Feature they implement:

#### EPIC-001: Sovereign Foundations — Tiered Compile Orchestration

| Module                         | Purpose                                                                |
| ------------------------------ | ---------------------------------------------------------------------- |
| `sequence-specification`       | Defines the `BUILD_SEQUENCE` compile tier order and `CompileTier` type |
| `failure-halt-behavior-design` | `assertTierSuccess()` — halts on non-zero exit codes                   |
| `build-the-ordered-script`     | `executeOrderedBuild()` — runs tiers sequentially with `--repeat` flag |
| `build-the-order-log-writer`   | Writes build execution logs                                            |
| `cache-clearing-preamble`      | Cache clearing before clean-room builds                                |
| `clean-room-single-run-proof`  | Proves single clean-room build succeeds                                |
| `failure-halt-proof`           | Test proving failure halt behavior                                     |
| `ten-run-determinism-proof`    | Test proving 10 consecutive runs are identical                         |

#### EPIC-002: The Corpus Compiler — Two-Pass Validation

| Module                                   | Purpose                                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `schema-definition-pass`                 | Zod schemas: `CharacterSchema`, `GrievanceSchema`, `LocationSchema`, `PossessionSchema`, `AnyCorpusSchema` (discriminated union) |
| `relational-field-inventory`             | Exhaustive inventory of all relational pointer fields                                                                            |
| `implement-pass-1-shape-validation`      | Pass 1: Zod shape validation against frontmatter                                                                                 |
| `implement-the-relational-index-builder` | Builds indexed lookup map of all entity IDs                                                                                      |
| `implement-pass-2-relational-integrity`  | Pass 2: Cross-reference integrity checking                                                                                       |
| `retirement-awareness-logic`             | Retirement protocol: excludes `_retired/` entities from active pool                                                              |
| `positive-fixture-test`                  | Positive test: valid corpus compiles successfully                                                                                |
| `per-field-negative-fixture-tests`       | Negative tests: one broken pointer per relational field type                                                                     |
| `performance-benchmark`                  | Compilation performance benchmark                                                                                                |

#### EPIC-002: Compiled State Artifact — Deterministic Output

| Module                                   | Purpose                                                        |
| ---------------------------------------- | -------------------------------------------------------------- |
| `index-structure-specification`          | `BibleState` interface definition                              |
| `determinism-strategy`                   | `deterministicSortKeys()` — recursive alphabetical key sorting |
| `implement-the-deterministic-serializer` | `serializeDeterministic()` — JSON.stringify with sorted keys   |
| `implement-the-atomic-write`             | `atomicWrite()` — temp file + rename pattern                   |
| `implement-version-stamping`             | Semantic version stamping in compiled output                   |
| `byte-identical-reproducibility-test`    | SHA-256 comparison across multiple runs                        |
| `atomic-write-crash-simulation`          | Tests atomic write under simulated crash                       |
| `index-lookup-performance-check`         | Performance test for index lookups                             |

#### EPIC-002: Retirement Protocol Enforcement

| Module                                               | Purpose                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `extend-the-index-builder-for-lottery-exclusion`     | Excludes retired entities from selection lottery               |
| `implement-the-historical-reference-exception-check` | Allows `historical_reference: true` to bypass retirement check |
| `implement-retirement-metadata-validation`           | Validates retirement metadata fields                           |
| `lottery-exclusion-test`                             | Test: retired entities excluded from lottery                   |
| `unflagged-reference-rejection-test`                 | Test: unflagged reference to retired entity fails              |
| `flagged-reference-acceptance-test`                  | Test: flagged `historical_reference: true` reference passes    |

#### EPIC-003/006: Re-Entry Protocol & Error Handling

| Module                       | Purpose                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| `two-pass-invocation`        | Re-entry protocol: isolated two-pass compilation for manual edits |
| `error-categorization-logic` | Error classification (shape vs. relational vs. runtime)           |
| `fixture-execution`          | Fixture-based test execution harness                              |

### 6.3 Zod Schema Registry

The corpus uses four entity schemas defined in `src/schema-definition-pass/index.ts`:

```typescript
// Character: id, name, type("character"), linked_grievances[], linked_possessions[], location?, historical_reference?, retirement_reason?
// Grievance: id, name, type("grievance"), owner?, participants[], location?, historical_reference?, retirement_reason?
// Location:  id, name, type("location"), participants[], linked_grievances[], linked_possessions?, historical_reference?, retirement_reason?
// Possession: id, name, type("possession"), owner?, location?, historical_reference?, retirement_reason?
```

The `AnyCorpusSchema` is a `z.discriminatedUnion('type', [...])` covering all four.

### 6.4 Key Exports & Types

| Export                                                                     | From                                     | Description                       |
| -------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------- |
| `CharacterSchema`, `GrievanceSchema`, `LocationSchema`, `PossessionSchema` | `schema-definition-pass`                 | Zod schemas                       |
| `AnyCorpusSchema`, `AnyCorpus`                                             | `schema-definition-pass`                 | Discriminated union schema + type |
| `Character`, `Grievance`, `Location`, `Possession`                         | `schema-definition-pass`                 | Inferred TypeScript types         |
| `executeOrderedBuild()`                                                    | `build-the-ordered-script`               | Tiered build orchestrator         |
| `parseRepeatFlag()`                                                        | `build-the-ordered-script`               | CLI `--repeat N` parser           |
| `serializeDeterministic()`                                                 | `implement-the-deterministic-serializer` | Deterministic JSON serialization  |
| `atomicWrite()`                                                            | `implement-the-atomic-write`             | Atomic file write                 |
| `deterministicSortKeys()`                                                  | `determinism-strategy`                   | Recursive key sorting             |
| `assertTierSuccess()`                                                      | `failure-halt-behavior-design`           | Build tier assertion              |

---

## 7. Documentation Hierarchy — Specs

The `docs/specs/` directory contains **87 specification files** following a strict naming and
hierarchy convention.

### 7.1 Document Types

| Prefix            | Type         | Purpose                                                  |
| ----------------- | ------------ | -------------------------------------------------------- |
| `NNN-ARTE-`       | **Artifact** | Technical specification of a system component            |
| `NNN-EPIC-`       | **Epic**     | Scope contract defining features and their closed ledger |
| `NNN-POL-`        | **Policy**   | Governance rules and compliance standards                |
| `NNN-MEASURE-`    | **Measure**  | Performance audit criteria and KPIs                      |
| `NNN.XX-FEAT-`    | **Feature**  | Feature specification under an Epic                      |
| `NNN.XX.YY-TASK-` | **Task**     | Granular implementation task under a Feature             |

### 7.2 Numbering Scheme

The `NNN` prefix maps to a milestone/epic group:

- `001` — **MS-01: The Corpus Foundation Gate** (EPIC-001 Sovereign Foundations, EPIC-002 Corpus
  Compiler)
- `002` — **MS-02: The Mechanical Resolution Gate** (Six-Type Resolver, Residue Mandate, Jungian
  Weighting)
- `003` — **MS-03: The Determinism & Extraction Fidelity Gate** (Round-Trip Guarantee)
- `006` — Additional pipeline features

Sub-numbering: `NNN.XX` = Feature within Epic, `NNN.XX.YY` = Task within Feature.

### 7.3 Spec File Structure

Every spec follows a standard template with numbered sections:

- **I.** Definition/Overview — executive summary, liability, scope
- **II.** Registry/Feature Ledger — classification and enumerated scope
- **III.** Technical Specification — the actual content
- **IV.** Audit Checklist — pass/fail verification items
- **V.** Governance Attributes — version, owner, status table

### 7.4 Rules for Spec Documents

1. **Never create a feature not listed in its Epic's Closed Ledger** — "if it's not listed, it's
   unfunded."
2. **Every TASK file maps 1:1 to a source module** in `src/`.
3. **Artifact IDs must be unique** across the entire spec corpus.
4. **Status values**: ⚪ Draft, ⚪ PENDING, 🟡 In Progress, 🟢 Complete.
5. **When creating new specs**: follow the exact naming convention and template structure.

---

## 8. Git Hooks & Commit Workflow

### 8.1 Husky Hooks

Three hooks are configured in `.husky/`:

#### Pre-commit (`.husky/pre-commit`)

1. Sources `bin/git-hooks/functions.sh`.
2. **Protected branch check** — blocks direct commits to `master`.
3. **Branch name validation** — allows only `[a-zA-Z0-9]+([/-][a-zA-Z0-9]+)*`.
4. **Staged filename check** — only allows `A-Z a-z 0-9 space . _ - + @ /` in filenames.
5. **Lint-staged** — runs lint-staged unless `SCOPE_COMMIT_MANAGES_LINT_STAGED=1` is set.

#### Commit-msg (`.husky/commit-msg`)

- Runs `commitlint --edit` to validate conventional commit format.
- Scope is optional (`'scope-empty': [0]`).

#### Pre-push (`.husky/pre-push`)

- **Protected branch check** — blocks pushes to `master`.

### 8.2 `bin/git-hooks/functions.sh`

This shell library provides all hook utilities. Key functions:

| Function                                | Purpose                                                        |
| --------------------------------------- | -------------------------------------------------------------- |
| `get_package_manager`                   | Reads `packageManager` from `package.json`, defaults to `pnpm` |
| `run_package_script <script>`           | Runs an npm script                                             |
| `run_package_binary <binary>`           | Runs a package binary (`npm exec --`)                          |
| `run_snail_sh <cmd>`                    | Runs the `snail-sh` CLI for formatted output                   |
| `show_hook_section <name>`              | Prints a styled section header                                 |
| `run_scope_commit`                      | Runs `scope-commit --checked-commit`                           |
| `check_protected_branch <commit\|push>` | Blocks operations on `master`                                  |
| `validate_branch_name`                  | Enforces branch name pattern                                   |
| `check_staged_filenames`                | Rejects filenames with special characters                      |
| `run_lint_staged_if_needed`             | Skips if `SCOPE_COMMIT_MANAGES_LINT_STAGED=1`                  |

### 8.3 Commit Workflow — Step by Step

**Preferred method (scoped commit):**

```sh
npm run commit:feat -- "add schema for locations"
```

This:

1. Compiles config TypeScript (`build:config:ts`).
2. Shows lint-staged section header.
3. Sets `SCOPE_COMMIT_MANAGES_LINT_STAGED=1`.
4. Runs `scope-commit --checked-commit` which:
   - Determines scope from staged files.
   - Runs lint-staged.
   - Creates a conventional commit with the computed scope.

**Direct commit (still protected):**

```sh
git add .
git commit -m "feat: add schema for locations"
```

This triggers the pre-commit hook (branch check, filename check, lint-staged) and the commit-msg
hook (commitlint validation).

### 8.4 Lint-Staged Configuration

Defined in `.lintstagedrc.ts` with `packageManager: 'npm'`:

- **TypeScript/JavaScript files**: Handled by the shared config's default rules (prettier + eslint).
- **Markdown files**: Custom override that filters out `.api.md` files, then runs `prettier --write`
  and `markdownlint-cli2 --fix`.

---

## 9. CI/CD — GitHub Actions Workflows

### 9.1 PR Checks (`pr-checks.yml`)

**Triggers**: Pull requests into `main`, manual dispatch. **Concurrency**: One per PR, cancels
in-progress.

Steps:

1. Checkout (merge ref for PRs).
2. Setup Node 20 with npm cache.
3. `npm ci`.
4. `npm run build` (required).
5. `npm run test --if-present`.
6. `npm run docs:build --if-present`.
7. `npm run api:check --if-present`.

Husky is disabled via `HUSKY: 0`.

### 9.2 Push Main (`push-main.yml`)

**Triggers**: Push to `main`. **Concurrency**: Serial (no cancel).

Two-path logic:

**Path 1 — Pending changesets exist:**

1. Detects `.changeset/*.md` files (excluding README.md).
2. Derives a release branch slug from the changeset name(s).
3. Runs `changeset version` to bump versions.
4. Computes a scoped release title via `scope-commit --staged`.
5. Commits and force-pushes to `release/<slug>` branch.
6. Creates or updates a version PR via `gh pr create/edit`.

**Path 2 — No pending changesets (version PR was merged):**

1. Reads version from `package.json`.
2. Skips if version is `0.0.0` or tag already exists.
3. Creates a GitHub Release with `v<version>` tag.

**GH_PAT secret**: Optional but recommended. Without it, the version PR won't trigger PR Checks
automatically (GitHub's built-in token limitation).

### 9.3 Dispatch Pipeline (`dispatch-pipeline.yml`)

**Triggers**: Manual only (`workflow_dispatch`).

Configurable inputs:

- `mode`: `report` or `abort_on_error`
- `check_mode`: `fix`, `check`, or `skip`
- `api_report_mode`: `update`, `check`, or `skip`
- `require_lockfile`, `require_clean_repo`: booleans
- `run_build`, `run_test`, `run_docs_build`: booleans
- `node_version`: `20`, `22`, or `lts/*`
- `npm_cache`: boolean

Calls `call-pipeline.yml` with these inputs.

### 9.4 Dispatch Workspace Update (`dispatch-workspace-update.yml`)

**Triggers**: Manual only, **refuses to run on `main`**.

Purpose: Run fix/docs/api-report routines and commit results back to the current branch.

Inputs:

- `run_fix`, `run_docs`, `run_api_report`: booleans (at least one required)
- `commit_message_type`: `chore`, `style`, `docs`, `build`, `fix`
- `commit_message_subject`: string

### 9.5 Call Pipeline (`call-pipeline.yml`)

Reusable workflow called by dispatch workflows. Contains the full build/check/fix/commit pipeline
logic. Supports:

- Configurable checkout ref.
- Fix mode vs check mode.
- API report generation.
- Automatic commit-if-dirty with scoped commit messages.
- Push to specified branch.

---

## 10. Build & Bundle Pipeline

### 10.1 TypeScript Compilation Order

Always compile in this order:

1. **Config TS** → `npm run build:config:ts` (root config files to JS)
2. **Library TS** → `npm run build:ts` (src to `types/`)
3. **Type check** → `npm run check:ts` (full project validation)

### 10.2 tsdown Bundling

The `tsdown.config.ts` uses `@snailicid3/build-config`:

```typescript
defineBuildPlan(pkg, {
  entries: [
    {
      banner: true,
      key: '*',
      lint: false,
      output_formats: ['esm', 'cjs', 'ts'],
      runtime: 'node',
    },
  ],
  root: { outputDir: './dist', sourceDir: './src' },
})
```

**Output**: `dist/index.mjs` (ESM) and `dist/index.cjs` (CJS).

### 10.3 Package Exports

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
    "./package.json": "./package.json"
  }
}
```

### 10.4 Tiered Build Orchestration (`build:ordered`)

The `scripts/build-ordered.ts` script runs a multi-workspace tiered build:

1. **Tier 0**: `goblin-config` — `npm run build -w goblin-config`
2. **Tier 1**: `goblin-bible` — `npx ts-node goblin-bible/compile.ts`
3. **Tier 2**: `worker-sower` — `npm run boot-check -w worker-sower`

**Failure-halt rule**: If any tier returns non-zero, the sequence halts immediately. No partial
execution of the next tier is allowed.

CLI flags:

- `--repeat N` or `-r N` — repeat the full sequence N times (for determinism proof).

---

## 11. Testing

### 11.1 Running Tests

```sh
npm test           # Full: type-check → vitest run
npm run test:watch # Watch mode
```

### 11.2 Test Organization

Every source module at `src/<module>/index.ts` has a co-located `src/<module>/index.test.ts`.

The root `src/index.test.ts` contains a minimal smoke test.

### 11.3 Cross-Workspace Tests

The vitest config includes `../../campc-it-com/goblin-extract/test.ts` — this validates that
`goblin-extract` is compatible with goblin-lore's compiled schema.

### 11.4 Test Categories

Tests fall into these categories based on the spec hierarchy:

| Category                 | Example modules                                                           | What they prove                           |
| ------------------------ | ------------------------------------------------------------------------- | ----------------------------------------- |
| **Schema compliance**    | `positive-fixture-test`, `per-field-negative-fixture-tests`               | Zod validation catches malformed data     |
| **Relational integrity** | `flagged-reference-acceptance-test`, `unflagged-reference-rejection-test` | Cross-entity references resolve correctly |
| **Determinism**          | `ten-run-determinism-proof`, `byte-identical-reproducibility-test`        | Identical inputs → identical outputs      |
| **Failure handling**     | `failure-halt-proof`, `atomic-write-crash-simulation`                     | Failures propagate, no partial writes     |
| **Performance**          | `performance-benchmark`, `index-lookup-performance-check`                 | Meets throughput SLAs                     |
| **Retirement protocol**  | `lottery-exclusion-test`, `implement-retirement-metadata-validation`      | Retired entities handled correctly        |

---

## 12. Dependencies

### 12.1 Runtime Dependencies

| Package             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `@snailicid3/utils` | Shared utilities (`dateUtils`, `dayjs`, `numeric`) |
| `gray-matter`       | YAML frontmatter extraction from Markdown          |
| `zod`               | Schema validation (v4.x)                           |

### 12.2 Key Dev Dependencies

| Package                    | Purpose                                                                    |
| -------------------------- | -------------------------------------------------------------------------- |
| `@snailicid3/build-config` | tsdown build plan configuration                                            |
| `@snailicid3/config`       | Shared ESLint, Prettier, commitlint, lint-staged, markdownlint, TS configs |
| `@changesets/cli`          | Version management                                                         |
| `@commitlint/cli`          | Conventional commit enforcement                                            |
| `esbuild`                  | JavaScript bundler (used by Vite/tsdown)                                   |
| `eslint`                   | Linting (v9.x flat config)                                                 |
| `husky`                    | Git hooks                                                                  |
| `jiti`                     | TypeScript execution without compilation step                              |
| `knip`                     | Unused dependency/export detection                                         |
| `lint-staged`              | Pre-commit file-scoped linting                                             |
| `markdownlint-cli2`        | Markdown linting                                                           |
| `patch-package`            | Applies patches in `patches/`                                              |
| `prettier`                 | Code formatting                                                            |
| `tsdown`                   | TypeScript bundler (ESM/CJS output)                                        |
| `typescript`               | TypeScript compiler (v6.x)                                                 |
| `unrun`                    | Build utility                                                              |
| `vite`                     | Dev server and bundler                                                     |
| `vitest`                   | Test framework                                                             |

### 12.3 Patches

`patches/@snailicid3+config+0.2.0.patch` — applied automatically via `postinstall`. Do not manually
modify patched files in `node_modules`.

---

## 13. Coding Conventions

### 13.1 TypeScript Rules

1. **ESM imports only** — use `.js` extension for local imports (e.g., `from './module/index.js'`).
2. **Readonly by default** — use `readonly` on type properties and `ReadonlyArray<T>` for arrays.
3. **Explicit return types** — all exported functions must have explicit return types.
4. **No `any`** — use `unknown` and narrow with type guards.
5. **Zod for validation** — all external data boundaries use Zod schemas.
6. **Discriminated unions** — use `z.discriminatedUnion()` for multi-type schemas.

### 13.2 File Naming

- **Source modules**: `kebab-case` directory names matching the spec task name.
- **Config files**: Follow the tool's convention (e.g., `eslint.config.ts`, `.lintstagedrc.ts`).
- **Spec files**: `NNN.XX.YY-TYPE-WS-NNN.XX.YY-<descriptive-name>.md`.
- **Branch names**: `[a-zA-Z0-9]+([/-][a-zA-Z0-9]+)*` — alphanumeric with `/` and `-` separators.
- **Staged filenames**: Only `A-Z a-z 0-9 space . _ - + @ /` allowed.

### 13.3 Commit Messages

Conventional commit format enforced by commitlint:

```text
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `build`, `docs`. Scope: optional (rule
`'scope-empty': [0]`).

### 13.4 Code Style

- **Prettier**: Configured via `@snailicid3/config`, print width 140, prose wrap never.
- **ESLint**: Flat config via `@snailicid3/config`. JS/MJS/CJS files are ignored.
- **Markdownlint**: Line length 160, no heading increment enforcement (MD001 off), HTML allowed
  (MD033 off).

### 13.5 `.gitignore` — Critical Notes

The `.gitignore` ignores **all JS output files** (`*.js`, `*.mjs`, `*.cjs`, `*.d.ts`, `*.d.ts.map`,
etc.) except:

- `bin/**/*.js`, `bin/**/*.mjs`, `bin/**/*.cjs` — un-ignored for vendored scripts.
- `vite-env.d.ts`, `css.d.ts` — un-ignored for Vite type declarations.

This means **compiled JavaScript is never committed**. Only TypeScript source is versioned.

---

## 14. VS Code Configuration

### 14.1 Recommended Extensions

Install all extensions listed in `.vscode/extensions.json`:

- ESLint, Prettier, GitLens, Git Graph, Git History, Copilot, Todo Tree, Bookmarks, Path
  Intellisense, npm Intellisense, YAML, Color Highlight.

### 14.2 Editor Settings

Key settings in `.vscode/settings.json`:

- **TypeScript server memory**: 4096 MB.
- **Automatic type acquisition**: Disabled.
- **Prettier**: prose wrap never, print width 140.
- **ESLint rule customizations**: Several `perfectionist/*`, `import/*`, and `@typescript-eslint/*`
  rules are set to `off` in the editor (they run in CLI).
- **Smooth scrolling**: Disabled for performance.
- **Minimap**: Disabled.

---

## 15. Changeset & Release Workflow

### 15.1 Creating a Changeset

```sh
npm run changeset
```

This uses `gbt-changeset` to create a `.changeset/<name>.md` file describing the change.

### 15.2 Release Flow

1. Developer creates changeset(s) on a feature branch.
2. Feature branch is merged to `main`.
3. **Push Main** workflow detects pending changesets.
4. Workflow runs `changeset version`, commits, and pushes a `release/<slug>` branch.
5. Workflow opens/updates a version PR.
6. Maintainer merges the version PR.
7. **Push Main** workflow detects no pending changesets.
8. Workflow creates a GitHub Release with `v<version>` tag.

### 15.3 Changeset Configuration

```json
{
  "baseBranch": "main",
  "access": "restricted",
  "commit": false,
  "privatePackages": { "version": true, "tag": true }
}
```

---

## 16. Common Agent Tasks — Step-by-Step Recipes

### 16.1 Adding a New Feature Module

1. **Create spec**: Add a `docs/specs/NNN.XX.YY-TASK-WS-NNN.XX.YY-<name>.md` file following the
   template.
2. **Create module directory**: `src/<task-name>/`.
3. **Create implementation**: `src/<task-name>/index.ts` with exports.
4. **Create tests**: `src/<task-name>/index.test.ts` with Vitest tests.
5. **Register export**: Add `export * from './<task-name>/index.js'` to `src/index.ts`.
6. **Type check**: `npm run check:ts`.
7. **Run tests**: `npm test`.
8. **Commit**: `npm run commit:feat -- "implement <task-name>"`.

### 16.2 Modifying a Zod Schema

1. Edit `src/schema-definition-pass/index.ts`.
2. Update any relational modules that reference changed fields.
3. Update negative fixture tests in `src/per-field-negative-fixture-tests/`.
4. Run `npm test` to verify all tests pass.
5. Update the relevant ARTE spec in `docs/specs/` if the change affects the contract.

### 16.3 Running the Full Build Pipeline

```sh
npm run clean # Remove all build artifacts
npm install   # Reinstall (triggers postinstall)
npm run build # Full TypeScript + tsdown build
npm test      # Type check + vitest
npm run check # Full TypeScript + ESLint
```

### 16.4 Fixing Lint/Format Issues

```sh
npm run fix    # Auto-fix everything: format + lint --fix
npm run fix:md # Fix markdown files only
```

### 16.5 Verifying Determinism

```sh
npm run build:ordered -- --repeat 10
```

This runs the full tiered build 10 times. All runs must produce identical output.

### 16.6 Investigating Unused Code

```sh
npm run inspect:dependencies
```

Runs `knip` to find unused dependencies, exports, types, and files.

### 16.7 Debugging TypeScript Config

```sh
npm run check:ts        # Check which files fail type checking
npm run build:config:ts # Ensure config files are compiled
npm run inspect:lint    # Inspect the resolved ESLint flat config
```

---

## 17. Critical Rules — Do Not Violate

1. **npm only** — never use pnpm, yarn, or bun in this repository.
2. **No relative cross-workspace imports** — consume workspace packages via their package name only.
3. **No manual `bible-state.json`** — only the compiler pipeline may produce this artifact.
4. **No runtime Markdown parsing** — downstream consumers must use the compiled JSON artifact.
5. **No custom local lint rules** — all lint config comes from `@snailicid3/config`.
6. **No commits to `master`** — the pre-commit and pre-push hooks block this.
7. **No ad-hoc build scripts** — use the `build:ordered` orchestrator.
8. **Determinism is non-negotiable** — sorted keys, atomic writes, reproducible output.
9. **Every relational field must be covered** — partial relational integrity checking is not
   coverage.
10. **`.js` extensions in imports** — required by ESM. Use `./module/index.js`, not
    `./module/index.ts`.
11. **Build config before lint** — always run `build:config:ts` before any tool that reads `.ts`
    config files.
12. **Test files are co-located** — `index.test.ts` lives next to `index.ts` in every module.
13. **Spec hierarchy is binding** — features not in an Epic's Closed Ledger are unfunded and must
    not be built.
14. **Preserve existing comments** — do not remove comments or docstrings unrelated to your changes.
