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

        const { activeIndex, fullIndex } = buildRelationalIndex(items)

        expect(fullIndex.size).toBe(2)
        expect(fullIndex.get('char_1')).toBe(items[0])
        expect(fullIndex.get('loc_1')).toBe(items[1])
        expect(fullIndex.has('char_2')).toBe(false)

        expect(activeIndex.size).toBe(2)
    })

    it('excludes retired files from activeIndex', () => {
        const items: Array<ValidationSuccess> = [
            {
                data: { id: 'char_1', name: 'Bog', type: 'character' },
                filePath: 'char_1.md',
                success: true,
            },
            {
                data: { id: 'char_2', name: 'Old Bog', type: 'character' },
                filePath: '_retired/char_2.md',
                success: true,
            },
        ]

        const { activeIndex, fullIndex } = buildRelationalIndex(items)

        expect(fullIndex.size).toBe(2)
        expect(activeIndex.size).toBe(1)
        expect(activeIndex.has('char_1')).toBe(true)
        expect(activeIndex.has('char_2')).toBe(false)
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
