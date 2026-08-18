/** Cache-Clearing Preamble for Tiered Compile Orchestration (FEAT-001.03) */

import * as fs from 'node:fs'
import * as path from 'node:path'

export const DEFAULT_CACHE_TARGETS: ReadonlyArray<string> = [
    'dist',
    'types',
    '.turbo',
    '.cache',
    'node_modules/.cache',
]

export type CacheClearOptions = {
    readonly cwd?: string
    readonly dryRun?: boolean
}

export type CacheClearResult = {
    readonly clearedPaths: ReadonlyArray<string>
    readonly durationMs: number
    readonly skippedPaths: ReadonlyArray<string>
    readonly success: boolean
}

/** Clears specified cache and build output directories safely. */
export function clearCacheTargets(
    targets: ReadonlyArray<string> = DEFAULT_CACHE_TARGETS,
    options: CacheClearOptions = {},
): CacheClearResult {
    const startTime = Date.now()
    const cwd = options.cwd ?? process.cwd()
    const dryRun = options.dryRun ?? false

    const clearedPaths: Array<string> = []
    const skippedPaths: Array<string> = []

    for (const target of targets) {
        if (!isPathWithinCwd(target, cwd)) {
            skippedPaths.push(target)
            continue
        }

        const absoluteTarget = path.resolve(cwd, target)

        if (fs.existsSync(absoluteTarget)) {
            if (!dryRun) {
                fs.rmSync(absoluteTarget, { force: true, recursive: true })
            }
            clearedPaths.push(target)
        } else {
            skippedPaths.push(target)
        }
    }

    return {
        clearedPaths,
        durationMs: Date.now() - startTime,
        skippedPaths,
        success: true,
    }
}

/** Safely verifies if a candidate relative path resolves within the allowed workspace directory. */
export function isPathWithinCwd(candidatePath: string, cwd: string): boolean {
    const resolvedCwd = path.resolve(cwd)
    const resolvedTarget = path.resolve(cwd, candidatePath)

    return (
        resolvedTarget.startsWith(resolvedCwd) && resolvedTarget !== resolvedCwd
    )
}
