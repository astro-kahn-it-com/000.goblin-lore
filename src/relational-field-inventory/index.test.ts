import { describe, expect, it } from 'vitest'
import { AllRelationalFields, RelationalFieldsBySchema } from './index.js'

describe('Relational Field Inventory', () => {
    it('contains the expected relational fields for characters', () => {
        expect(RelationalFieldsBySchema.character).toContain('location')
        expect(RelationalFieldsBySchema.character).toContain(
            'linked_grievances',
        )
        expect(RelationalFieldsBySchema.character).toContain(
            'linked_possessions',
        )
    })

    it('contains the expected relational fields for locations', () => {
        expect(RelationalFieldsBySchema.location).toContain('participants')
        expect(RelationalFieldsBySchema.location).toContain('linked_grievances')
        expect(RelationalFieldsBySchema.location).toContain(
            'linked_possessions',
        )
    })

    it('contains the expected relational fields for grievances', () => {
        expect(RelationalFieldsBySchema.grievance).toContain('owner')
        expect(RelationalFieldsBySchema.grievance).toContain('participants')
        expect(RelationalFieldsBySchema.grievance).toContain('location')
    })

    it('contains the expected relational fields for possessions', () => {
        expect(RelationalFieldsBySchema.possession).toContain('owner')
        expect(RelationalFieldsBySchema.possession).toContain('location')
    })

    it('has a unified list of all relational fields', () => {
        expect(AllRelationalFields).toContain('owner')
        expect(AllRelationalFields).toContain('participants')
        expect(AllRelationalFields).toContain('location')
        expect(AllRelationalFields).toContain('linked_grievances')
        expect(AllRelationalFields).toContain('linked_possessions')
        expect(AllRelationalFields.length).toBe(5)
    })
})
