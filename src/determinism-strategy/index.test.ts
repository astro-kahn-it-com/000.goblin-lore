import { describe, expect, it } from 'vitest'
import { deterministicSortKeys } from './index.js'

describe('Determinism Strategy: Key Sorting', () => {
    it('sorts keys alphabetically', () => {
        const obj = { a: 1, b: 2, c: 3 }
        const sorted = deterministicSortKeys(obj)
        expect(Object.keys(sorted)).toEqual(['a', 'b', 'c'])
        expect(sorted).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('sorts keys recursively', () => {
        const obj = {
            x: [{ a: 1, b: 2 }],
            y: {
                a: 1,
                b: 2,
                c: 3,
            },
            z: 1,
        }

        const sorted = deterministicSortKeys(obj)
        expect(Object.keys(sorted)).toEqual(['x', 'y', 'z'])
        expect(Object.keys((sorted as any).y)).toEqual(['a', 'b', 'c'])
        expect(Object.keys((sorted as any).x[0])).toEqual(['a', 'b'])
    })

    it('handles null, arrays, and primitives seamlessly', () => {
        expect(deterministicSortKeys(null)).toBeNull()
        expect(deterministicSortKeys('string')).toBe('string')
        expect(deterministicSortKeys(42)).toBe(42)

        const arr = [3, 2, 1]
        const sortedArr = deterministicSortKeys(arr)
        // Arrays themselves shouldn't have their elements sorted, just their objects inside
        expect(sortedArr).toEqual([3, 2, 1])
    })

    it('produces byte-identical JSON strings for identical data with different insertion orders', () => {
        const objA: Record<string, number> = {}
        objA.alpha = 1
        objA.bravo = 2
        objA.charlie = 3

        const objB: Record<string, number> = {}
        objB.charlie = 3
        objB.alpha = 1
        objB.bravo = 2

        // Even though they have different insertion orders
        expect(JSON.stringify(objA)).not.toBe(JSON.stringify(objB))

        // When deterministically sorted, they produce byte-identical JSON
        const sortedA = deterministicSortKeys(objA)
        const sortedB = deterministicSortKeys(objB)

        expect(JSON.stringify(sortedA)).toBe(JSON.stringify(sortedB))
    })
})
