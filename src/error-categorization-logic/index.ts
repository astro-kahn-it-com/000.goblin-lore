export type CategorizedError = {
    category: ErrorCategory
    description: string
    fieldPath?: string
    message: string
}

export type ErrorCategory = 'DRIFT_ERROR' | 'USER_ERROR'

export function categorizeValidationError(
    errorMessage: string,
    fieldPath?: string,
): CategorizedError {
    const normalized = errorMessage.toLowerCase()

    // Heuristics:
    // Schema key/type discriminator issues -> DRIFT_ERROR
    // Invalid pointer/value formats -> USER_ERROR
    const isDrift =
        normalized.includes('invalid_type') ||
        normalized.includes('unrecognized') ||
        normalized.includes('invalid discriminator') ||
        normalized.includes('schema key') ||
        normalized.includes("type 'invalid") ||
        (fieldPath !== undefined &&
            (fieldPath === 'type' || fieldPath === 'id'))

    const category: ErrorCategory = isDrift ? 'DRIFT_ERROR' : 'USER_ERROR'

    return {
        category,
        description:
            category === 'DRIFT_ERROR'
                ? 'Outdated or drifted schema shape (changed/missing schema key)'
                : 'Malformed user value or invalid reference pointer',
        fieldPath,
        message: errorMessage,
    }
}
