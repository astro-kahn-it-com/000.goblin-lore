import { afterEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { atomicWrite } from './index.js'

describe('Implement the Atomic Write', () => {
    const testDir = path.join(
        process.cwd(),
        'src',
        'implement-the-atomic-write',
        '__test_output__',
    )
    const targetFile = path.join(testDir, 'output.json')

    afterEach(async () => {
        try {
            await fs.rm(testDir, { force: true, recursive: true })
        } catch {
            // Ignore
        }
    })

    it('writes content to target file atomically', async () => {
        const content = JSON.stringify({ hello: 'world' }, null, 2)
        await atomicWrite(targetFile, content)

        const readContent = await fs.readFile(targetFile, 'utf-8')
        expect(readContent).toBe(content)
    })

    it('creates missing directories automatically', async () => {
        const nestedFile = path.join(testDir, 'nested', 'deep', 'file.txt')
        await atomicWrite(nestedFile, 'deep content')

        const readContent = await fs.readFile(nestedFile, 'utf-8')
        expect(readContent).toBe('deep content')
    })

    it('overwrites existing target file safely', async () => {
        await atomicWrite(targetFile, 'initial')
        await atomicWrite(targetFile, 'overwritten')

        const readContent = await fs.readFile(targetFile, 'utf-8')
        expect(readContent).toBe('overwritten')
    })
})
