# tinymood

Tiny, zero-dependency text → mood → color utility.

Turns arbitrary text into a deterministic OKLCH color palette
and ready-to-use CSS background. No LLM, no network calls, no
database — just a small lexicon and some math. Same text always
produces the same output.

## Install

```bash
npm install tinymood
```

## Usage

```ts
import { getMoodBackground } from 'tinymood'

const { background, filter, mood } = getMoodBackground(
  'Some blog post title and description',
  'optional-seed-for-stable-layout'
)

// background and filter are ready-to-use CSS string values
```

## Lower-level API

If you want more control, the individual steps are exported:

```ts
import { getMoodVector, moodToOklch, composeBackground } from 'tinymood'

const mood = getMoodVector(text)        // { weight, energy, warmth }
const palette = moodToOklch(mood)       // Oklch[]
const { background, filter } = composeBackground(palette, seed)
```

## Why

Generated cover images for blog posts, dashboards, or cards
without paying for image generation, hosting static assets, or
calling an LLM on every page render. Runs at build time in
Node, fully deterministic — the same input always produces
pixel-identical output.

## Custom brand palettes

The default `moodToOklch` lets hue vary freely based on the
"warmth" axis. If you want output clamped to your own brand
colors, write your own `MoodVector -> Oklch[]` function (same
signature as `moodToOklch`) and pass its result into
`composeBackground` instead.

## License

MIT
