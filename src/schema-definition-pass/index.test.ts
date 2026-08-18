import { describe, expect, it } from 'vitest'
import {
    AnyCorpusSchema,
    CharacterSchema,
    GrievanceSchema,
    LocationSchema,
    PossessionSchema,
} from './index.js'

describe('Schema Definition Pass', () => {
    it('validates a correct character', () => {
        const data = {
            id: 'char_1',
            linked_grievances: ['griev_1'],
            location: 'loc_1',
            name: 'Bog',
            type: 'character',
        }
        const result = CharacterSchema.safeParse(data)
        expect(result.success).toBe(true)
    })

    it('validates a correct grievance', () => {
        const data = {
            id: 'griev_1',
            name: 'Spoon Credit',
            owner: 'char_1',
            participants: ['char_2'],
            type: 'grievance',
        }
        const result = GrievanceSchema.safeParse(data)
        expect(result.success).toBe(true)
    })

    it('validates a correct location', () => {
        const data = {
            id: 'loc_1',
            name: 'The Swamp',
            type: 'location',
        }
        const result = LocationSchema.safeParse(data)
        expect(result.success).toBe(true)
    })

    it('validates a correct possession', () => {
        const data = {
            id: 'poss_1',
            name: 'Shiny Spoon',
            owner: 'char_1',
            type: 'possession',
        }
        const result = PossessionSchema.safeParse(data)
        expect(result.success).toBe(true)
    })

    it('fails on invalid data', () => {
        const data = {
            id: 'char_1',
            type: 'character',
            // Missing name
        }
        const result = AnyCorpusSchema.safeParse(data)
        expect(result.success).toBe(false)
    })
})
