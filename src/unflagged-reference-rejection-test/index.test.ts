import { describe, expect, it } from 'vitest'
import { compileCorpusFiles } from '../positive-fixture-test/index.js'

describe('Unflagged Reference Rejection Test', () => {
    it('hard-fails compilation if an active grievance references a retired grievance without the historical flag', () => {
        const files = [
            {
                content: `---
id: active_1
name: Active Character
type: character
linked_grievances:
  - retired_1
---`,
                filePath: 'characters/active_1.md',
            },
            {
                content: `---
id: retired_1
name: Retired Grievance
type: grievance
retirement_reason: Plot resolved
---`,
                filePath: '_retired/retired_1.md',
            },
        ]

        const result = compileCorpusFiles(files)

        // The compiler should hard-fail
        expect(result.success).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)

        // Find the specific Pass 2 relational error
        const hasExpectedError = result.errors.some(
            (error: unknown) =>
                typeof error === 'object' &&
                error !== null &&
                (error as Record<string, unknown>).sourceId === 'active_1' &&
                (error as Record<string, unknown>).missingTargetId ===
                    'retired_1' &&
                (error as Record<string, unknown>).reason ===
                    'Target is retired and no historical_reference flag is present',
        )

        expect(hasExpectedError).toBe(true)
    })
})
