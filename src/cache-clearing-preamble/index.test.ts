import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {
    clearCacheTargets,
    DEFAULT_CACHE_TARGETS,
    isPathWithinCwd,
} from './index.js'

describe('Cache-Clearing Preamble (TASK-001.03.05)', () => {
    const testDir = path.join(__dirname, '__test_cache_preamble__')

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { force: true, recursive: true })
        }
        fs.mkdirSync(testDir, { recursive: true })
    })

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { force: true, recursive: true })
        }
    })

    it('exports default cache targets', () => {
        expect(DEFAULT_CACHE_TARGETS).toContain('dist')
        expect(DEFAULT_CACHE_TARGETS).toContain('types')
        expect(DEFAULT_CACHE_TARGETS).toContain('.cache')
    })

    it('validates paths to prevent escaping working directory', () => {
        expect(isPathWithinCwd('dist', testDir)).toBe(true)
        expect(isPathWithinCwd('../outside', testDir)).toBe(false)
        expect(isPathWithinCwd('.', testDir)).toBe(false)
    })

    it('clears existing target directories', () => {
        const distFolder = path.join(testDir, 'dist')
        const cacheFolder = path.join(testDir, '.cache')

        fs.mkdirSync(distFolder, { recursive: true })
        fs.writeFileSync(path.join(distFolder, 'build.js'), 'content')
        fs.mkdirSync(cacheFolder, { recursive: true })

        const result = clearCacheTargets(['dist', '.cache'], { cwd: testDir })

        expect(result.clearedPaths).toEqual(['dist', '.cache'])
        expect(fs.existsSync(distFolder)).toBe(false)
        expect(fs.existsSync(cacheFolder)).toBe(false)
    })

    it('respects dryRun option without deleting files', () => {
        const distFolder = path.join(testDir, 'dist')
        fs.mkdirSync(distFolder, { recursive: true })

        const result = clearCacheTargets(['dist'], {
            cwd: testDir,
            dryRun: true,
        })

        expect(result.clearedPaths).toEqual(['dist'])
        expect(fs.existsSync(distFolder)).toBe(true)
    })
})
