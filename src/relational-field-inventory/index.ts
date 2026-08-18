export const RelationalFieldsBySchema = {
    character: ['location', 'linked_grievances', 'linked_possessions'],
    faction: ['leader', 'members', 'location'],
    grievance: ['owner', 'participants', 'location'],
    location: ['participants', 'linked_grievances', 'linked_possessions'],
    possession: ['owner', 'location'],
} as const

export const AllRelationalFields = [
    'owner',
    'participants',
    'location',
    'linked_grievances',
    'linked_possessions',
    'leader',
    'members',
] as const

export type RelationalField = (typeof AllRelationalFields)[number]
