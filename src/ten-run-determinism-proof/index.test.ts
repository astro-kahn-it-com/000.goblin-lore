import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { executeTenRunDeterminismProof, normalizeLogContent } from './index.js'

describe('Ten-Run Determinism Proof (TASK-001.03.08)', () => {
    const testDir = path.join(__dirname, '__test_ten_run__')

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

    it('normalizes log content by stripping variable timestamp and duration lines', () => {
        const rawLog = [
            '================================================================================',
            ' BUILD ORDER EXECUTION LOG',
            ' Timestamp: 2026-08-17T20:00:00.000Z',
            ' Total Entries: 1',
            '================================================================================',
            '[TIER 1] goblin-config',
            '  Command:    npm run build:config',
            '  Start Time: 2026-08-17T20:00:00.000Z',
            '  End Time:   2026-08-17T20:00:00.100Z',
            '  Duration:   100ms',
            '  Exit Code:  0',
            '--------------------------------------------------------------------------------',
        ].join('\n')

        const normalized = normalizeLogContent(rawLog)
        expect(normalized).not.toContain('Timestamp:')
        expect(normalized).not.toContain('Start Time:')
        expect(normalized).not.toContain('End Time:')
        expect(normalized).not.toContain('Duration:')
        expect(normalized).toContain('[TIER 1] goblin-config')
        expect(normalized).toContain('Exit Code:  0')
    })

    it('executes 10-run determinism proof and verifies byte-for-byte structural identity', () => {
        const report = executeTenRunDeterminismProof({
            isDryRun: true,
            logDir: testDir,
            repeatCount: 10,
        })

        expect(report.exitCode).toBe(0)
        expect(report.isStructurallyIdentical).toBe(true)
        expect(report.totalRuns).toBe(10)
        expect(report.logFilepaths).toHaveLength(10)
        expect(fs.existsSync(report.logFilepaths[0])).toBe(true)
    })
})
