import { readFileSync } from 'fs'
import {
  getMoodVector,
  getMoodBackground,
} from './packages/tinymood/dist/index.js'

const table = JSON.parse(
  readFileSync('./fixtures/output-table.json', 'utf8')
)

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

const v1 = getMoodVector('exciting launch announcement', table)
const v2 = getMoodVector('quiet calm reflection journal', table)
assert(
  'getMoodVector returns different vectors for different text',
  v1.energy !== v2.energy || v1.warmth !== v2.warmth || v1.weight !== v2.weight
)

const a = getMoodVector('same text every time', table)
const b = getMoodVector('same text every time', table)
assert(
  'same text always returns the same vector (determinism)',
  a.weight === b.weight && a.energy === b.energy && a.warmth === b.warmth
)

const bg = getMoodBackground('Some blog post title and description', table, 'test-seed')
assert(
  'getMoodBackground returns a valid-looking CSS background string',
  typeof bg.background === 'string' &&
    bg.background.includes('radial-gradient') &&
    bg.background.includes('linear-gradient')
)
assert(
  'getMoodBackground returns a filter string',
  typeof bg.filter === 'string' && bg.filter.includes('blur')
)

const neutral = getMoodVector('neutral ordinary text', table)
assert(
  'getMoodVector returns a neutral-ish vector for generic text',
  typeof neutral.weight === 'number' &&
    typeof neutral.energy === 'number' &&
    typeof neutral.warmth === 'number'
)

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
