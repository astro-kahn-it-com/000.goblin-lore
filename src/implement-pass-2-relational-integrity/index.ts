import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { checkRetiredReference } from '../implement-the-historical-reference-exception-check/index.js'
import { RelationalFieldsBySchema } from '../relational-field-inventory/index.js'

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
                        } else {
                            const retiredError = checkRetiredReference(
                                target.filePath,
                                data,
                            )
                            if (retiredError) {
                                errors.push({
                                    field,
                                    missingTargetId: targetId,
                                    reason: retiredError,
                                    sourceId: data.id,
                                })
                            }
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
                } else {
                    const retiredError = checkRetiredReference(
                        target.filePath,
                        data,
                    )
                    if (retiredError) {
                        errors.push({
                            field,
                            missingTargetId: value,
                            reason: retiredError,
                            sourceId: data.id,
                        })
                    }
                }
            }
        }
    }

    if (errors.length > 0) {
        return { errors, success: false }
    }

    return { success: true }
}
