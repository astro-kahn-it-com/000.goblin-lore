import { Markdownlint } from '@snailicid3/config'
export default Markdownlint.defineConfig(
    Markdownlint.config({
        cwd: import.meta,
        ignores: ['data/**'],
        rules: {
            MD013: false,
            MD028: false,
            MD033: false,
            MD041: false,
        },
    }),
)
