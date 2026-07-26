import { Commitlint, type CommitlintConfig } from '@snailicid3/config'

const configuration: CommitlintConfig = Commitlint.defineConfig(
    Commitlint.config({
        cwd: import.meta,
        overrides: {
            rules: {
                'scope-empty': [0],
            },
        },
    }),
)

export default configuration
