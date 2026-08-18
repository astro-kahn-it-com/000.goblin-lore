import { renameSync, writeFileSync } from 'node:fs';

process.on('message', async (msg) => {
    if (msg.type === 'START_WRITE') {
        const { content, delayMs, targetFilePath } = msg;

        try {
            const tempFile = `${targetFilePath}.tmp`;
            // Open the file and start writing
            writeFileSync(tempFile, content, 'utf-8');

            // Notify parent that write has started so it can kill us
            if (process.send) {
                process.send({ type: 'WRITE_STARTED' });
            }

            // Wait to be killed
            await new Promise((resolve) => setTimeout(resolve, delayMs));

            // If we survive, commit the write
            renameSync(tempFile, targetFilePath);
            process.exit(0);
        } catch (err) {
            process.exit(1);
        }
    }
});
