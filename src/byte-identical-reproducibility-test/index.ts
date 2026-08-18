import { serializeDeterministic } from '../implement-the-deterministic-serializer/index.js'
import { generateVersionStamp } from '../implement-version-stamping/index.js'
import type { CompiledState } from '../index-structure-specification/index.js'
import { compileCorpusFiles } from '../positive-fixture-test/index.js'

export function buildCompiledState(
    files: Array<{ content: string; filePath: string }>,
    now?: Date,
): CompiledState {
    const result = compileCorpusFiles(files)
    if (!result.success) {
        throw new Error(`Compiler failed: ${JSON.stringify(result.errors)}`)
    }

    const state: CompiledState = {
        characters: {},
        grievances: {},
        locations: {},
        metadata: generateVersionStamp(files, now),
        possessions: {},
    }

    for (const item of result.activeIndex.values()) {
        const data = item.data
        if (data.type === 'character') {
            state.characters[data.id] = data
        } else if (data.type === 'grievance') {
            state.grievances[data.id] = data
        } else if (data.type === 'location') {
            state.locations[data.id] = data
        } else if (data.type === 'possession') {
            state.possessions[data.id] = data
        }
    }

    return state
}

export function compileAndSerialize(
    files: Array<{ content: string; filePath: string }>,
    now?: Date,
): string {
    const state = buildCompiledState(files, now)
    return serializeDeterministic(state)
}
