import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/scratch/**',
        ],
        include: [
            '**/*.{test,spec}.?(c|m)[jt]s?(x)',
            '**/test.ts',
            '../../campc-it-com/goblin-extract/test.ts',
        ],
    },
})
