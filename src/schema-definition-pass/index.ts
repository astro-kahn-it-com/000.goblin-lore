import { z } from 'zod'

export const CharacterSchema = z.object({
    historical_reference: z.boolean().optional(),
    id: z.string(),
    linked_grievances: z.array(z.string()).optional(),
    linked_possessions: z.array(z.string()).optional(),
    location: z.string().optional(),
    name: z.string(),
    type: z.literal('character'),
})

export const LocationSchema = z.object({
    historical_reference: z.boolean().optional(),
    id: z.string(),
    linked_grievances: z.array(z.string()).optional(),
    linked_possessions: z.array(z.string()).optional(),
    name: z.string(),
    participants: z.array(z.string()).optional(),
    type: z.literal('location'),
})

export const GrievanceSchema = z.object({
    historical_reference: z.boolean().optional(),
    id: z.string(),
    location: z.string().optional(),
    name: z.string(),
    owner: z.string().optional(),
    participants: z.array(z.string()).optional(),
    type: z.literal('grievance'),
})

export const PossessionSchema = z.object({
    historical_reference: z.boolean().optional(),
    id: z.string(),
    location: z.string().optional(),
    name: z.string(),
    owner: z.string().optional(),
    type: z.literal('possession'),
})

export const AnyCorpusSchema = z.discriminatedUnion('type', [
    CharacterSchema,
    LocationSchema,
    GrievanceSchema,
    PossessionSchema,
])

export type AnyCorpus = z.infer<typeof AnyCorpusSchema>
export type Character = z.infer<typeof CharacterSchema>
export type Grievance = z.infer<typeof GrievanceSchema>
export type Location = z.infer<typeof LocationSchema>
export type Possession = z.infer<typeof PossessionSchema>
