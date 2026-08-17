/** Sequence Specification for Tiered Compile Orchestration (FEAT-001.03) */

export type CompileTier = {
    /** Exact CLI command executed to build or verify this tier */
    command: string
    /** Detailed description of tier responsibility */
    description: string
    /** Name of the package / component in this tier */
    name: string
    /** 1-based numerical index representing execution order */
    tier: number
}

/**
 * Strict sequence definition of tier boundaries and execution commands. Sequence order: goblin-config → goblin-bible →
 * worker-sower
 */
export const BUILD_SEQUENCE: ReadonlyArray<CompileTier> = Object.freeze([
    {
        command: 'npm run build -w goblin-config',
        description:
            'Compiles configuration schemas and foundational governance rules.',
        name: 'goblin-config',
        tier: 1,
    },
    {
        command: 'npx ts-node goblin-bible/compile.ts',
        description:
            'Compiles primary corpus data consuming Tier 1 goblin-config artifacts.',
        name: 'goblin-bible',
        tier: 2,
    },
    {
        command: 'npm run check:boot-readiness -w worker-sower',
        description:
            'Executes boot-readiness check ensuring valid compiled state exists.',
        name: 'worker-sower',
        tier: 3,
    },
])

/** Returns the immutable list of build tiers in sequence order. */
export function getBuildSequence(): ReadonlyArray<CompileTier> {
    return BUILD_SEQUENCE
}

/** Retrieves a specific tier definition by its 1-based level. */
export function getTierByLevel(level: number): CompileTier | undefined {
    return BUILD_SEQUENCE.find((t) => t.tier === level)
}

/** Validates that an array of tier names follows the exact sequence order. */
export function validateSequenceOrder(
    tierNames: ReadonlyArray<string>,
): boolean {
    if (tierNames.length !== BUILD_SEQUENCE.length) {
        return false
    }
    return tierNames.every((name, index) => name === BUILD_SEQUENCE[index].name)
}
