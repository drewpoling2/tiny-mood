/**
 * convert-word2vec.ts
 *
 * Converts Google word2vec / gensim binary format to GloVe plain text:
 *   word d1 d2 d3 ...
 *
 * We convert once at cache time rather than parsing binary in parse-glove.ts
 * because the existing streaming text parser is already proven, the cached
 * plain-text file is inspectable, and conversion is a one-time cost per machine.
 *
 * Binary layout (word2vec C / gensim compatible):
 *   Line 1: "<vocab_count> <vector_size>\n"
 *   Per word: UTF-8 word bytes until 0x20 (space), then vector_size float32 LE values
 */

import { createWriteStream } from 'node:fs'
import { open } from 'node:fs/promises'
import { finished } from 'node:stream/promises'

export interface ConvertProgress {
  wordsWritten: number
  vocabSize: number
}

export async function convertWord2VecBinaryToText(
  binaryPath: string,
  textPath: string,
  onProgress?: (progress: ConvertProgress) => void
): Promise<{ vocabSize: number; vectorSize: number }> {
  const fh = await open(binaryPath, 'r')

  try {
    const headerBuf = Buffer.alloc(128)
    const { bytesRead } = await fh.read(headerBuf, 0, 128, 0)
    if (bytesRead < 3) {
      throw new Error('Binary word2vec file is too small to contain a header')
    }

    const newlineIdx = headerBuf.indexOf(0x0a)
    if (newlineIdx === -1) {
      throw new Error('Binary word2vec file missing header newline')
    }

    const headerParts = headerBuf
      .slice(0, newlineIdx)
      .toString('utf8')
      .trim()
      .split(/\s+/)
    if (headerParts.length < 2) {
      throw new Error(`Invalid word2vec header: ${headerBuf.slice(0, newlineIdx).toString('utf8')}`)
    }

    const vocabSize = Number(headerParts[0])
    const vectorSize = Number(headerParts[1])
    if (!Number.isFinite(vocabSize) || !Number.isFinite(vectorSize) || vocabSize <= 0 || vectorSize <= 0) {
      throw new Error(`Invalid word2vec dimensions: ${headerParts.join(' ')}`)
    }

    let position = newlineIdx + 1
    const out = createWriteStream(textPath, { encoding: 'utf8' })
    const oneByte = Buffer.alloc(1)
    const vectorBuf = Buffer.alloc(vectorSize * 4)

    for (let i = 0; i < vocabSize; i++) {
      const wordBytes: number[] = []
      while (true) {
        const { bytesRead: got } = await fh.read(oneByte, 0, 1, position)
        if (got !== 1) {
          throw new Error(`Unexpected EOF while reading word ${i + 1} of ${vocabSize}`)
        }
        position += 1
        const ch = oneByte[0]
        if (ch === 0x20) break
        wordBytes.push(ch)
      }

      const word = Buffer.from(wordBytes).toString('utf8')
      const { bytesRead: vecRead } = await fh.read(vectorBuf, 0, vectorSize * 4, position)
      if (vecRead !== vectorSize * 4) {
        throw new Error(`Unexpected EOF while reading vector for "${word}"`)
      }
      position += vectorSize * 4

      const parts = new Array<string>(vectorSize)
      for (let d = 0; d < vectorSize; d++) {
        parts[d] = String(vectorBuf.readFloatLE(d * 4))
      }

      if (!out.write(`${word} ${parts.join(' ')}\n`)) {
        await new Promise<void>((resolve, reject) => {
          out.once('drain', resolve)
          out.once('error', reject)
        })
      }

      if (onProgress && (i === 0 || i % 50000 === 0 || i === vocabSize - 1)) {
        onProgress({ wordsWritten: i + 1, vocabSize })
      }
    }

    out.end()
    await finished(out)

    return { vocabSize, vectorSize }
  } finally {
    await fh.close()
  }
}
