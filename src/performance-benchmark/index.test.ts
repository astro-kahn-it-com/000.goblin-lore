import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { compileCorpusFiles } from '../positive-fixture-test/index.js'

describe('Performance Benchmark', () => {
    it('compiles 50 interdependent corpus files within the performance budget (< 12.5ms per file)', () => {
        const fileCount = 50
        const corpus = []

        // Add a single root location to anchor them
        corpus.push({
            content: `---
id: loc_root
type: location
name: Root Location
---
Body`,
            filePath: 'root_loc.md',
        })

        // Generate remaining files: Characters, Possessions, and Grievances
        for (let i = 0; i < fileCount; i++) {
            const iStr = String(i)
            corpus.push({
                content: `---
id: char_${iStr}
type: character
name: Char ${iStr}
location: loc_root
---
Body`,
                filePath: `char_${iStr}.md`,
            })

            corpus.push({
                content: `---
id: poss_${iStr}
type: possession
name: Poss ${iStr}
owner: char_${iStr}
location: loc_root
---
Body`,
                filePath: `poss_${iStr}.md`,
            })

            corpus.push({
                content: `---
id: griev_${iStr}
type: grievance
name: Griev ${iStr}
owner: char_${iStr}
participants: [char_${iStr}]
location: loc_root
---
Body`,
                filePath: `griev_${iStr}.md`,
            })
        }

        const totalFiles = corpus.length

        const start = performance.now()
        const result = compileCorpusFiles(corpus)
        const end = performance.now()

        const totalTimeMs = end - start
        const timePerFileMs = totalTimeMs / totalFiles

        expect(result.success).toBe(true)
        expect(result.errors).toHaveLength(0)

        // The spec requires < 12.5ms per file.
        // Console log the benchmark result so it's visible in the test output.
        console.log(
            `Benchmark: Compiled ${String(totalFiles)} files in ${totalTimeMs.toFixed(2)}ms (${timePerFileMs.toFixed(2)}ms per file)`,
        )

        expect(timePerFileMs).toBeLessThan(12.5)
    })
})
