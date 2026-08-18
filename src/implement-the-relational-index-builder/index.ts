import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'

export function buildRelationalIndex(
    corpus: Array<ValidationSuccess>,
): Map<string, ValidationSuccess> {
    const index = new Map<string, ValidationSuccess>()

    for (const item of corpus) {
        if (index.has(item.data.id)) {
            throw new Error(`Duplicate corpus ID found: ${item.data.id}`)
        }
        index.set(item.data.id, item)
    }

    return index
}
