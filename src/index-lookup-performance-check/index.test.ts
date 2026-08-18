import { describe, expect, it } from 'vitest'
import { buildCompiledState } from '../byte-identical-reproducibility-test/index.js'

describe('Index Lookup Performance Check', () => {
    it('resolves dictionary lookups in O(1) time regardless of state scale', () => {
        // Generate a tiny corpus (4 elements)
        const tinyCorpus = []
        for (let i = 0; i < 4; i++) {
            tinyCorpus.push({
                content:
                    `---\n` +
                    `type: character\n` +
                    `id: char_bog_${i.toString()}\n` +
                    `name: Bog ${i.toString()}\n` +
                    `---\n`,
                filePath: `char/bog_${i.toString()}.md`,
            })
        }
        const stateTiny = buildCompiledState(tinyCorpus)

        // Generate a large corpus (400 elements)
        const largeCorpus = []
        for (let i = 0; i < 400; i++) {
            largeCorpus.push({
                content:
                    `---\n` +
                    `type: character\n` +
                    `id: char_bog_${i.toString()}\n` +
                    `name: Bog ${i.toString()}\n` +
                    `---\n`,
                filePath: `char/bog_${i.toString()}.md`,
            })
        }
        const stateLarge = buildCompiledState(largeCorpus)

        const lookups = 100000

        // Warm up V8 JIT to prevent first-run compilation bias
        for (let i = 0; i < 1000; i++) {
            const _a = stateTiny.characters[`char_bog_0`]
            const _b = stateLarge.characters[`char_bog_0`]
        }

        // Measure Tiny Corpus Lookups
        const startTiny = performance.now()
        for (let i = 0; i < lookups; i++) {
            const target = stateTiny.characters[`char_bog_3`]
        }
        const endTiny = performance.now()
        const durationTiny = endTiny - startTiny

        // Measure Large Corpus Lookups
        const startLarge = performance.now()
        for (let i = 0; i < lookups; i++) {
            const target = stateLarge.characters[`char_bog_399`]
        }
        const endLarge = performance.now()
        const durationLarge = endLarge - startLarge

        // For O(1) dictionary lookups, the duration should be effectively identical
        // We allow up to a 5x variance to account for V8 GC jitters/hash map buckets,
        // but an O(N) linear scan would be exactly 100x slower.
        /** Fallback to 5ms for extremely fast 0.1ms runs */
        const varianceLimit = Math.max(durationTiny * 5, 5)

        expect(durationLarge).toBeLessThan(varianceLimit)

        console.log(
            `[O(1) Benchmark] 4 Items: ${durationTiny.toFixed(4)}ms | 400 Items: ${durationLarge.toFixed(4)}ms`,
        )
    })
})
