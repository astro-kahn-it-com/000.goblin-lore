import { describe, expect, it } from 'vitest'
import { categorizeValidationError } from './index.js'

describe('FEAT-006.08: Error Categorization Logic', () => {
    it('categorizes invalid discriminator/type failures as DRIFT_ERROR', () => {
        const result = categorizeValidationError(
            "Invalid type tag: 'invalid_type'",
            'type',
        )
        expect(result.category).toBe('DRIFT_ERROR')
        expect(result.description).toContain('Outdated or drifted schema shape')
    })

    it('categorizes malformed user value or missing pointer failures as USER_ERROR', () => {
        const result = categorizeValidationError(
            "Missing target 'NON_EXISTENT_ID' on field 'owner'",
            'owner',
        )
        expect(result.category).toBe('USER_ERROR')
        expect(result.description).toContain('Malformed user value')
    })
})
