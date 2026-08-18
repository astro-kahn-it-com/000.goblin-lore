import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { RelationalFieldsBySchema } from '../relational-field-inventory/index.js'
import {
    hasHistoricalReferenceFlag,
    isRetired,
} from '../retirement-awareness-logic/index.js'

export type Pass2Failure = {
    errors: Array<{
        field: string
        missingTargetId: string
        reason?: string
        sourceId: string
    }>
    success: false
}

export type Pass2Result = Pass2Failure | Pass2Success

export type Pass2Success = {
    success: true
}

export function executePass2(
    corpus: Array<ValidationSuccess>,
    index: Map<string, ValidationSuccess>,
): Pass2Result {
    const errors: Pass2Failure['errors'] = []

    for (const item of corpus) {
        const data = item.data
        const relationalFields = RelationalFieldsBySchema[data.type]

        for (const field of relationalFields) {
            const value = (data as Record<string, unknown>)[field]
            if (!value) continue

            if (Array.isArray(value)) {
                for (const targetId of value) {
                    if (typeof targetId === 'string') {
                        const target = index.get(targetId)
                        if (!target) {
                            errors.push({
                                field,
                                missingTargetId: targetId,
                                sourceId: data.id,
                            })
                        } else if (
                            isRetired(target.filePath) &&
                            !hasHistoricalReferenceFlag(data)
                        ) {
                            errors.push({
                                field,
                                missingTargetId: targetId,
                                reason: 'Target is retired and no historical_reference flag is present',
                                sourceId: data.id,
                            })
                        }
                    }
                }
            } else if (typeof value === 'string') {
                const target = index.get(value)
                if (!target) {
                    errors.push({
                        field,
                        missingTargetId: value,
                        sourceId: data.id,
                    })
                } else if (
                    isRetired(target.filePath) &&
                    !hasHistoricalReferenceFlag(data)
                ) {
                    errors.push({
                        field,
                        missingTargetId: value,
                        reason: 'Target is retired and no historical_reference flag is present',
                        sourceId: data.id,
                    })
                }
            }
        }
    }

    if (errors.length > 0) {
        return { errors, success: false }
    }

    return { success: true }
}
