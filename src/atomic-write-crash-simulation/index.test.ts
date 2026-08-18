import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import { simulateAtomicWriteCrash } from './index.js'

const TEST_DIR = path.join(__dirname, '../../temp-crash-test')
const TARGET_FILE = path.join(TEST_DIR, 'bible-state.json')

describe('Atomic Write Crash Simulation', () => {
    beforeEach(async () => {
        await fs.rm(TEST_DIR, { force: true, recursive: true })
        await fs.mkdir(TEST_DIR, { recursive: true })
    })

    afterEach(async () => {
        await fs.rm(TEST_DIR, { force: true, recursive: true })
    })

    it('guarantees no partial file is created if process is killed mid-write when file does not exist', async () => {
        /** 5MB string payload */
        const largePayload = 'X'.repeat(1024 * 1024 * 5)

        const result = await simulateAtomicWriteCrash({
            content: largePayload,
            delayMs: 200,
            targetFilePath: TARGET_FILE,
        })

        expect(result.killed).toBe(true)

        // Verify the target bible-state.json file does NOT exist
        const exists = await fs
            .access(TARGET_FILE)
            .then(() => true)
            .catch(() => false)
        expect(exists).toBe(false)
    })

    it('guarantees original file content remains intact if process is killed mid-write when file already exists', async () => {
        const ORIGINAL_CONTENT = JSON.stringify({
            status: 'VALID_PRIOR_STATE',
            version: '1.0.0',
        })
        await fs.writeFile(TARGET_FILE, ORIGINAL_CONTENT, 'utf-8')

        const newCorruptedPayload = 'CORRUPTED_NEW_DATA_PAYLOAD_'.repeat(100000)

        const result = await simulateAtomicWriteCrash({
            content: newCorruptedPayload,
            delayMs: 200,
            targetFilePath: TARGET_FILE,
        })

        expect(result.killed).toBe(true)

        // Verify the target file exists AND still contains the exact original content without corruption
        const currentContent = await fs.readFile(TARGET_FILE, 'utf-8')
        expect(currentContent).toBe(ORIGINAL_CONTENT)
    })
})
