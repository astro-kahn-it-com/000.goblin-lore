import { describe, expect, it } from 'vitest'
import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { buildRelationalIndex } from '../implement-the-relational-index-builder/index.js'
import { executePass2 } from './index.js'

describe('Pass 2 Relational Integrity', () => {
    it('succeeds when all relational pointers resolve to valid active IDs', () => {
        const corpus: Array<ValidationSuccess> = [
            {
                data: { id: 'loc_1', name: 'Swamp', type: 'location' },
                filePath: 'loc_1.md',
                success: true,
            },
            {
                data: {
                    id: 'char_1',
                    location: 'loc_1',
                    name: 'Bog',
                    type: 'character',
                },
                filePath: 'char_1.md',
                success: true,
            },
            {
                data: {
                    id: 'griev_1',
                    name: 'Muddy',
                    participants: ['char_1'],
                    type: 'grievance',
                },
                filePath: 'griev_1.md',
                success: true,
            },
        ]
        const index = buildRelationalIndex(corpus)
        const result = executePass2(corpus, index)

        expect(result.success).toBe(true)
    })

    it('fails with specific errors when a pointer does not resolve', () => {
        const corpus: Array<ValidationSuccess> = [
            {
                data: {
                    id: 'char_1',
                    location: 'loc_1',
                    name: 'Bog',
                    type: 'character',
                },
                filePath: 'char_1.md',
                success: true,
            },
            {
                data: {
                    id: 'char_2',
                    linked_possessions: ['poss_1'],
                    name: 'Frog',
                    type: 'character',
                },
                filePath: 'char_2.md',
                success: true,
            },
        ]
        const index = buildRelationalIndex(corpus)
        const result = executePass2(corpus, index)

        expect(result.success).toBe(false)
        expect((result as any).errors).toEqual(
            expect.arrayContaining([
                {
                    field: 'location',
                    missingTargetId: 'loc_1',
                    sourceId: 'char_1',
                },
                {
                    field: 'linked_possessions',
                    missingTargetId: 'poss_1',
                    sourceId: 'char_2',
                },
            ]),
        )
    })

    it('fails when an active file references a retired file without historical_reference flag', () => {
        const corpus: Array<ValidationSuccess> = [
            {
                data: { id: 'loc_1', name: 'Swamp', type: 'location' },
                filePath: '_retired/loc_1.md',
                success: true,
            },
            {
                data: {
                    id: 'char_1',
                    location: 'loc_1',
                    name: 'Bog',
                    type: 'character',
                },
                filePath: 'char_1.md',
                success: true,
            },
        ]
        const index = buildRelationalIndex(corpus)
        const result = executePass2(corpus, index)

        expect(result.success).toBe(false)
        expect((result as any).errors).toEqual(
            expect.arrayContaining([
                {
                    field: 'location',
                    missingTargetId: 'loc_1',
                    reason: 'Target is retired and no historical_reference flag is present',
                    sourceId: 'char_1',
                },
            ]),
        )
    })

    it('succeeds when an active file references a retired file WITH historical_reference flag', () => {
        const corpus: Array<ValidationSuccess> = [
            {
                data: { id: 'loc_1', name: 'Swamp', type: 'location' },
                filePath: '_retired/loc_1.md',
                success: true,
            },
            {
                data: {
                    historical_reference: true,
                    id: 'char_1',
                    location: 'loc_1',
                    name: 'Bog',
                    type: 'character',
                } as any,
                filePath: 'char_1.md',
                success: true,
            },
        ]
        const index = buildRelationalIndex(corpus)
        const result = executePass2(corpus, index)

        expect(result.success).toBe(true)
    })
})
