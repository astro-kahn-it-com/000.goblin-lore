export type MechanicFieldSpec = {
    fields: Array<string>
    mechanicName: string
}

export const REGISTERED_RELEASE_MECHANICS: Array<MechanicFieldSpec> = [
    {
        fields: ['false_relief', 'next_climb_start_offset'],
        mechanicName: 'NearMiss',
    },
    { fields: ['scar_tissue'], mechanicName: 'RelationalCatharsis' },
]
