import { describe, expect, it } from 'vitest'
import { serializeDeterministic } from './index.js'

describe('Deterministic Serializer', () => {
    it('serializes objects deterministically regardless of insertion order', () => {
        const objA: Record<string, unknown> = {}
        objA.zulu = 1
        objA.bravo = 'hello'
        objA.alpha = [3, 1, 2]

        const objB: Record<string, unknown> = {}
        objB.alpha = [3, 1, 2]
        objB.zulu = 1
        objB.bravo = 'hello'

        const jsonA = serializeDeterministic(objA)
        const jsonB = serializeDeterministic(objB)

        expect(jsonA).toBe(jsonB)

        // It should match the exact formatted string sorted by keys
        const expected = JSON.stringify(
            {
                alpha: [3, 1, 2],
                bravo: 'hello',
                zulu: 1,
            },
            null,
            2,
        )

        expect(jsonA).toBe(expected)
    })

    it('can use custom spacing', () => {
        const obj = { a: 1, b: 2 }
        const json0 = serializeDeterministic(obj, 0)
        expect(json0).toBe('{"a":1,"b":2}')

        const json4 = serializeDeterministic(obj, 4)
        expect(json4).toBe('{\n    "a": 1,\n    "b": 2\n}')
    })
})
