import { isRetired } from '../retirement-awareness-logic/index.js'

export function validateRetirementMetadata(
    filePath: string,
    data: Record<string, unknown>,
): string | undefined {
    if (isRetired(filePath)) {
        if (
            typeof data.retirement_reason !== 'string' ||
            data.retirement_reason.trim() === ''
        ) {
            return "Retired file requires a non-empty 'retirement_reason' field"
        }
    }
    return undefined
}
