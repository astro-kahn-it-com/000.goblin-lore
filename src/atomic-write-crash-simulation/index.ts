import { spawn } from 'node:child_process'
import path from 'node:path'

/**
 * Simulates a process crash (SIGKILL) while an atomic write is in progress. Spawns a node child process that initiates
 * a write operation with an intentional delay, and abruptly kills it mid-operation.
 */
export async function simulateAtomicWriteCrash(options: {
    content: string
    delayMs?: number
    targetFilePath: string
}): Promise<{
    exitCode: null | number
    killed: boolean
    signal: NodeJS.Signals | null
}> {
    const { content, delayMs = 200, targetFilePath } = options
    const workerPath = path.join(__dirname, 'worker.js')

    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [workerPath], {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        })

        let killed = false

        child.on('message', (msg: any) => {
            if (msg.type === 'WRITE_STARTED') {
                // Instantly kill child process mid-write
                killed = child.kill('SIGKILL')
            }
        })

        child.on('exit', (code, signal) => {
            resolve({ exitCode: code, killed, signal })
        })

        child.on('error', (err) => {
            reject(err)
        })

        // Send parameters over IPC payload channel
        child.send({
            content,
            delayMs,
            targetFilePath,
            type: 'START_WRITE',
        })
    })
}
