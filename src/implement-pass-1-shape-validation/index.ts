import matter from 'gray-matter'
import { validateRetirementMetadata } from '../implement-retirement-metadata-validation/index.js'
import {
    type AnyCorpus,
    AnyCorpusSchema,
} from '../schema-definition-pass/index.js'

export type ValidationError = {
    error: string
    filePath: string
    success: false
}

export type ValidationResult = ValidationError | ValidationSuccess

export type ValidationSuccess = {
    data: AnyCorpus
    filePath: string
    success: true
}

export function validateCorpusFile(
    filePath: string,
    fileContent: string,
): ValidationResult {
    let parsed: matter.GrayMatterFile<string>
    try {
        parsed = matter(fileContent)
    } catch (err: unknown) {
        return {
            error: `Frontmatter parsing failed: ${err instanceof Error ? err.message : String(err)}`,
            filePath,
            success: false,
        }
    }

    const result = AnyCorpusSchema.safeParse(parsed.data)

    if (!result.success) {
        const formattedErrors = result.error.issues
            .map((e) => `Field '${e.path.join('.')}' - ${e.message}`)
            .join(', ')

        return {
            error: `Schema validation failed: ${formattedErrors}`,
            filePath,
            success: false,
        }
    }

    const retirementError = validateRetirementMetadata(filePath, parsed.data)
    if (retirementError) {
        return {
            error: `Schema validation failed: ${retirementError}`,
            filePath,
            success: false,
        }
    }

    return {
        data: result.data,
        filePath,
        success: true,
    }
}
