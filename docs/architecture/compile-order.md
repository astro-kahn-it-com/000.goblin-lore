# Compile Order Runbook

## Sequence Specification

The exact tier boundaries and the specific commands invoked at each tier:

1. **goblin-config**: `npm run build -w goblin-config`
2. **goblin-bible**: `npx ts-node goblin-bible/compile.ts`
3. **worker-sower**: `npm run boot-check -w worker-sower`

## Failure-Halt Behavior Design

If any tier's build process fails (returns a non-zero exit code), the sequence must halt
immediately. This means:

- Process exit code propagation occurs.
- No partial execution of the next tier's setup steps is allowed.
- The script exits immediately with a failure code (Code 1), without attempting downstream tiers.
