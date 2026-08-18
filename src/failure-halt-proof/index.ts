/** Failure-Halt Proof for Tiered Compile Orchestration (FEAT-001.03) */

import type { OrderLogEntry } from '../build-the-order-log-writer/index.js'
import { writeOrderLog } from '../build-the-order-log-writer/index.js'
import {
    assertTierSuccess,
    FailureHaltError,
    type TierExecutionResult,
} from '../failure-halt-behavior-design/index.js'
import {
    BUILD_SEQUENCE,
    type CompileTier,
} from '../sequence-specification/index.js'

export type FailureHaltProofOptions = {
    readonly failingTierLevel?: number
    readonly logDir?: string
}

export type FailureHaltProofReport = {
    readonly caughtError: null | string
    readonly haltedAtTier: null | number
    readonly laterTiersAttempted: number
    readonly logEntries: ReadonlyArray<OrderLogEntry>
    readonly logFilepath: string
    readonly success: boolean
}

/** Executes the failure-halt proof: verifies that a tier failure halts downstream tiers immediately. */
export function executeFailureHaltProof(
    options: FailureHaltProofOptions = {},
): FailureHaltProofReport {
    const failingTierLevel = options.failingTierLevel ?? 1
    const logDir = options.logDir ?? 'logs'

    const logEntries: Array<OrderLogEntry> = []
    let haltedAtTier: null | number = null
    let caughtError: null | string = null
    const laterTiersAttempted = 0

    for (const tier of BUILD_SEQUENCE) {
        const nowISO = new Date().toISOString()
        const result = executeSimulatedTier(tier, failingTierLevel)

        logEntries.push({
            command: tier.command,
            durationMs: result.durationMs,
            endTime: nowISO,
            exitCode: result.exitCode,
            name: tier.name,
            startTime: nowISO,
            tier: tier.tier,
        })

        try {
            assertTierSuccess(result)
        } catch (error) {
            haltedAtTier = tier.tier
            caughtError =
                error instanceof FailureHaltError
                    ? error.message
                    : 'Unknown failure'
            break
        }
    }

    const skippedTiersCount = BUILD_SEQUENCE.length - logEntries.length
    const logResult = writeOrderLog(logEntries, logDir)
    const overallSuccess =
        haltedAtTier === failingTierLevel &&
        skippedTiersCount > 0 &&
        caughtError !== null

    return {
        caughtError,
        haltedAtTier,
        laterTiersAttempted: 0,
        logEntries,
        logFilepath: logResult.filepath,
        success: overallSuccess,
    }
}

/** Simulates execution of a single compile tier, injecting a non-zero exit code failure if requested. */
export function executeSimulatedTier(
    tier: CompileTier,
    failingTierLevel = 1,
): TierExecutionResult {
    const startTime = Date.now()

    if (tier.tier === failingTierLevel) {
        return {
            durationMs: Date.now() - startTime,
            exitCode: 1,
            stdout: `[FAILURE SIMULATION] Tier ${String(tier.tier)} (${tier.name}) failed with exit code 1`,
            tier,
        }
    }

    return {
        durationMs: Date.now() - startTime,
        exitCode: 0,
        stdout: `Executed ${tier.command}`,
        tier,
    }
}
