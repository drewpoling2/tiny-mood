import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  generateMoodTable,
  lookupWordsInGloveFile,
  convertWord2VecBinaryToText,
} from '../dist/index.js'

const root = join(import.meta.dirname, '../../..')
const fixtureGlove = join(root, 'fixtures/mini-glove.txt')
const contentDir = join(root, 'fixtures/content')

let passed = 0
let failed = 0

function assert(name, condition) {
  if (condition) {
    console.log(`✓ ${name}`)
    passed++
  } else {
    console.error(`✗ ${name}`)
    failed++
  }
}

console.log('=== generateMoodTable (fixture GloVe text) ===')
const { table, stats } = await generateMoodTable(contentDir, fixtureGlove)
console.log(`  vocabulary: ${stats.totalVocabularyWords}`)
console.log(`  anchors found: ${stats.anchorsFound}/${stats.anchorsRequested}`)
console.log(`  words scored: ${stats.wordsScored}`)
console.log(`  unmatched: ${stats.wordsUnmatched}`)
assert('scores words from fixture content', stats.wordsScored > 10)
assert('finds most calibration anchors', stats.anchorsFound >= 20)
assert('launch has positive energy', table.launch?.energy > 0)
assert('quiet has negative energy', table.quiet?.energy < 0)

console.log('\n=== lookupWordsInGloveFile ===')
const found = await lookupWordsInGloveFile(fixtureGlove, new Set(['launch', 'missingword']))
assert('finds known fixture words', found.some(e => e.word === 'launch'))
assert('skips unknown words', found.every(e => e.word !== 'missingword'))

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
