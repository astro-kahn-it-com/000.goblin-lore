import {
    hasHistoricalReferenceFlag,
    isRetired,
} from '../retirement-awareness-logic/index.js'

/**
 * Checks if a relational pointer to a retired target is valid. An active file referencing a retired file must include
 * the historical_reference flag.
 *
 * @param targetFilePath The file path of the referenced target
 * @param sourceData The parsed frontmatter of the source file making the reference
 * @returns An error string if the reference is illegal, or undefined if valid
 */
export function checkRetiredReference(
    targetFilePath: string,
    sourceData: { historical_reference?: boolean },
): string | undefined {
    if (isRetired(targetFilePath) && !hasHistoricalReferenceFlag(sourceData)) {
        return 'Target is retired and no historical_reference flag is present'
    }
    return undefined
}
