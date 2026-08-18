import { describe, expect, it } from 'vitest'
import { checkRetiredReference } from './index.js'

describe('Historical-Reference Exception Check', () => {
    it('returns an error if target is retired and source lacks exception flag', () => {
        const result = checkRetiredReference('_retired/loc_1.md', {})
        expect(result).toBe(
            'Target is retired and no historical_reference flag is present',
        )
    })

    it('returns undefined if target is retired and source HAS exception flag', () => {
        const result = checkRetiredReference('_retired/loc_1.md', {
            historical_reference: true,
        })
        expect(result).toBeUndefined()
    })

    it('returns undefined if target is active (not retired) regardless of flag', () => {
        expect(checkRetiredReference('loc_1.md', {})).toBeUndefined()
        expect(
            checkRetiredReference('loc_1.md', { historical_reference: true }),
        ).toBeUndefined()
    })
})
