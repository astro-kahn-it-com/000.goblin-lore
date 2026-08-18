import {
    type CategorizedError,
    categorizeValidationError,
} from '../error-categorization-logic/index.js'
import {
    executeTwoPassInvocation,
    type FileInput,
} from '../two-pass-invocation/index.js'

export type FixtureExecutionResult = {
    categorizedErrors: Array<CategorizedError>
    cliMessages: Array<string>
    success: boolean
}

export function runFixtureExecutionTest(
    files: Array<FileInput>,
): FixtureExecutionResult {
    const result = executeTwoPassInvocation(files)
    const categorizedErrors: Array<CategorizedError> = []
    const cliMessages: Array<string> = []

    if (!result.success) {
        for (const err of result.errors) {
            const fieldMatch = err.match(/on field '([^']+)'/)
            const fieldPath = fieldMatch ? fieldMatch[1] : undefined
            const categorized = categorizeValidationError(err, fieldPath)
            categorizedErrors.push(categorized)
            cliMessages.push(`[${categorized.category}] ${err}`)
        }
    }

    return {
        categorizedErrors,
        cliMessages,
        success: result.success,
    }
}
