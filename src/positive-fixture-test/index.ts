import { validateCorpusFile } from '../implement-pass-1-shape-validation/index.js'
import type { ValidationSuccess } from '../implement-pass-1-shape-validation/index.js'
import { executePass2 } from '../implement-pass-2-relational-integrity/index.js'
import { buildRelationalIndex } from '../implement-the-relational-index-builder/index.js'

export type CompilerFailure = {
    errors: Array<unknown>
    success: false
}

export type CompilerResult = CompilerFailure | CompilerSuccess

export type CompilerSuccess = {
    activeIndex: Map<string, ValidationSuccess>
    errors: []
    fullIndex: Map<string, ValidationSuccess>
    success: true
}

export function compileCorpusFiles(
    files: Array<{ content: string; filePath: string }>,
): CompilerResult {
    const parsedFiles = []
    const errors: Array<unknown> = []

    // Pass 1: Shape Validation
    for (const file of files) {
        const result = validateCorpusFile(file.filePath, file.content)
        if (!result.success) {
            errors.push(result)
        } else {
            parsedFiles.push(result)
        }
    }

    if (errors.length > 0) {
        return { errors, success: false }
    }

    // Relational Index Builder
    let fullIndex
    let activeIndex
    try {
        const indexes = buildRelationalIndex(parsedFiles)
        fullIndex = indexes.fullIndex
        activeIndex = indexes.activeIndex
    } catch (err) {
        return { errors: [err], success: false }
    }

    // Pass 2: Relational Integrity
    const pass2Result = executePass2(parsedFiles, fullIndex)
    if (!pass2Result.success) {
        return { errors: pass2Result.errors, success: false }
    }

    return { activeIndex, errors: [], fullIndex, success: true }
}
