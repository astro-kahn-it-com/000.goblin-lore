import { Markdownlint } from '@snailicid3/config'
export default Markdownlint.defineConfig(
    Markdownlint.config({
        cwd: import.meta,
        ignores: ['data/**'],
        rules: {
            MD001: false,
            MD013: {
                code_blocks: false,
                line_length: 160,
                tables: false,
            },
            MD028: false,
            MD033: false,
            MD036: false,
            MD041: false,
        },
    }),
)
