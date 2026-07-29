import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['@snailicid3/utils', 'react', 'react-dom'],
        },
    },
    plugins: [react()],
})
