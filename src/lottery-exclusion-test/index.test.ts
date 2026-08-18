import { describe, expect, it } from 'vitest'
import { buildCompiledState } from '../byte-identical-reproducibility-test/index.js'

describe('Lottery Exclusion Test', () => {
    it('omits retired grievances from the compiled Stage 3 candidate pool', () => {
        const files = [
            {
                content: `---
id: active_1
name: Active Grievance
type: grievance
---`,
                filePath: 'grievances/active_1.md',
            },
            {
                content: `---
id: retired_1
name: Retired Grievance
type: grievance
retirement_reason: Resolved
---`,
                filePath: '_retired/retired_1.md',
            },
        ]

        const state = buildCompiledState(files)

        // The active grievance should be in the compiled state
        expect(state.grievances['active_1']).toBeDefined()
        expect(state.grievances['active_1']?.id).toBe('active_1')

        // The retired grievance must NOT appear in the compiled state (Stage 3 candidate pool)
        expect(state.grievances['retired_1']).toBeUndefined()
    })
})
