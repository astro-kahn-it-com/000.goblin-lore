export function hasHistoricalReferenceFlag(
    data: Record<string, unknown>,
): boolean {
    return data.historical_reference === true
}

export function isRetired(filePath: string): boolean {
    return filePath.includes('_retired/') || filePath.includes('\\_retired\\')
}
