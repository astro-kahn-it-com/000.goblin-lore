import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const vitestArgs = args.map(arg => arg === '--grep' ? '-t' : arg);

const result = spawnSync('npm', ['exec', '--', 'vitest', 'run', ...vitestArgs], { stdio: 'inherit' });
process.exit(result.status);
