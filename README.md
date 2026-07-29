# @snailicid3/consumer-npm 🐌

[![GitHub release](https://img.shields.io/github/v/release/gbtunney/snailicid3-consumer-npm?include_prereleases&sort=semver)](https://github.com/gbtunney/snailicid3-consumer-npm/releases)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

_Cloneable npm consumer and library template for the snailicid3 configuration packages._

---

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

This repository demonstrates a standalone npm consumer using the shared
[`@snailicid3/config`](https://www.npmjs.com/package/@snailicid3/config) presets. It builds a
TypeScript library with Vite, emits declarations with TypeScript, tests with Vitest, and includes
the shared linting, formatting, commit, and Git-hook workflows.

> [**IMPORTANT!**] This boilerplate is npm-only. Its scripts, lockfile, lifecycle hooks, patches,
> and package-manager integration are intentionally configured for npm; do not substitute pnpm or
> Yarn in this repository.

## Other consumer example repos for [![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](http://pnpm.io)

- [`@snailicid3/consumer-monorepo`](https://github.com/gbtunney/snailicid3-consumer-monorepo):
  Monorepo boilerplate
- [`@snailicid3/consumer-library`](https://github.com/gbtunney/snailicid3-consumer-library):
  single-library boilerplate, currently a **WIP**

### TODO

- [ ] Add a parallel tsdown library build using `@snailicid3/build-config`.
- [ ] Verify tsdown and its native dependencies on macOS Catalina before replacing the working Vite
      library build.
- [ ] Add the `@snailicid3/build-config` GitHub Release badge when that integration is active.
- [ ] Actions from other setup.
- [ ] Add API Extractor configuration with API report and API compatibility-check scripts.
- [ ] Add a TypeDoc demo generated from the public `src/index.ts` exports.

## Usage - fork and clone

```sh
git clone https://github.com/gbtunney/snailicid3-consumer-npm.git
cd snailicid3-consumer-npm
npm install
```

Turn the clone into a different repository:

```sh
git remote rename origin upstream
git remote add origin https://github.com/OWNER/REPOSITORY.git
```

### macOS Catalina

If a normal install fails while loading a native esbuild binary, run the included two-stage
installer:

```sh
./install-catalina.sh
```

This installs dependencies without lifecycle scripts first, then runs a normal install after the
Catalina-compatible binary and patch tooling are available.

## Library structure

```text
.
├── src/
│   ├── index.ts
│   └── index.test.ts
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.config.json
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

- `tsconfig.json` silently checks root TypeScript, library source, and test files.
- `tsconfig.build.json` emits library JavaScript and declarations into `types/`.
- `tsconfig.config.json` emits the root configuration files that must run as JavaScript.
- Vite bundles the public entry as ESM and CommonJS in `dist/`.
- Vitest checks the library independently of the build.

## Commands

```sh
npm run build # TypeScript configs, declarations, and Vite library bundles
npm test      # Silent typecheck followed by Vitest
npm run check # TypeScript build/check and ESLint
npm run fix   # Format and apply lint fixes
npm run clean # Remove TypeScript state and generated outputs
npm run dev   # Typecheck, build declarations, and start Vite
```

The checked commit workflow composes a scoped conventional commit and runs `lint-staged` once:

```sh
npm run commit:feat -- "add a feature"
npm run commit:fix -- "correct a bug"
npm run commit:chore -- "update tooling"
```

Direct `git commit` calls remain protected by the Husky pre-commit hook.

## Shared configuration

[![config release](https://img.shields.io/github/v/release/gbtunney/snailicid3?filter=%40snailicid3%2Fconfig%40*&label=%40snailicid3%2Fconfig&sort=semver)](https://github.com/gbtunney/snailicid3/releases?q=%40snailicid3%2Fconfig)

The clone consumes `@snailicid3/config` for:

- ESLint flat configuration
- Prettier options
- markdownlint rules
- commitlint conventions
- lint-staged configuration
- TypeScript `typecheck` and `library` presets
- shell utilities used by the Git hooks

All configuration builders receive `cwd: import.meta` so paths resolve relative to the consumer
configuration file.

### ESLint

```ts
// eslint.config.ts
import { EsLint } from '@snailicid3/config'

const config = EsLint.config({
  cwd: import.meta,
  overrides: [{ settings: { 'import-x/ignore': ['node_modules'] } }],
})

export default EsLint.defineConfig(config)
```

Additional flat-config entries can be supplied through `overrides`, while the shared defaults remain
intact.

### Prettier

```ts
// prettier.config.ts
import { Prettier, type PrettierTool } from '@snailicid3/config'

const config: PrettierTool['config'] = Prettier.defineConfig(Prettier.config({ cwd: import.meta }))

export default config
```

### Markdownlint

```ts
// .markdownlint-cli2.mts
import { Markdownlint } from '@snailicid3/config'

export default Markdownlint.defineConfig(Markdownlint.config({ cwd: import.meta }))
```

### Lint-staged

Set `packageManager: 'npm'` so commands generated by the shared configuration use `npm exec --`
rather than the default pnpm runner.

```ts
// .lintstagedrc.mts
import { LintStaged, type LintStagedConfig } from '@snailicid3/config'

const config: LintStagedConfig = LintStaged.config({
  cwd: import.meta,
  packageManager: 'npm',
})

export default config
```

### Commitlint

```ts
// commitlint.config.ts
import { Commitlint, type CommitlintConfig } from '@snailicid3/config'

const config: CommitlintConfig = Commitlint.defineConfig(
  Commitlint.config({
    cwd: import.meta,
    overrides: {
      rules: {
        'scope-empty': [0],
      },
    },
  }),
)

export default config
```

### Type checking

```json5
{
  extends: '@snailicid3/config/tsconfig.typecheck',
  exclude: ['./node_modules'],
  files: ['package.json'],
  include: [
    './*.ts',
    './*.cts',
    './*.mts',
    './src/**/*.ts',
    './src/**/*.cts',
    './src/**/*.mts',
    './**/*.test.ts',
    './**/*.test.mts',
    './**/*.test.cts',
  ],
}
```

### Library output

```json5
{
  extends: '@snailicid3/config/tsconfig.library',
  include: ['./src/**/*.ts', './src/**/*.cts', './src/**/*.mts'],
  exclude: ['**/*.test.ts', '**/*.test.mts', '**/*.test.cts'],
  compilerOptions: {
    outDir: './types',
  },
}
```

## Output

A successful build produces:

```text
dist/
├── index.cjs
└── index.mjs

types/
├── index.d.ts
├── index.d.ts.map
├── index.js
└── index.js.map
```

The package exports map supports both ESM `import` and CommonJS `require`.

## Repository

- [GitHub repository](https://github.com/gbtunney/snailicid3-consumer-npm)
- [Releases](https://github.com/gbtunney/snailicid3-consumer-npm/releases)
- [`@snailicid3/config`](https://github.com/gbtunney/snailicid3/tree/main/packages/config)

## Author

Gillian Tunney

- [GitHub](https://github.com/gbtunney)
- [Email](mailto:gbtunney@mac.com)
