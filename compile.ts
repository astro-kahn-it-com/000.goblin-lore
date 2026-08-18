import * as crypto from 'node:crypto'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { atomicWrite } from './src/implement-the-atomic-write/index.js'
import { serializeDeterministic } from './src/implement-the-deterministic-serializer/index.js'
import type {
    Character,
    CompiledState,
    Faction,
    Grievance,
    Location,
    Possession,
} from './src/index-structure-specification/index.js'
import { compileCorpusFiles } from './src/positive-fixture-test/index.js'

export async function runCompiler(
    corpusDir = path.join(process.cwd(), 'corpus'),
    outputFile = path.join(process.cwd(), 'compiled', 'bible-state.json'),
): Promise<CompiledState> {
    console.log(`[CORPUS COMPILER] Reading corpus directory: ${corpusDir}`)

    let filePaths: Array<string>
    try {
        filePaths = await findMarkdownFiles(corpusDir)
    } catch (err) {
        console.error(
            `[CORPUS COMPILER] Failed to read directory ${corpusDir}:`,
            err,
        )
        throw err
    }

    filePaths.sort()

    const files = await Promise.all(
        filePaths.map(async (filePath) => {
            const content = await fs.readFile(filePath, 'utf-8')
            const relativePath = path
                .relative(process.cwd(), filePath)
                .replace(/\\/g, '/')
            return { content, filePath: relativePath }
        }),
    )

    console.log(
        `[CORPUS COMPILER] Validating ${String(files.length)} corpus file(s)...`,
    )
    const result = compileCorpusFiles(files)

    if (!result.success) {
        console.error('[CORPUS COMPILER] Compilation HARD-FAIL with errors:')
        console.error(result.errors)
        throw new Error(
            `Corpus compilation failed with ${String(result.errors.length)} error(s).`,
        )
    }

    const characters: Record<string, Character> = {}
    const factions: Record<string, Faction> = {}
    const grievances: Record<string, Grievance> = {}
    const locations: Record<string, Location> = {}
    const possessions: Record<string, Possession> = {}

    for (const [id, item] of result.activeIndex.entries()) {
        const entity = item.data
        switch (entity.type) {
            case 'character':
                characters[id] = entity
                break
            case 'faction':
                factions[id] = entity
                break
            case 'grievance':
                grievances[id] = entity
                break
            case 'location':
                locations[id] = entity
                break
            case 'possession':
                possessions[id] = entity
                break
        }
    }

    const hash = crypto.createHash('sha256')
    for (const file of files) {
        hash.update(file.filePath)
        hash.update(file.content)
    }
    const corpusHash = hash.digest('hex')

    const compiledState: CompiledState = {
        characters,
        factions,
        grievances,
        locations,
        metadata: {
            compiledAt: new Date().toISOString(),
            corpusHash,
        },
        possessions,
    }

    const jsonOutput = serializeDeterministic(compiledState, 2)
    console.log(`[CORPUS COMPILER] Writing compiled state to ${outputFile}...`)
    await atomicWrite(outputFile, jsonOutput)

    console.log('[CORPUS COMPILER] Compilation finished successfully!')
    return compiledState
}

async function findMarkdownFiles(dirPath: string): Promise<Array<string>> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const files: Array<string> = []

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const subFiles = await findMarkdownFiles(
                path.join(dirPath, entry.name),
            )
            files.push(...subFiles)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push(path.join(dirPath, entry.name))
        }
    }

    return files
}

if (process.argv[1] && process.argv[1].includes('compile.ts')) {
    runCompiler().catch((err: unknown) => {
        console.error(err)
        process.exitCode = 1
    })
}
