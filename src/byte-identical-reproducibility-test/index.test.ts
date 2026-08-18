import { describe, expect, it } from 'vitest'
import { compileAndSerialize } from './index.js'

describe('Byte-Identical Reproducibility Test', () => {
    it('produces byte-identical outputs across multiple compiler runs on the same corpus', () => {
        // A minimal corpus fixture covering all types and relations
        const corpus = [
            {
                content:
                    '---\n' +
                    'type: location\n' +
                    'id: loc_swamp\n' +
                    'name: The Dismal Swamp\n' +
                    '---\n',
                filePath: 'loc/swamp.md',
            },
            {
                content:
                    '---\n' +
                    'type: character\n' +
                    'id: char_bog\n' +
                    'name: Bog the Goblin\n' +
                    'location: loc_swamp\n' +
                    '---\n',
                filePath: 'char/bog.md',
            },
            {
                content:
                    '---\n' +
                    'type: possession\n' +
                    'id: poss_stick\n' +
                    'name: Pointy Stick\n' +
                    'owner: char_bog\n' +
                    '---\n',
                filePath: 'poss/stick.md',
            },
            {
                content:
                    '---\n' +
                    'type: grievance\n' +
                    'id: griev_stolen\n' +
                    'name: Stole my stick\n' +
                    'owner: char_bog\n' +
                    '---\n',
                filePath: 'griev/stolen.md',
            },
        ]

        // Freeze time so compiledAt does not cause divergence across loop iterations
        const frozenNow = new Date('2026-01-01T12:00:00Z')

        // Ensure stability by explicitly un-ordering the corpus in one run
        // vs standard order in another, representing different file read sequences.
        const run1 = compileAndSerialize(corpus, frozenNow)

        for (let i = 0; i < 10; i++) {
            // Shuffle the corpus slightly to mimic random FS readdir returns
            const shuffledCorpus = [...corpus].sort(() => Math.random() - 0.5)
            const runNext = compileAndSerialize(shuffledCorpus, frozenNow)

            // Output must be exactly, byte-for-byte identical
            expect(runNext).toBe(run1)
        }
    })
})
