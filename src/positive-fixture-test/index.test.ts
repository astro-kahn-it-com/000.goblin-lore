import { describe, expect, it } from 'vitest'
import { compileCorpusFiles } from './index.js'

describe('Positive Fixture Test', () => {
    it('compiles a fully valid corpus fixture across all four schema types successfully', () => {
        const validCorpus = [
            {
                content: `---
id: loc_swamp
type: location
name: The Murky Swamp
participants: [char_bog]
---
Body`,
                filePath: 'location_swamp.md',
            },
            {
                content: `---
id: char_bog
type: character
name: Bog
location: loc_swamp
linked_possessions: [poss_stick]
linked_grievances: [griev_stolen_stick]
---
Body`,
                filePath: 'character_bog.md',
            },
            {
                content: `---
id: poss_stick
type: possession
name: The Good Stick
owner: char_bog
location: loc_swamp
---
Body`,
                filePath: 'possession_stick.md',
            },
            {
                content: `---
id: griev_stolen_stick
type: grievance
name: Stole my stick
owner: char_bog
participants: [char_bog]
location: loc_swamp
---
Body`,
                filePath: 'grievance_stolen_stick.md',
            },
        ]

        const result = compileCorpusFiles(validCorpus)
        expect(result.success).toBe(true)
        expect(result.errors).toHaveLength(0)
    })
})
