/** Clean-Room Single-Run Proof for Tiered Compile Orchestration (FEAT-001.03) */

import type { OrderLogEntry } from '../build-the-order-log-writer/index.js'
import { writeOrderLog } from '../build-the-order-log-writer/index.js'
import { executeOrderedBuild } from '../build-the-ordered-script/index.js'
import { clearCacheTargets } from '../cache-clearing-preamble/index.js'

export type CleanRoomOptions = {
    readonly cacheTargets?: ReadonlyArray<string>
    readonly cwd?: string
    readonly isDryRun?: boolean
    readonly logDir?: string
}

export type CleanRoomSingleRunReport = {
    readonly clearedPaths: ReadonlyArray<string>
    readonly durationMs: number
    readonly exitCode: number
    readonly logEntries: ReadonlyArray<OrderLogEntry>
    readonly logFilepath: string
    readonly success: boolean
    readonly tierSequenceValid: boolean
}

/** Executes a full clean-room single run compile proof. */
export function executeCleanRoomSingleRun(
    options: CleanRoomOptions = {},
): CleanRoomSingleRunReport {
    const startTime = Date.now()
    const isDryRun = options.isDryRun ?? false
    const logDir = options.logDir ?? 'logs'

    // Step 1: Preamble cache clear
    const cacheResult = clearCacheTargets(options.cacheTargets, {
        cwd: options.cwd,
        dryRun: isDryRun,
    })

    // Step 2: Ordered build execution
    const buildResult = executeOrderedBuild({ isDryRun, repeatCount: 1 })
    const runSummary = buildResult.runs[0]
    const results = runSummary.results
    const isBuildSuccess = runSummary.success

    // Step 3: Create log entries
    const logEntries: Array<OrderLogEntry> = results.map((res) => {
        const nowISO = new Date().toISOString()
        return {
            command: res.tier.command,
            durationMs: res.durationMs,
            endTime: nowISO,
            exitCode: res.exitCode,
            name: res.tier.name,
            startTime: nowISO,
            tier: res.tier.tier,
        }
    })

    // Step 4: Write order log
    const logResult = writeOrderLog(logEntries, logDir)

    // Step 5: Validate sequence ordering
    const sequenceValid = validateTierOrdering(logEntries)
    const overallSuccess =
        cacheResult.success && isBuildSuccess && sequenceValid

    return {
        clearedPaths: cacheResult.clearedPaths,
        durationMs: Date.now() - startTime,
        exitCode: overallSuccess ? 0 : 1,
        logEntries,
        logFilepath: logResult.filepath,
        success: overallSuccess,
        tierSequenceValid: sequenceValid,
    }
}

/** Validates that log entries follow strictly increasing 1-based tier order (1, 2, 3...). */
export function validateTierOrdering(
    entries: ReadonlyArray<OrderLogEntry>,
): boolean {
    if (entries.length === 0) {
        return false
    }

    for (let index = 0; index < entries.length; index += 1) {
        const expectedTier = index + 1
        if (
            entries[index].tier !== expectedTier ||
            entries[index].exitCode !== 0
        ) {
            return false
        }
    }

    return true
}
