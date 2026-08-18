import { z } from 'zod'
import {
    CharacterSchema,
    GrievanceSchema,
    LocationSchema,
    PossessionSchema,
} from '../schema-definition-pass/index.js'

export const CompiledStateMetadataSchema = z.object({
    compiledAt: z.string(), // ISO 8601 timestamp
    corpusHash: z.string(), // SHA-256 of sorted source contents
})

export const CompiledStateSchema = z.object({
    characters: z.record(z.string(), CharacterSchema),
    grievances: z.record(z.string(), GrievanceSchema),
    locations: z.record(z.string(), LocationSchema),
    metadata: CompiledStateMetadataSchema,
    possessions: z.record(z.string(), PossessionSchema),
})

export type CompiledState = z.infer<typeof CompiledStateSchema>
export type CompiledStateMetadata = z.infer<typeof CompiledStateMetadataSchema>

// Re-export the entity types for convenience

export {
    type Character,
    type Grievance,
    type Location,
    type Possession,
} from '../schema-definition-pass/index.js'
