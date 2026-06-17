/**
 * ensure-glove.ts
 *
 * Downloads GloVe 6B 50d from Zenodo (gensim binary inside a zip),
 * verifies MD5, converts to plain text, and caches at:
 *   ~/.cache/tinymood/glove.6B.50d.txt
 */

import { createHash } from 'node:crypto'
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync
} from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { finished } from 'node:stream/promises'
import { execFileSync } from 'node:child_process'
import { createInterface } from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { convertWord2VecBinaryToText } from './convert-word2vec.js'

export const GLOVE_ZENODO_URL =
  'https://zenodo.org/records/4925376/files/glove.6B.50d.zip?download=1'

export const GLOVE_ZIP_MD5 = 'a6c8d6e1e52401e913e5f6fa137b1d53'

export const GLOVE_ZIP_SIZE_LABEL = '58.9 MB'

export const DEFAULT_CACHE_DIR = join(homedir(), '.cache', 'tinymood')

export const DEFAULT_CACHED_TEXT_PATH = join(DEFAULT_CACHE_DIR, 'glove.6B.50d.txt')

export interface EnsureGloveOptions {
  yes?: boolean
  cachePath?: string
  downloadUrl?: string
}

const PYTHON_EXTRACT = [
  'import zipfile, sys',
  'zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',
].join('\n')

function md5File(path: string): string {
  const hash = createHash('md5')
  hash.update(readFileSync(path))
  return hash.digest('hex')
}

async function promptYesNo(question: string): Promise<boolean> {
  const rl = createInterface({ input, output })
  const answer = await new Promise<string>(resolve => {
    rl.question(question, resolve)
  })
  rl.close()
  const normalized = answer.trim().toLowerCase()
  return normalized === 'y' || normalized === 'yes'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function downloadFile(
  url: string,
  destPath: string,
  onProgress?: (downloaded: number, total: number | null) => void
): Promise<number> {
  const response = await fetch(url, { redirect: 'follow' })
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status} ${response.statusText}`)
  }
  if (!response.body) {
    throw new Error('Download failed: empty response body')
  }

  const total = Number(response.headers.get('content-length') ?? 'NaN')
  const totalBytes = Number.isFinite(total) ? total : null

  const file = createWriteStream(destPath)
  const reader = response.body.getReader()
  let downloaded = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    downloaded += value.byteLength
    if (!file.write(Buffer.from(value))) {
      await new Promise<void>((resolve, reject) => {
        file.once('drain', resolve)
        file.once('error', reject)
      })
    }
    onProgress?.(downloaded, totalBytes)
  }

  file.end()
  await finished(file)
  return downloaded
}

function extractZip(zipPath: string, destDir: string): string {
  const runners = ['python3', 'python'] as const
  let extracted = false
  for (const runner of runners) {
    try {
      execFileSync(runner, ['-c', PYTHON_EXTRACT, zipPath, destDir], {
        stdio: ['ignore', 'pipe', 'pipe']
      })
      extracted = true
      break
    } catch {
      // try next runner
    }
  }
  if (!extracted) {
    throw new Error(
      'Failed to extract zip (Python 3 with zipfile is required for the Zenodo archive). Use --glove <path> to supply your own GloVe file.'
    )
  }

  const names = readdirSync(destDir).filter(n => !n.endsWith('.zip'))
  const preferred = names.find(n => /glove\.6B\.50d$/i.test(n))
  const member = preferred ?? names.find(n => !n.endsWith('.txt'))
  if (!member) {
    throw new Error(`No binary GloVe member found after extract (entries: ${names.join(', ')})`)
  }
  return join(destDir, member)
}

function isWord2VecBinary(path: string): boolean {
  const head = readFileSync(path)
  const newline = head.indexOf(0x0a)
  if (newline === -1) return false
  const header = head.slice(0, newline).toString('utf8')
  if (!/^\d+\s+\d+$/.test(header)) return false
  const sample = head.slice(newline + 1, newline + 24)
  return sample.some(b => b < 0x20 && b !== 0x09)
}

/** Resolve --glove path: plain text as-is, binary word2vec converted to a temp plain-text file. */
export async function resolveGlovePath(glovePath: string): Promise<string> {
  if (!isWord2VecBinary(glovePath)) {
    return glovePath
  }

  const cacheDir = DEFAULT_CACHE_DIR
  mkdirSync(cacheDir, { recursive: true })
  const outPath = join(cacheDir, `.user-binary-${Date.now()}.txt`)
  console.log('Converting binary word2vec file to plain text...')
  await convertWord2VecBinaryToText(glovePath, outPath, ({ wordsWritten, vocabSize }) => {
    if (wordsWritten % 500000 === 0 || wordsWritten === vocabSize) {
      const pct = ((wordsWritten / vocabSize) * 100).toFixed(1)
      process.stdout.write(
        `\r  ${wordsWritten.toLocaleString()} / ${vocabSize.toLocaleString()} words (${pct}%)`
      )
    }
  })
  console.log(`\n  Ready: ${outPath}`)
  return outPath
}

export async function ensureGloveFile(
  options: EnsureGloveOptions = {}
): Promise<string> {
  const cachePath = options.cachePath ?? DEFAULT_CACHED_TEXT_PATH
  const cacheDir = join(cachePath, '..')

  if (existsSync(cachePath) && statSync(cachePath).size > 0) {
    return cachePath
  }

  console.log('')
  console.log('GloVe 6B 50d vectors are not cached on this machine yet.')
  console.log('')
  console.log(`  Source:  ${options.downloadUrl ?? GLOVE_ZENODO_URL}`)
  console.log(`  Size:    ${GLOVE_ZIP_SIZE_LABEL} (zip, one-time download)`)
  console.log(`  Cache:   ${cachePath}`)
  console.log('')
  console.log('  Attribution:')
  console.log('    GloVe embeddings — Pennington, Socher & Manning (Stanford NLP)')
  console.log('    https://nlp.stanford.edu/projects/glove/')
  console.log('    This 50d-only redistribution — Leipzig University via Zenodo')
  console.log('    (Public Domain Dedication and License v1.0)')
  console.log('')
  console.log('  The download is cached for reuse across all future')
  console.log('  tiny-mood-generate runs on this machine.')
  console.log('')

  if (!options.yes) {
    const ok = await promptYesNo('Download now? [y/N] ')
    if (!ok) {
      throw new Error('Download cancelled. Use --glove <path> to supply your own file.')
    }
  }

  mkdirSync(cacheDir, { recursive: true })
  const tmpDir = join(cacheDir, `.download-${Date.now()}`)
  mkdirSync(tmpDir, { recursive: true })
  const zipPath = join(tmpDir, 'glove.6B.50d.zip')
  const textTmpPath = `${cachePath}.tmp`

  try {
    console.log('Downloading...')
    const downloaded = await downloadFile(
      options.downloadUrl ?? GLOVE_ZENODO_URL,
      zipPath,
      (got, total) => {
        if (total) {
          const pct = ((got / total) * 100).toFixed(1)
          process.stdout.write(`\r  ${formatBytes(got)} / ${formatBytes(total)} (${pct}%)`)
        } else {
          process.stdout.write(`\r  ${formatBytes(got)} downloaded`)
        }
      }
    )
    console.log(`\n  Download complete (${formatBytes(downloaded)}).`)

    const zipMd5 = md5File(zipPath)
    if (zipMd5 !== GLOVE_ZIP_MD5) {
      throw new Error(
        `MD5 mismatch for downloaded zip (got ${zipMd5}, expected ${GLOVE_ZIP_MD5})`
      )
    }
    console.log('  MD5 checksum verified.')

    console.log('Extracting zip...')
    const binaryPath = extractZip(zipPath, tmpDir)
    const binarySize = statSync(binaryPath).size
    console.log(`  Extracted ${binaryPath} (${formatBytes(binarySize)}).`)

    console.log('Converting binary word2vec to plain text (one-time)...')
    const { vocabSize, vectorSize } = await convertWord2VecBinaryToText(
      binaryPath,
      textTmpPath,
      ({ wordsWritten, vocabSize: total }) => {
        const pct = ((wordsWritten / total) * 100).toFixed(1)
        process.stdout.write(
          `\r  ${wordsWritten.toLocaleString()} / ${total.toLocaleString()} words (${pct}%)`
        )
      }
    )
    console.log(
      `\n  Converted ${vocabSize.toLocaleString()} words × ${vectorSize} dimensions.`
    )

    renameSync(textTmpPath, cachePath)
    console.log(`  Cached at ${cachePath}`)
    return cachePath
  } finally {
    rmSync(tmpDir, { recursive: true, force: true })
    if (existsSync(textTmpPath)) {
      rmSync(textTmpPath, { force: true })
    }
  }
}
