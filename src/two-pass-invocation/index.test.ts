import { describe, expect, it } from 'vitest'
import { executeTwoPassInvocation } from './index.js'

describe('FEAT-006.08: Two-Pass Invocation Pipeline', () => {
    it('executes both pass 1 and pass 2 successfully for valid edited files', () => {
        const fileContent = `---
id: GR-101
type: grievance
name: Test Grievance
---
`
        const result = executeTwoPassInvocation([
            { content: fileContent, filePath: 'content/grievance-101.md' },
        ])

        expect(result.success).toBe(true)
        expect(result.pass1Results.length).toBe(1)
        expect(result.pass1Results[0].success).toBe(true)
        expect(result.pass2Result?.success).toBe(true)
        expect(result.errors).toHaveLength(0)
    })

    it('halts and returns pass 1 error if frontmatter/schema validation fails', () => {
        const invalidContent = `---
id: GR-102
type: invalid_type
---
`
        const result = executeTwoPassInvocation([
            { content: invalidContent, filePath: 'content/invalid.md' },
        ])

        expect(result.success).toBe(false)
        expect(result.pass1Results[0].success).toBe(false)
        expect(result.pass2Result).toBeNull()
        expect(result.errors.length).toBeGreaterThan(0)
    })
})
