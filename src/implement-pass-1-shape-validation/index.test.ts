import { describe, expect, it } from 'vitest'
import { validateCorpusFile } from './index.js'

describe('Pass 1 Shape Validation', () => {
    it('validates a correct markdown file with frontmatter', () => {
        const fileContent = `---
id: char_1
type: character
name: Bog
location: loc_1
---
Some body content here
`
        const result = validateCorpusFile('bog.md', fileContent)
        expect(result.success).toBe(true)
        expect((result as any).data.id).toBe('char_1')
        expect((result as any).data.name).toBe('Bog')
    })

    it('fails on missing required frontmatter fields', () => {
        const fileContent = `---
id: char_2
type: character
---
Body without name
`
        const result = validateCorpusFile('nameless.md', fileContent)
        expect(result.success).toBe(false)
        expect((result as any).error).toContain("Field 'name' - ")
        expect((result as any).filePath).toBe('nameless.md')
    })

    it('fails on completely malformed frontmatter', () => {
        const fileContent = `---
id: char_3
type: something_else
---
Body
`
        const result = validateCorpusFile('bad.md', fileContent)
        expect(result.success).toBe(false)
        expect((result as any).error).toContain('Schema validation failed:')
    })
})
