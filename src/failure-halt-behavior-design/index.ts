/** Failure-Halt Behavior Design for Tiered Compile Orchestration (FEAT-001.03) */

import type { CompileTier } from '../sequence-specification/index.js'

export type FailureHaltReport = {
    readonly exitCode: number
    readonly failedTier: CompileTier
    readonly reason: string
    readonly timestamp: string
}

export type TierExecutionResult = {
    readonly durationMs: number
    readonly exitCode: number
    readonly stdout: string
    readonly tier: CompileTier
}

export class FailureHaltError extends Error {
    public readonly report: FailureHaltReport

    public constructor(report: FailureHaltReport) {
        super(
            `Pipeline halted at Tier ${String(report.failedTier.tier)} (${report.failedTier.name}) with Exit Code ${String(report.exitCode)}: ${report.reason}`,
        )
        this.name = 'FailureHaltError'
        this.report = report
    }
}

/**
 * Guard function that enforces failure-halt behavior: if the executed tier returned non-zero, it immediately throws a
 * FailureHaltError preventing downstream tier execution.
 */
export function assertTierSuccess(result: TierExecutionResult): void {
    if (shouldHaltPipeline(result)) {
        const report = createFailureHaltReport(
            result.tier,
            result.exitCode,
            `Command "${result.tier.command}" exited with code ${String(result.exitCode)}`,
        )
        throw new FailureHaltError(report)
    }
}

/** Creates a structured failure halt report when a tier fails. */
export function createFailureHaltReport(
    tier: CompileTier,
    exitCode: number,
    reason: string,
): FailureHaltReport {
    return {
        exitCode,
        failedTier: tier,
        reason,
        timestamp: new Date().toISOString(),
    }
}

/** Checks whether an execution result indicates a pipeline failure requiring an immediate halt. */
export function shouldHaltPipeline(result: TierExecutionResult): boolean {
    return result.exitCode !== 0
}
