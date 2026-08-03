import fs from 'node:fs';

const SOURCE = './bin/esbuild-darwin-x64';
const TARGET = './node_modules/@esbuild/darwin-x64/bin/esbuild';

if (!fs.existsSync(TARGET)) {
    console.log('Skipping esbuild Catalina patch: target binary not found.');
    console.log(`Target was: ${TARGET}`);
    process.exit(0);
}

if (!fs.existsSync(SOURCE)) {
    console.log('Skipping esbuild Catalina patch: source binary not found.');
    console.log(`Source was: ${SOURCE}`);
    process.exit(0);
}

const sourceBuffer = fs.readFileSync(SOURCE);
fs.writeFileSync(TARGET, sourceBuffer);
fs.chmodSync(TARGET, 0o755);

const targetBuffer = fs.readFileSync(TARGET);
if (sourceBuffer.equals(targetBuffer)) {
    console.log('Esbuild patch applied successfully');
} else {
    console.error('Esbuild patch failed: copied binary does not match source');
    process.exit(1);
}
