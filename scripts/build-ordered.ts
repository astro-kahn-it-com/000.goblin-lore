/** Executable CLI script for Ordered Build Orchestration (FEAT-001.03) */

import {
    executeOrderedBuild,
    parseRepeatFlag,
} from '../src/build-the-ordered-script/index.js'

function main(): void {
    const repeatCount = parseRepeatFlag(process.argv.slice(2))
    console.log(
        `[ORDERED BUILD] Starting sequence execution (repeatCount: ${String(repeatCount)})...`,
    )

    try {
        const result = executeOrderedBuild({ repeatCount })
        console.log(
            `[ORDERED BUILD] Completed ${String(result.totalRuns)} run(s) successfully in ${String(result.totalDurationMs)}ms.`,
        )
    } catch (error: unknown) {
        console.error('[ORDERED BUILD] Execution failed:', error)
        process.exitCode = 1
    }
}

main()
