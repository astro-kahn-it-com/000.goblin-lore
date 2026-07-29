import { EsLint } from '@snailicid3/config'
const CONFIG = EsLint.config({
    cwd: import.meta,
    overrides: [
        {
            //Todo:This is infuriating wtf.
            ignores: ['*.js', '*.mjs', '*.cjs'],
        },
    ],
})
export default EsLint.defineConfig(CONFIG)
