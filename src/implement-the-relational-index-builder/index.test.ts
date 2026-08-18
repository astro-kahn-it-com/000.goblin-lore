import { describe, expect, it } from 'vitest'
import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { buildRelationalIndex } from './index.js'

describe('Relational Index Builder', () => {
    it('builds an O(1) lookup map from valid corpus items', () => {
        const items: Array<ValidationSuccess> = [
            {
                data: { id: 'char_1', name: 'Bog', type: 'character' },
                filePath: 'char_1.md',
                success: true,
            },
            {
                data: { id: 'loc_1', name: 'Swamp', type: 'location' },
                filePath: 'loc_1.md',
                success: true,
            },
        ]

        const index = buildRelationalIndex(items)

        expect(index.size).toBe(2)
        expect(index.get('char_1')).toBe(items[0])
        expect(index.get('loc_1')).toBe(items[1])
        expect(index.has('char_2')).toBe(false)
    })

    it('throws an error on duplicate IDs', () => {
        const items: Array<ValidationSuccess> = [
            {
                data: { id: 'char_1', name: 'Bog', type: 'character' },
                filePath: 'char_1.md',
                success: true,
            },
            {
                data: { id: 'char_1', name: 'Clone', type: 'character' },
                filePath: 'char_1_clone.md',
                success: true,
            },
        ]

        expect(() => buildRelationalIndex(items)).toThrow(
            'Duplicate corpus ID found: char_1',
        )
    })
})
