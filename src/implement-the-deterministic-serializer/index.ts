import { deterministicSortKeys } from '../determinism-strategy/index.js'

/**
 * Deterministically serializes an object to JSON. It recursively sorts keys alphabetically to guarantee byte-identical
 * output across runs, and uses 4-space or 2-space indentation.
 *
 * @param obj The object to serialize
 * @param space The indentation string or number of spaces (defaults to 2)
 * @returns The deterministically serialized JSON string
 */
export function serializeDeterministic<T>(
    obj: T,
    space: number | string = 2,
): string {
    const sortedObj = deterministicSortKeys(obj)
    return JSON.stringify(sortedObj, null, space)
}
