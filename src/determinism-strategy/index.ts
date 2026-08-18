export function deterministicSortKeys<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deterministicSortKeys(item)) as unknown as T
    }

    const sortedObj: Record<string, unknown> = {}
    const keys = Object.keys(obj).sort()

    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortedObj[key] = deterministicSortKeys((obj as any)[key])
    }

    return sortedObj as T
}
