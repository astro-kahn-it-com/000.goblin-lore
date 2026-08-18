import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { isRetired } from '../retirement-awareness-logic/index.js'

export type RelationalIndexes = {
    activeIndex: Map<string, ValidationSuccess>
    fullIndex: Map<string, ValidationSuccess>
}

export function buildRelationalIndex(
    corpus: Array<ValidationSuccess>,
): RelationalIndexes {
    const fullIndex = new Map<string, ValidationSuccess>()
    const activeIndex = new Map<string, ValidationSuccess>()

    for (const item of corpus) {
        if (fullIndex.has(item.data.id)) {
            throw new Error(`Duplicate corpus ID found: ${item.data.id}`)
        }
        fullIndex.set(item.data.id, item)
        if (!isRetired(item.filePath)) {
            activeIndex.set(item.data.id, item)
        }
    }

    return { activeIndex, fullIndex }
}
