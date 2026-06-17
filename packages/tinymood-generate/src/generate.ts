import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { extractVocabulary } from './scan-content.js'
import { lookupWordsInGloveFile } from './parse-glove.js'
import { buildCalibration, scoreVector } from './calibrate.js'
import { CALIBRATION_ANCHORS } from './calibration-anchors.js'
import type { MoodTable } from './types.js'

export interface GenerationStats {
  totalVocabularyWords: number
  anchorsRequested: number
  anchorsFound: number
  wordsScored: number
  wordsUnmatched: number
}

export async function generateMoodTable(
  contentDir: string,
  glovePath: string
): Promise<{ table: MoodTable; stats: GenerationStats }> {
  const vocabulary = extractVocabulary(contentDir)

  const anchorWords = new Set(CALIBRATION_ANCHORS.map(a => a.word))
  const allTargetWords = new Set([...vocabulary, ...anchorWords])

  const found = await lookupWordsInGloveFile(glovePath, allTargetWords)
  const foundByWord = new Map(found.map(e => [e.word, e.vector] as const))

  const anchorEntries = found.filter(e => anchorWords.has(e.word))
  const calibration = buildCalibration(anchorEntries)

  const table: MoodTable = {}
  let scoredCount = 0
  let unmatchedCount = 0

  for (const word of vocabulary) {
    const vector = foundByWord.get(word)
    if (!vector) {
      unmatchedCount++
      continue
    }
    table[word] = scoreVector(vector, calibration)
    scoredCount++
  }

  const stats: GenerationStats = {
    totalVocabularyWords: vocabulary.size,
    anchorsRequested: anchorWords.size,
    anchorsFound: anchorEntries.length,
    wordsScored: scoredCount,
    wordsUnmatched: unmatchedCount
  }

  return { table, stats }
}

export function writeMoodTable(
  outputPath: string,
  table: MoodTable,
  stats: GenerationStats
): void {
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(table, null, 2))

  console.log('')
  console.log('Generation stats:')
  console.log(`  vocabulary words found in content: ${stats.totalVocabularyWords}`)
  console.log(`  calibration anchors requested:     ${stats.anchorsRequested}`)
  console.log(`  calibration anchors found in GloVe:  ${stats.anchorsFound}`)
  console.log(`  words successfully scored:           ${stats.wordsScored}`)
  console.log(`  words not found in GloVe (skipped):  ${stats.wordsUnmatched}`)
  console.log('')
  console.log(`Wrote ${Object.keys(table).length} word vectors to ${outputPath}`)
  console.log('')
  console.log('Use with tiny-mood:')
  console.log("  import moodTable from './mood-table.json'")
  console.log("  import { getMoodBackground } from 'tiny-mood'")
  console.log('')
  console.log('  const { background, filter, mood } = getMoodBackground(')
  console.log("    post.title + ' ' + post.description,")
  console.log('    moodTable,')
  console.log('    post.slug')
  console.log('  )')
  console.log('')
}
