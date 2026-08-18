import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { executeCleanRoomSingleRun, validateTierOrdering } from './index.js'

describe('Clean-Room Single-Run Proof (TASK-001.03.06)', () => {
    const testDir = path.join(__dirname, '__test_clean_room__')
    const testLogDir = path.join(testDir, 'logs')

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { force: true, recursive: true })
        }
        fs.mkdirSync(testDir, { recursive: true })
    })

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { force: true, recursive: true })
        }
    })

    it('validates tier ordering sequence', () => {
        const validEntries = [
            {
                command: 'cmd1',
                durationMs: 10,
                endTime: 'iso',
                exitCode: 0,
                name: 't1',
                startTime: 'iso',
                tier: 1,
            },
            {
                command: 'cmd2',
                durationMs: 10,
                endTime: 'iso',
                exitCode: 0,
                name: 't2',
                startTime: 'iso',
                tier: 2,
            },
            {
                command: 'cmd3',
                durationMs: 10,
                endTime: 'iso',
                exitCode: 0,
                name: 't3',
                startTime: 'iso',
                tier: 3,
            },
        ]

        expect(validateTierOrdering(validEntries)).toBe(true)
    })

    it('rejects out-of-order or failing tier entries', () => {
        const failingEntries = [
            {
                command: 'cmd1',
                durationMs: 10,
                endTime: 'iso',
                exitCode: 1,
                name: 't1',
                startTime: 'iso',
                tier: 1,
            },
        ]
        expect(validateTierOrdering(failingEntries)).toBe(false)
    })

    it('executes clean-room single run proof successfully', () => {
        const report = executeCleanRoomSingleRun({
            cwd: testDir,
            isDryRun: true,
            logDir: testLogDir,
        })

        expect(report.exitCode).toBe(0)
        expect(report.success).toBe(true)
        expect(report.tierSequenceValid).toBe(true)
        expect(report.logEntries.length).toBe(3)
        expect(fs.existsSync(report.logFilepath)).toBe(true)
    })
})
