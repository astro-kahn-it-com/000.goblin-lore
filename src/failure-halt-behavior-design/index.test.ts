import { describe, expect, it } from 'vitest'
import { getTierByLevel } from '../sequence-specification/index.js'
import {
    assertTierSuccess,
    createFailureHaltReport,
    FailureHaltError,
    shouldHaltPipeline,
    type TierExecutionResult,
} from './index.js'

describe('Failure-Halt Behavior Design (TASK-001.03.02)', () => {
    const tier1 = getTierByLevel(1)
    if (!tier1) {
        throw new Error('Tier 1 missing from sequence specification')
    }

    it('identifies successful tier execution without halting', () => {
        const successResult: TierExecutionResult = {
            durationMs: 120,
            exitCode: 0,
            stdout: 'Build succeeded',
            tier: tier1,
        }

        expect(shouldHaltPipeline(successResult)).toBe(false)
        expect(() => {
            assertTierSuccess(successResult)
        }).not.toThrow()
    })

    it('detects failed tier execution and triggers pipeline halt', () => {
        const failureResult: TierExecutionResult = {
            durationMs: 45,
            exitCode: 1,
            stdout: 'Compilation error',
            tier: tier1,
        }

        expect(shouldHaltPipeline(failureResult)).toBe(true)
        expect(() => {
            assertTierSuccess(failureResult)
        }).toThrow(FailureHaltError)
    })

    it('creates structured failure halt report with correct metadata', () => {
        const report = createFailureHaltReport(
            tier1,
            1,
            'Syntax error in config',
        )
        expect(report.exitCode).toBe(1)
        expect(report.failedTier.name).toBe('goblin-config')
        expect(report.reason).toBe('Syntax error in config')
        expect(typeof report.timestamp).toBe('string')
    })
})
