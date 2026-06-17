#!/usr/bin/env node
/**
 * tiny-mood-generate CLI
 *
 *   npx tiny-mood-generate <contentDir> <outputPath> [--glove <path>] [--yes]
 */

import { ensureGloveFile, resolveGlovePath } from './ensure-glove.js'
import { generateMoodTable, writeMoodTable } from './generate.js'

interface CliArgs {
  contentDir: string
  outputPath: string
  glovePath?: string
  yes: boolean
}

function parseArgs(argv: string[]): CliArgs {
  const positional: string[] = []
  let glovePath: string | undefined
  let yes = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--yes' || arg === '-y') {
      yes = true
      continue
    }
    if (arg === '--glove') {
      glovePath = argv[++i]
      if (!glovePath) {
        throw new Error('--glove requires a path argument')
      }
      continue
    }
    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    }
    positional.push(arg)
  }

  const [contentDir, outputPath] = positional
  if (!contentDir || !outputPath) {
    throw new Error(
      'Usage: tiny-mood-generate <contentDir> <outputPath> [--glove <path>] [--yes]'
    )
  }

  return { contentDir, outputPath, glovePath, yes }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const glovePath = args.glovePath
    ? await resolveGlovePath(args.glovePath)
    : await ensureGloveFile({ yes: args.yes })

  if (args.glovePath) {
    console.log(`Using GloVe file: ${glovePath}`)
  }

  console.log(`Scanning content in ${args.contentDir}...`)
  const { table, stats } = await generateMoodTable(args.contentDir, glovePath)
  writeMoodTable(args.outputPath, table, stats)
}

main().catch(err => {
  console.error('Generation failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
