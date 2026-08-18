/** Build the Order-Log Writer for Tiered Compile Orchestration (FEAT-001.03) */

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { TierExecutionResult } from '../failure-halt-behavior-design/index.js'

export type OrderLogEntry = {
    readonly command: string
    readonly durationMs: number
    readonly endTime: string
    readonly exitCode: number
    readonly name: string
    readonly startTime: string
    readonly tier: number
}

export type WriteOrderLogResult = {
    readonly content: string
    readonly filepath: string
}

/** Formats a tier execution result and time bounds into a structured OrderLogEntry. */
export function createLogEntryFromExecution(
    result: TierExecutionResult,
    startTimeISO: string,
    endTimeISO: string,
): OrderLogEntry {
    return {
        command: result.tier.command,
        durationMs: result.durationMs,
        endTime: endTimeISO,
        exitCode: result.exitCode,
        name: result.tier.name,
        startTime: startTimeISO,
        tier: result.tier.tier,
    }
}

/** Formats a Date or timestamp string into a safe ISO-like string suitable for log filenames. */
export function formatLogFilename(timestamp?: Date | string): string {
    const date = timestamp
        ? typeof timestamp === 'string'
            ? new Date(timestamp)
            : timestamp
        : new Date()
    const isoString = date.toISOString().replace(/:/g, '-')
    return `build-order-${isoString}.log`
}

/** Converts a list of OrderLogEntry records into formatted log file text. */
export function formatOrderLogEntries(
    entries: ReadonlyArray<OrderLogEntry>,
): string {
    const header = [
        `================================================================================`,
        ` BUILD ORDER EXECUTION LOG`,
        ` Timestamp: ${new Date().toISOString()}`,
        ` Total Entries: ${String(entries.length)}`,
        `================================================================================`,
        ``,
    ].join('\n')

    const body = entries
        .map((entry) => {
            return [
                `[TIER ${String(entry.tier)}] ${entry.name}`,
                `  Command:    ${entry.command}`,
                `  Start Time: ${entry.startTime}`,
                `  End Time:   ${entry.endTime}`,
                `  Duration:   ${String(entry.durationMs)}ms`,
                `  Exit Code:  ${String(entry.exitCode)}`,
                `--------------------------------------------------------------------------------`,
            ].join('\n')
        })
        .join('\n')

    return `${header}${body}\n`
}

/** Writes structured build order log entries to a file in the logs directory. */
export function writeOrderLog(
    entries: ReadonlyArray<OrderLogEntry>,
    logDir = 'logs',
    timestamp?: Date | string,
): WriteOrderLogResult {
    const filename = formatLogFilename(timestamp)
    const filepath = path.join(logDir, filename)
    const content = formatOrderLogEntries(entries)

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
    }

    fs.writeFileSync(filepath, content, 'utf8')

    return {
        content,
        filepath,
    }
}
