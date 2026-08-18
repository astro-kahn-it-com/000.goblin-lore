import { describe, expect, it } from 'vitest'
import { generateVersionStamp } from './index.js'

describe('Implement Version Stamping', () => {
    it('generates a deterministic hash regardless of file array order', () => {
        const filesA = [
            { content: 'hello a', filePath: 'a.md' },
            { content: 'hello b', filePath: 'b.md' },
        ]

        const filesB = [
            { content: 'hello b', filePath: 'b.md' },
            { content: 'hello a', filePath: 'a.md' },
        ]

        const stampA = generateVersionStamp(filesA)
        const stampB = generateVersionStamp(filesB)

        expect(stampA.corpusHash).toBe(stampB.corpusHash)
    })

    it('generates a different hash if content changes', () => {
        const stampA = generateVersionStamp([
            { content: 'hello a', filePath: 'a.md' },
        ])
        const stampB = generateVersionStamp([
            { content: 'hello b', filePath: 'a.md' },
        ])

        expect(stampA.corpusHash).not.toBe(stampB.corpusHash)
    })

    it('generates a different hash if filePath changes', () => {
        const stampA = generateVersionStamp([
            { content: 'hello', filePath: 'a.md' },
        ])
        const stampB = generateVersionStamp([
            { content: 'hello', filePath: 'b.md' },
        ])

        expect(stampA.corpusHash).not.toBe(stampB.corpusHash)
    })

    it('uses the provided Date object for compiledAt', () => {
        const now = new Date('2026-01-01T12:00:00Z')
        const stamp = generateVersionStamp([], now)
        expect(stamp.compiledAt).toBe('2026-01-01T12:00:00.000Z')
    })

    it('uses current Date if no Date object is provided', () => {
        const before = new Date()
        const stamp = generateVersionStamp([])
        const after = new Date()
        const stampDate = new Date(stamp.compiledAt)

        expect(stampDate.getTime()).toBeGreaterThanOrEqual(before.getTime())
        expect(stampDate.getTime()).toBeLessThanOrEqual(after.getTime())
    })
})
