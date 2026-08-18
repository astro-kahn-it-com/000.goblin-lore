import * as fs from 'node:fs/promises'
import * as path from 'node:path'

/**
 * Writes data to a target file path atomically using a temporary file and atomic rename pattern. Ensures parent
 * directory exists before writing.
 *
 * @param filePath The final destination file path
 * @param content The string or buffer content to write
 */
export async function atomicWrite(
    filePath: string,
    content: string | Uint8Array,
): Promise<void> {
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    // Generate a unique temporary file path in the same directory to guarantee cross-filesystem atomic rename compatibility
    const tempFilePath = `${filePath}.tmp.${Date.now().toString()}.${Math.random().toString(36).substring(2, 9)}`

    try {
        await fs.writeFile(tempFilePath, content, 'utf-8')
        await fs.rename(tempFilePath, filePath)
    } catch (error) {
        // Clean up temp file on failure if it exists
        try {
            await fs.unlink(tempFilePath)
        } catch {
            // Ignore error if temp file was never created
        }
        throw error
    }
}
