import { validateCorpusFile } from '../implement-pass-1-shape-validation/index.js'
import { executePass2 } from '../implement-pass-2-relational-integrity/index.js'
import { buildRelationalIndex } from '../implement-the-relational-index-builder/index.js'

export type CompilerResult = {
    errors: Array<unknown>
    success: boolean
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
    let index
    try {
        index = buildRelationalIndex(parsedFiles)
    } catch (err) {
        return { errors: [err], success: false }
    }

    // Pass 2: Relational Integrity
    const pass2Result = executePass2(parsedFiles, index)
    if (!pass2Result.success) {
        return { errors: pass2Result.errors, success: false }
    }

    return { errors: [], success: true }
}
