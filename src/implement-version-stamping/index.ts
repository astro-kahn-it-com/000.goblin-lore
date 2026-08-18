import { createHash } from 'node:crypto'
import type { CompiledStateMetadata } from '../index-structure-specification/index.js'

/**
 * Generates the version stamp metadata for the compiled artifact. Computes a SHA-256 hash of all corpus files (sorted
 * by filePath to guarantee determinism) and captures the current ISO-8601 timestamp.
 *
 * @param files The raw corpus files with their file paths and string contents
 * @param now Optional override for the current date (useful for deterministic testing)
 * @returns The compiled metadata containing compiledAt and corpusHash
 */
export function generateVersionStamp(
    files: Array<{ content: string; filePath: string }>,
    now: Date = new Date(),
): CompiledStateMetadata {
    // Sort files by filePath alphabetically to guarantee determinism regardless of OS read order
    const sortedFiles = [...files].sort((a, b) =>
        a.filePath.localeCompare(b.filePath),
    )

    const hash = createHash('sha256')
    for (const file of sortedFiles) {
        // Include the filePath in the hash to detect file renames
        hash.update(file.filePath)
        hash.update('\0') // Delimiter
        hash.update(file.content)
        hash.update('\0') // Delimiter
    }

    const corpusHash = hash.digest('hex')

    return {
        compiledAt: now.toISOString(),
        corpusHash,
    }
}
