import { describe, expect, it } from 'vitest'
import { compileCorpusFiles } from '../positive-fixture-test/index.js'

describe('Flagged Reference Acceptance Test', () => {
    it('succeeds compilation if an active character references a retired grievance WITH the historical flag', () => {
        const files = [
            {
                content: `---
id: active_1
name: Active Character
type: character
historical_reference: true
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

        // The compiler should succeed because the active file explicitly bypasses the check
        // by declaring historical_reference: true
        expect(result.success).toBe(true)
        if (!result.success) {
            console.error('Unexpected compilation errors:', result.errors)
        }
    })
})
