import type { Oklch } from './oklch.js'
import { oklchToRgbaString } from './oklch.js'
import { createRng, rngRange } from './seeded-random.js'

export interface ComposeOptions {
  blobCount?: number
  blurPx?: number
  blobAlpha?: number
}

export interface ComposedBackground {
  background: string
  filter: string
}

export function composeBackground(
  palette: Oklch[],
  seed: string | number,
  options: ComposeOptions = {}
): ComposedBackground {
  const { blobCount = 5, blurPx = 70, blobAlpha = 0.7 } = options

  if (palette.length === 0) {
    return { background: 'transparent', filter: '' }
  }

  const rng = createRng(seed)
  const gradients: string[] = []

  for (let i = 0; i < blobCount; i++) {
    const color = palette[i % palette.length]
    const x = rngRange(rng, 5, 95)
    const y = rngRange(rng, 5, 95)
    const spread = rngRange(rng, 30, 60)
    const colorStr = oklchToRgbaString({ ...color, alpha: blobAlpha })

    gradients.push(
      `radial-gradient(ellipse at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${colorStr} 0%, transparent ${spread.toFixed(0)}%)`
    )
  }

  if (palette.length >= 2) {
    const a = oklchToRgbaString({ ...palette[0], alpha: 1 })
    const b = oklchToRgbaString({ ...palette[1], alpha: 1 })
    gradients.push(`linear-gradient(135deg, ${a}, ${b})`)
  }

  return {
    background: gradients.join(', '),
    filter: blurPx > 0 ? `blur(${blurPx}px)` : ''
  }
}
