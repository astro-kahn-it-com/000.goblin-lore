import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { getTierByLevel } from '../sequence-specification/index.js'
import { executeFailureHaltProof, executeSimulatedTier } from './index.js'

describe('Failure-Halt Proof (TASK-001.03.07)', () => {
    const testDir = path.join(__dirname, '__test_failure_halt__')

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

    it('simulates tier execution failure when tier level matches failing tier', () => {
        const tier1 = getTierByLevel(1)
        expect(tier1).toBeDefined()
        if (!tier1) {
            throw new Error('Tier 1 missing')
        }
        const res = executeSimulatedTier(tier1, 1)
        expect(res.exitCode).toBe(1)
        expect(res.stdout).toContain('FAILURE SIMULATION')
    })

    it('executes failure-halt proof: halts at Tier 1 and skips downstream tiers', () => {
        const report = executeFailureHaltProof({
            failingTierLevel: 1,
            logDir: testDir,
        })

        expect(report.success).toBe(true)
        expect(report.haltedAtTier).toBe(1)
        expect(report.laterTiersAttempted).toBe(0)
        expect(report.logEntries).toHaveLength(1)
        expect(report.logEntries[0].tier).toBe(1)
        expect(report.logEntries[0].exitCode).toBe(1)
        expect(report.caughtError).toContain('Pipeline halted at Tier 1')
        expect(fs.existsSync(report.logFilepath)).toBe(true)
    })
})
