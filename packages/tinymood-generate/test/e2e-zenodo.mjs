/**
 * End-to-end: download Zenodo GloVe zip, convert, generate table.
 * Run: npm run build -w tiny-mood-generate && node packages/tinymood-generate/test/e2e-zenodo.mjs
 */
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import {
  ensureGloveFile,
  generateMoodTable,
  DEFAULT_CACHED_TEXT_PATH,
} from '../dist/index.js'

const root = join(import.meta.dirname, '../../..')
const contentDir = join(root, 'fixtures/content')
const outPath = join(root, 'fixtures/output-table-zenodo.json')
const cachePath = DEFAULT_CACHED_TEXT_PATH

console.log('=== E2E: Zenodo download + cache + generate ===\n')

const hadCache = existsSync(cachePath)
if (hadCache) {
  console.log(`Cache already present at ${cachePath} — testing cache hit path`)
} else {
  console.log('No cache — will download with --yes equivalent')
}

const t0 = Date.now()
const glovePath = await ensureGloveFile({ yes: true })
const t1 = Date.now()
console.log(`\nensureGloveFile: ${((t1 - t0) / 1000).toFixed(1)}s → ${glovePath}`)

const t2 = Date.now()
const glovePath2 = await ensureGloveFile({ yes: true })
const t2b = Date.now()
console.log(`second ensureGloveFile: ${((t2b - t2) / 1000).toFixed(2)}s (should be instant cache hit)`)

if (glovePath !== glovePath2) {
  throw new Error('Cache paths differ between calls')
}

const { table, stats } = await generateMoodTable(contentDir, glovePath)
console.log('\nGeneration stats (real GloVe):')
console.log(`  vocabulary words in content: ${stats.totalVocabularyWords}`)
console.log(`  anchors found: ${stats.anchorsFound}/${stats.anchorsRequested}`)
console.log(`  words scored: ${stats.wordsScored}`)
console.log(`  unmatched: ${stats.wordsUnmatched}`)
console.log('\nSpot checks:')
for (const word of ['launch', 'quiet', 'acquisition', 'regulatory', 'community']) {
  const m = table[word]
  console.log(`  ${word}:`, m ? `w=${m.weight.toFixed(2)} e=${m.energy.toFixed(2)} h=${m.warmth.toFixed(2)}` : '(not in table)')
}

import { writeFileSync } from 'node:fs'
writeFileSync(outPath, JSON.stringify(table, null, 2))
console.log(`\nWrote ${Object.keys(table).length} entries to ${outPath}`)
