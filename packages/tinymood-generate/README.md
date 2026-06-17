# tiny-mood-generate

Build a [tiny-mood](https://www.npmjs.com/package/tiny-mood) mood table from your own content, using real GloVe word embeddings instead of a small hand-written word list.

This is a build-time tool, not a runtime dependency. It reads your blog posts, looks up the words that actually appear in them, and writes a small JSON file. Your app never needs this package or GloVe itself at runtime — only the generated JSON.

## What it is

tiny-mood's mood scoring works by averaging known words in a lookup table. The problem with a small hand-written table is coverage: words like "acquisition," "regulatory," or "orchestration" simply aren't in it, so any post using that kind of vocabulary scores as falsely neutral.

`tiny-mood-generate` fixes this by scanning your real content for its actual vocabulary, looking each word up in a pre-trained GloVe embedding, and calibrating the result against a small set of reference words with known mood values — so the judgment already encoded in tiny-mood's defaults carries over to any word GloVe has seen, not just the words someone happened to type into a hardcoded list.

## Install

```bash
npm install -D tiny-mood-generate
```

## Quick start

```bash
npx tiny-mood-generate ./content ./mood-table.json
```

`./content` should be a directory of JSON files with `title`, `description`, and optionally `sections` (each with `heading`/`body`) — typically your blog post source files.

On first run, this downloads and caches a GloVe embeddings file (~59 MB, one time, reused across all future projects on your machine). You'll be asked to confirm before anything downloads:

```
tiny-mood-generate needs a GloVe word embeddings file to build your mood table.

Source: Zenodo (Leipzig University mirror of Stanford's GloVe 6B, 50-dimensional)
Size: ~59 MB, one-time download
Cached at: ~/.cache/tinymood/glove.6B.50d.txt
License: Public Domain Dedication and License v1.0

Proceed with download? (y/n)
```

Every run after the first reuses the cached file instantly — no repeat downloads, no repeat prompts.

```ts
// In your app, using tiny-mood (separate package):
import { getMoodBackground } from 'tiny-mood'
import moodTable from './mood-table.json'

getMoodBackground(text, moodTable, seed)
```

## CLI usage

```bash
npx tiny-mood-generate <contentDir> <outputPath> [options]
```

| Flag | What it does |
|---|---|
| `--glove <path>` | Use a GloVe file you already have instead of downloading. Accepts plain-text format (`word d1 d2 d3...`) or the gensim binary word2vec format — both are detected and handled automatically. |
| `--yes` | Skip the download confirmation prompt (for CI / non-interactive use). |

### Examples

```bash
# Standard use — downloads and caches GloVe automatically on first run
npx tiny-mood-generate ./blog/content ./blog/mood-table.json

# Use a GloVe file you already have
npx tiny-mood-generate ./content ./mood-table.json --glove ./glove.6B.300d.txt

# Non-interactive, e.g. in a CI pipeline
npx tiny-mood-generate ./content ./mood-table.json --yes
```

## What you'll see

```
Scanning content in ./content...
Generation stats:
  vocabulary words found in content: 84
  calibration anchors requested: 27
  calibration anchors found in GloVe source: 27
  words successfully scored: 84
  words not found in GloVe source (skipped): 0
Wrote 84 word vectors to ./mood-table.json

Use it with tiny-mood:
  import { getMoodBackground } from 'tiny-mood'
  import moodTable from './mood-table.json'
  getMoodBackground(text, moodTable, seed)
```

Words not found in the GloVe source are silently skipped, the same way an unknown word is skipped by tiny-mood's default table — no crash, no placeholder value, just absence.

## Functions

For use in your own build scripts, instead of the CLI:

### `generateMoodTable(contentDir, glovePath)`

Runs the full scan → lookup → calibrate → score pipeline. Returns `{ table, stats }`.

### `ensureGloveFile(options?)`

Handles the download/cache/format-conversion logic on its own — useful if you want to trigger the GloVe acquisition step separately from generation, or build your own CLI on top of it. Returns the local path to a ready-to-use plain-text GloVe file.

## Regenerating as content grows

The table is a static snapshot of your vocabulary at the time you ran the command. New posts with new words won't be scored until you regenerate:

```bash
npx tiny-mood-generate ./content ./mood-table.json --yes
```

This is fast after the first run — the GloVe file is cached, so regenerating only re-runs the scan/lookup/calibrate steps, not the download.

## Where this fits

```
your content (JSON)  ──┐
                        ├──>  tiny-mood-generate  ──>  mood-table.json
GloVe embeddings  ──────┘            (build time)          │
                                                             ▼
                                                  tiny-mood (runtime)
                                                  getMoodBackground(...)
```

`tiny-mood-generate` and the GloVe file it uses never ship inside your app's runtime bundle or dependency tree — they're a `devDependency` only, used to produce one small JSON file that `tiny-mood` reads at runtime.

## Try it live

[StackBlitz demo](https://stackblitz.com/github/drewpoling2/tiny-mood/tree/main/examples/stackblitz) — tabbed examples with brand presets, blend shapes, and an interactive Blend Lab.

## License

MIT. GloVe embeddings are from Stanford's GloVe project, redistributed via Zenodo under the Public Domain Dedication and License v1.0.
