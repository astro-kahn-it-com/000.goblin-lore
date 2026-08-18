import {
    validateCorpusFile,
    type ValidationResult,
    type ValidationSuccess,
} from '../implement-pass-1-shape-validation/index.js'
import {
    executePass2,
    type Pass2Result,
} from '../implement-pass-2-relational-integrity/index.js'
import { buildRelationalIndex } from '../implement-the-relational-index-builder/index.js'

export type FileInput = {
    content: string
    filePath: string
}

export type TwoPassResult = {
    errors: Array<string>
    pass1Results: Array<ValidationResult>
    pass2Result: null | Pass2Result
    success: boolean
}

export function executeTwoPassInvocation(
    files: Array<FileInput>,
    existingCorpus: Array<ValidationSuccess> = [],
): TwoPassResult {
    const pass1Results: Array<ValidationResult> = []
    const errors: Array<string> = []
    const updatedCorpus: Array<ValidationSuccess> = [...existingCorpus]

    // Pass 1: Shape Validation
    for (const file of files) {
        const res = validateCorpusFile(file.filePath, file.content)
        pass1Results.push(res)
        if (!res.success) {
            errors.push(`Pass 1 error in ${file.filePath}: ${res.error}`)
        } else {
            const idx = updatedCorpus.findIndex(
                (item) => item.filePath === file.filePath,
            )
            if (idx >= 0) {
                updatedCorpus[idx] = res
            } else {
                updatedCorpus.push(res)
            }
        }
    }

    if (errors.length > 0) {
        return {
            errors,
            pass1Results,
            pass2Result: null,
            success: false,
        }
    }

    // Pass 2: Relational Integrity Validation
    let indexes
    try {
        indexes = buildRelationalIndex(updatedCorpus)
    } catch (err: unknown) {
        return {
            errors: [
                `Index build error: ${err instanceof Error ? err.message : String(err)}`,
            ],
            pass1Results,
            pass2Result: null,
            success: false,
        }
    }

    const pass2Res = executePass2(updatedCorpus, indexes.fullIndex)
    if (!pass2Res.success) {
        for (const err of pass2Res.errors) {
            errors.push(
                `Pass 2 error in ${err.sourceId}: missing target '${err.missingTargetId}' on field '${err.field}'${err.reason ? ` (${err.reason})` : ''}`,
            )
        }
    }

    return {
        errors,
        pass1Results,
        pass2Result: pass2Res,
        success: errors.length === 0,
    }
}
