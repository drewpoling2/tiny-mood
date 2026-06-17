/**
 * parse-glove.ts
 *
 * Parses GloVe's plain-text vector format:
 *   word d1 d2 d3 ... dN
 * one entry per line, space-separated.
 *
 * IMPORTANT: this is written to stream the file line-by-line
 * rather than reading it whole into memory, because the real
 * source file (glove.6B.50d.txt or similar) is hundreds of MB.
 * This sandbox build/test uses a tiny fixture file, but the
 * streaming approach is what makes this safe to point at the
 * real file later without changing any code.
 */

import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import type { GloveEntry } from './types.js'

/**
 * Look up a specific set of target words in a GloVe file,
 * without loading the whole file into memory. Returns only
 * the entries that were found among the requested words.
 *
 * This is the core operation for the "generate from content"
 * tool: we already know which words we need (extracted from
 * the user's content), so we only need a single pass over the
 * source file, checking each line's word against our target set.
 */
export async function lookupWordsInGloveFile(
  glovePath: string,
  targetWords: Set<string>
): Promise<GloveEntry[]> {
  const found: GloveEntry[] = []
  const remaining = new Set(targetWords)

  const stream = createReadStream(glovePath, { encoding: 'utf8' })
  const rl = createInterface({ input: stream })

  for await (const line of rl) {
    if (remaining.size === 0) break // early exit once all found

    const spaceIdx = line.indexOf(' ')
    if (spaceIdx === -1) continue

    const word = line.slice(0, spaceIdx)
    if (!remaining.has(word)) continue

    const rest = line.slice(spaceIdx + 1)
    const vector = rest.split(' ').map(Number)

    found.push({ word, vector })
    remaining.delete(word)
  }

  rl.close()
  stream.close()

  return found
}

/**
 * Parse a small GloVe-format file fully into memory.
 * Only intended for small fixture files (tests, or a deliberately
 * trimmed "common words" subset) — do NOT use this on the full
 * 252MB source file, use lookupWordsInGloveFile instead, which
 * streams and only retains matched entries.
 */
export async function parseGloveFileFully(
  glovePath: string
): Promise<GloveEntry[]> {
  const entries: GloveEntry[] = []

  const stream = createReadStream(glovePath, { encoding: 'utf8' })
  const rl = createInterface({ input: stream })

  for await (const line of rl) {
    const spaceIdx = line.indexOf(' ')
    if (spaceIdx === -1) continue

    const word = line.slice(0, spaceIdx)
    const rest = line.slice(spaceIdx + 1)
    const vector = rest.split(' ').map(Number)

    entries.push({ word, vector })
  }

  rl.close()
  stream.close()

  return entries
}
