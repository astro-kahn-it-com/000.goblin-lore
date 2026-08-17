import { describe, expect, it } from 'vitest'
import {
    BUILD_SEQUENCE,
    getBuildSequence,
    getTierByLevel,
    validateSequenceOrder,
} from './index.js'

describe('Sequence Specification (TASK-001.03.01)', () => {
    it('defines the correct 3 tier boundaries in sequence order', () => {
        const sequence = getBuildSequence()
        expect(sequence).toHaveLength(3)
        expect(sequence[0].name).toBe('goblin-config')
        expect(sequence[1].name).toBe('goblin-bible')
        expect(sequence[2].name).toBe('worker-sower')
    })

    it('contains valid execution commands for each tier', () => {
        expect(BUILD_SEQUENCE[0].command).toBe('npm run build -w goblin-config')
        expect(BUILD_SEQUENCE[1].command).toBe(
            'npx ts-node goblin-bible/compile.ts',
        )
        expect(BUILD_SEQUENCE[2].command).toBe(
            'npm run check:boot-readiness -w worker-sower',
        )
    })

    it('retrieves tier by level correctly', () => {
        const tier1 = getTierByLevel(1)
        expect(tier1?.name).toBe('goblin-config')
        const invalidTier = getTierByLevel(99)
        expect(invalidTier).toBeUndefined()
    })

    it('validates sequence order correctness', () => {
        expect(
            validateSequenceOrder([
                'goblin-config',
                'goblin-bible',
                'worker-sower',
            ]),
        ).toBe(true)
        expect(
            validateSequenceOrder([
                'goblin-bible',
                'goblin-config',
                'worker-sower',
            ]),
        ).toBe(false)
        expect(validateSequenceOrder(['goblin-config'])).toBe(false)
    })
})
