import { describe, expect, it } from 'vitest'
import { executeOrderedBuild, parseRepeatFlag } from './index.js'

describe('Build the Ordered Script (TASK-001.03.03)', () => {
    it('parses --repeat N flag correctly', () => {
        expect(parseRepeatFlag(['--repeat', '5'])).toBe(5)
        expect(parseRepeatFlag(['-r', '10'])).toBe(10)
        expect(parseRepeatFlag(['--repeat=3'])).toBe(3)
        expect(parseRepeatFlag([])).toBe(1)
        expect(parseRepeatFlag(['--other'])).toBe(1)
    })

    it('executes single ordered build successfully', () => {
        const result = executeOrderedBuild({ isDryRun: true })
        expect(result.totalRuns).toBe(1)
        expect(result.runs).toHaveLength(1)
        expect(result.runs[0].completedTiers).toHaveLength(3)
        expect(result.runs[0].success).toBe(true)
    })

    it('executes repeated ordered builds when repeatCount > 1', () => {
        const result = executeOrderedBuild({ isDryRun: true, repeatCount: 3 })
        expect(result.totalRuns).toBe(3)
        expect(result.runs).toHaveLength(3)
        expect(result.runs[0].runIndex).toBe(1)
        expect(result.runs[2].runIndex).toBe(3)
    })
})
