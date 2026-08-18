import { describe, expect, it } from 'vitest'
import { validateRetirementMetadata } from './index.js'

describe('Retirement Metadata Validation', () => {
    it('fails when a file in _retired/ lacks retirement_reason', () => {
        const result = validateRetirementMetadata('_retired/grievance_1.md', {
            id: 'griev_1',
            type: 'grievance',
        })
        expect(result).toBe(
            "Retired file requires a non-empty 'retirement_reason' field",
        )
    })

    it('fails when a file in _retired/ has empty or whitespace retirement_reason', () => {
        const result = validateRetirementMetadata('_retired/grievance_1.md', {
            id: 'griev_1',
            retirement_reason: '   ',
            type: 'grievance',
        })
        expect(result).toBe(
            "Retired file requires a non-empty 'retirement_reason' field",
        )
    })

    it('succeeds when a file in _retired/ has a valid retirement_reason', () => {
        const result = validateRetirementMetadata('_retired/grievance_1.md', {
            id: 'griev_1',
            retirement_reason: 'Plot arc resolved in Season 2',
            type: 'grievance',
        })
        expect(result).toBeUndefined()
    })

    it('succeeds for active files even without retirement_reason', () => {
        const result = validateRetirementMetadata('grievance_1.md', {
            id: 'griev_1',
            type: 'grievance',
        })
        expect(result).toBeUndefined()
    })
})
