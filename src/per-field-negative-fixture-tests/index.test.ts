import { describe, expect, it } from 'vitest'
import { compileCorpusFiles } from '../positive-fixture-test/index.js'

describe('Per-Field Negative Fixture Tests', () => {
    describe('Character Schema Relational Fields', () => {
        it('fails when location is missing', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: char_1
type: character
name: Bog
location: loc_missing
---
Body`,
                    filePath: 'char_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('char_1')
            expect((result.errors[0] as any).field).toBe('location')
            expect((result.errors[0] as any).missingTargetId).toBe(
                'loc_missing',
            )
        })

        it('fails when linked_grievances points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: char_1
type: character
name: Bog
linked_grievances: [griev_missing]
---
Body`,
                    filePath: 'char_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('char_1')
            expect((result.errors[0] as any).field).toBe('linked_grievances')
        })

        it('fails when linked_possessions points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: char_1
type: character
name: Bog
linked_possessions: [poss_missing]
---
Body`,
                    filePath: 'char_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('char_1')
            expect((result.errors[0] as any).field).toBe('linked_possessions')
        })
    })

    describe('Location Schema Relational Fields', () => {
        it('fails when participants points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: loc_1
type: location
name: Swamp
participants: [char_missing]
---
Body`,
                    filePath: 'loc_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('loc_1')
            expect((result.errors[0] as any).field).toBe('participants')
        })

        it('fails when linked_grievances points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: loc_1
type: location
name: Swamp
linked_grievances: [griev_missing]
---
Body`,
                    filePath: 'loc_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('loc_1')
            expect((result.errors[0] as any).field).toBe('linked_grievances')
        })

        it('fails when linked_possessions points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: loc_1
type: location
name: Swamp
linked_possessions: [poss_missing]
---
Body`,
                    filePath: 'loc_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('loc_1')
            expect((result.errors[0] as any).field).toBe('linked_possessions')
        })
    })

    describe('Grievance Schema Relational Fields', () => {
        it('fails when owner points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: griev_1
type: grievance
name: Stolen Stick
owner: char_missing
---
Body`,
                    filePath: 'griev_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('griev_1')
            expect((result.errors[0] as any).field).toBe('owner')
        })

        it('fails when participants points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: griev_1
type: grievance
name: Stolen Stick
participants: [char_missing]
---
Body`,
                    filePath: 'griev_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('griev_1')
            expect((result.errors[0] as any).field).toBe('participants')
        })

        it('fails when location points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: griev_1
type: grievance
name: Stolen Stick
location: loc_missing
---
Body`,
                    filePath: 'griev_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('griev_1')
            expect((result.errors[0] as any).field).toBe('location')
        })
    })

    describe('Possession Schema Relational Fields', () => {
        it('fails when owner points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: poss_1
type: possession
name: Stick
owner: char_missing
---
Body`,
                    filePath: 'poss_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('poss_1')
            expect((result.errors[0] as any).field).toBe('owner')
        })

        it('fails when location points to missing target', () => {
            const result = compileCorpusFiles([
                {
                    content: `---
id: poss_1
type: possession
name: Stick
location: loc_missing
---
Body`,
                    filePath: 'poss_1.md',
                },
            ])
            expect(result.success).toBe(false)
            expect((result.errors[0] as any).sourceId).toBe('poss_1')
            expect((result.errors[0] as any).field).toBe('location')
        })
    })
})
