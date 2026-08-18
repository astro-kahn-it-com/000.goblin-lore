/** Ten-Run Determinism Proof for Tiered Compile Orchestration (FEAT-001.03) */

import type { OrderLogEntry } from '../build-the-order-log-writer/index.js'
import {
    formatOrderLogEntries,
    writeOrderLog,
} from '../build-the-order-log-writer/index.js'
import { executeOrderedBuild } from '../build-the-ordered-script/index.js'

export type TenRunDeterminismReport = {
    readonly exitCode: number
    readonly isStructurallyIdentical: boolean
    readonly logFilepaths: ReadonlyArray<string>
    readonly normalizedLogSnippet: string
    readonly totalRuns: number
}

export type TenRunOptions = {
    readonly isDryRun?: boolean
    readonly logDir?: string
    readonly repeatCount?: number
}

/** Executes N runs (default 10) of the compile sequence and verifies byte-for-byte structural identity. */
export function executeTenRunDeterminismProof(
    options: TenRunOptions = {},
): TenRunDeterminismReport {
    const repeatCount = options.repeatCount ?? 10
    const isDryRun = options.isDryRun ?? true
    const logDir = options.logDir ?? 'logs'

    const buildResult = executeOrderedBuild({ isDryRun, repeatCount })
    const normalizedLogs: Array<string> = []
    const logFilepaths: Array<string> = []

    for (let index = 0; index < buildResult.runs.length; index += 1) {
        const runSummary = buildResult.runs[index]
        const entries: Array<OrderLogEntry> = runSummary.results.map((res) => {
            const simulatedISO = '2026-08-17T00:00:00.000Z'
            return {
                command: res.tier.command,
                durationMs: res.durationMs,
                endTime: simulatedISO,
                exitCode: res.exitCode,
                name: res.tier.name,
                startTime: simulatedISO,
                tier: res.tier.tier,
            }
        })

        const rawContent = formatOrderLogEntries(entries)
        const timestampForRun = new Date(1786924800000 + index * 1000)
        const writeResult = writeOrderLog(entries, logDir, timestampForRun)

        logFilepaths.push(writeResult.filepath)
        normalizedLogs.push(normalizeLogContent(rawContent))
    }

    const baselineNormalized = normalizedLogs[0] ?? ''
    const isStructurallyIdentical =
        normalizedLogs.length === repeatCount &&
        normalizedLogs.every((log) => log === baselineNormalized)

    return {
        exitCode: isStructurallyIdentical ? 0 : 1,
        isStructurallyIdentical,
        logFilepaths,
        normalizedLogSnippet: baselineNormalized,
        totalRuns: buildResult.totalRuns,
    }
}

/** Strips dynamic timestamp and duration lines from log text to allow structural diff comparison. */
export function normalizeLogContent(logContent: string): string {
    return logContent
        .split('\n')
        .filter((line) => {
            const trimmed = line.trim()
            return (
                !trimmed.startsWith('Timestamp:') &&
                !trimmed.startsWith('Start Time:') &&
                !trimmed.startsWith('End Time:') &&
                !trimmed.startsWith('Duration:')
            )
        })
        .join('\n')
}
