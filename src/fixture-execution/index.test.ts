import { describe, expect, it } from 'vitest'
import { runFixtureExecutionTest } from './index.js'

describe('FEAT-006.08: Fixture Execution Tests', () => {
    it('verifies CLI messaging for an outdated schema shape (Drift Error)', () => {
        const outdatedFixture = `---
id: CHAR-99
type: legacy_character_v1
name: Old Hero
---
`
        const result = runFixtureExecutionTest([
            { content: outdatedFixture, filePath: 'content/outdated-hero.md' },
        ])

        expect(result.success).toBe(false)
        expect(result.categorizedErrors[0].category).toBe('DRIFT_ERROR')
        expect(result.cliMessages[0]).toContain('[DRIFT_ERROR]')
    })

    it('verifies CLI messaging for a broken pointer (User Error)', () => {
        const brokenPointerFixture = `---
id: CHAR-100
type: character
name: New Hero
location: LOC-NONEXISTENT
---
`
        const result = runFixtureExecutionTest([
            { content: brokenPointerFixture, filePath: 'content/hero-100.md' },
        ])

        expect(result.success).toBe(false)
        expect(result.categorizedErrors[0].category).toBe('USER_ERROR')
        expect(result.cliMessages[0]).toContain('[USER_ERROR]')
        expect(result.cliMessages[0]).toContain('LOC-NONEXISTENT')
    })
})
