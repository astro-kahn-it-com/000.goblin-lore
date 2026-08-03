import { LintStaged, type LintStagedConfig } from '@snailicid3/config'
const config: LintStagedConfig = LintStaged.config({
    cwd: import.meta,
    overrides: {
        '*.md': (staged: ReadonlyArray<string>) => {
            const filtered = staged.filter((f) => !f.endsWith('.api.md'))
            if (filtered.length === 0) return []
            const files = filtered.map((f) => `"${f}"`).join(' ')
            return [
                `npm exec -- prettier --write ${files}`,
                `npm exec -- markdownlint-cli2 --no-globs --fix ${files}`,
            ]
        },
    },
    packageManager: 'npm',
})
export default config
