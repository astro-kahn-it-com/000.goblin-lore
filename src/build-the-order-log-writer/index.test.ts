import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {
    createLogEntryFromExecution,
    formatLogFilename,
    formatOrderLogEntries,
    type OrderLogEntry,
    writeOrderLog,
} from './index.js'

describe('Build the Order-Log Writer (TASK-001.03.04)', () => {
    const testLogDir = path.join(__dirname, '__test_logs__')

    beforeEach(() => {
        if (fs.existsSync(testLogDir)) {
            fs.rmSync(testLogDir, { force: true, recursive: true })
        }
    })

    afterEach(() => {
        if (fs.existsSync(testLogDir)) {
            fs.rmSync(testLogDir, { force: true, recursive: true })
        }
    })

    it('formats log filename with timestamp', () => {
        const date = new Date('2026-08-17T20:00:00.000Z')
        const filename = formatLogFilename(date)
        expect(filename).toBe('build-order-2026-08-17T20-00-00.000Z.log')
    })

    it('creates log entry from tier execution result', () => {
        const result = {
            durationMs: 120,
            exitCode: 0,
            stdout: 'Executed goblin-config',
            tier: {
                command: 'npm run build:config',
                description: 'Configuration authority',
                name: 'goblin-config',
                tier: 1,
            },
        }

        const entry = createLogEntryFromExecution(
            result,
            '2026-08-17T20:00:00.000Z',
            '2026-08-17T20:00:00.120Z',
        )

        expect(entry).toEqual({
            command: 'npm run build:config',
            durationMs: 120,
            endTime: '2026-08-17T20:00:00.120Z',
            exitCode: 0,
            name: 'goblin-config',
            startTime: '2026-08-17T20:00:00.000Z',
            tier: 1,
        })
    })

    it('formats order log entries cleanly', () => {
        const entries: Array<OrderLogEntry> = [
            {
                command: 'npm run build:config',
                durationMs: 100,
                endTime: '2026-08-17T20:00:00.100Z',
                exitCode: 0,
                name: 'goblin-config',
                startTime: '2026-08-17T20:00:00.000Z',
                tier: 1,
            },
        ]

        const formatted = formatOrderLogEntries(entries)
        expect(formatted).toContain('BUILD ORDER EXECUTION LOG')
        expect(formatted).toContain('[TIER 1] goblin-config')
        expect(formatted).toContain('Exit Code:  0')
    })

    it('writes order log file to directory', () => {
        const entries: Array<OrderLogEntry> = [
            {
                command: 'npm run build:config',
                durationMs: 50,
                endTime: '2026-08-17T20:00:00.050Z',
                exitCode: 0,
                name: 'goblin-config',
                startTime: '2026-08-17T20:00:00.000Z',
                tier: 1,
            },
        ]

        const timestamp = new Date('2026-08-17T20:00:00.000Z')
        const result = writeOrderLog(entries, testLogDir, timestamp)

        expect(fs.existsSync(result.filepath)).toBe(true)
        const fileContent = fs.readFileSync(result.filepath, 'utf8')
        expect(fileContent).toContain('[TIER 1] goblin-config')
    })
})
