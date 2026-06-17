/**
 * Blob-composition backgrounds with optional blend shapes.
 *
 * `blendShape='round'` (default) reproduces the original soft radial blooms.
 * `blendShape='linear'` adds diagonal streak bands driven by `blendIntensity`.
 * `blendShape='spiral'` stacks transparent-gap conic wedges (low blur ceiling).
 */

import type { Oklch } from './oklch.js'
import { oklchToRgbaString } from './oklch.js'
import { createRng, rngRange } from './seeded-random.js'

export type BlendShape = 'round' | 'linear' | 'spiral'

export interface ComposeOptions {
  blobCount?: number
  blurPx?: number
  blobAlpha?: number
  /**
   * How color blobs are composed. `'round'` always renders soft radial blooms
   * (ignores `blendIntensity`). `'linear'` and `'spiral'` express their shape
   * as `blendIntensity` rises from 0 to 1.
   */
  blendShape?: BlendShape
  /**
   * 0–1 strength of the selected non-round shape. At 0, output matches
   * `'round'` regardless of `blendShape`.
   */
  blendIntensity?: number
  /**
   * Allowed direction/rotation band in degrees (seeded per layer).
   * Linear: streak angle. Spiral: conic `from` rotation. Default [100, 160].
   */
  blendAngleRange?: [number, number]
  /**
   * Max fraction of blur removed at blendIntensity=1 for linear shape.
   * Spiral uses its own low blur ceiling; round ignores intensity.
   */
  streakBlurScale?: number
  /** Blur floor at blendIntensity=1. Default 6. */
  minBlurPx?: number
}

export interface ComposedBackground {
  background: string
  filter: string
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function resolveAngleRange(range?: [number, number]): [number, number] {
  const [a, b] = range ?? [100, 160]
  return a <= b ? [a, b] : [b, a]
}

function randomAngleInRange(
  rng: ReturnType<typeof createRng>,
  range?: [number, number]
): number {
  const [angleMin, angleMax] = resolveAngleRange(range)
  if (angleMax - angleMin >= 360) {
    return rngRange(rng, 0, 360) % 360
  }
  return rngRange(rng, angleMin, angleMax) % 360
}

function pushLinearBeam(
  gradients: string[],
  colorStr: string,
  angle: number,
  beamCenter: number,
  coreWidth: number,
  fadeWidth: number
): void {
  const coreLo = Math.max(0, beamCenter - coreWidth / 2)
  const coreHi = Math.min(100, beamCenter + coreWidth / 2)
  const fadeLo = Math.max(0, beamCenter - fadeWidth)
  const fadeHi = Math.min(100, beamCenter + fadeWidth)
  gradients.push(
    `linear-gradient(${angle.toFixed(0)}deg, transparent ${fadeLo.toFixed(0)}%, ${colorStr} ${coreLo.toFixed(0)}%, ${colorStr} ${coreHi.toFixed(0)}%, transparent ${fadeHi.toFixed(0)}%)`
  )
}

function appendRoundBlobs(
  gradients: string[],
  palette: Oklch[],
  rng: ReturnType<typeof createRng>,
  blobCount: number,
  blobAlpha: number
): void {
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
}

function appendLinearBlend(
  gradients: string[],
  palette: Oklch[],
  rng: ReturnType<typeof createRng>,
  intensity: number,
  blobCount: number,
  blobAlpha: number,
  blendAngleRange?: [number, number]
): void {
  const streakCount = Math.max(1, Math.round(lerp(2, 10, intensity)))
  const beamAlpha = blobAlpha * lerp(0.25, 0.95, intensity)

  for (let i = 0; i < streakCount; i++) {
    const color = palette[i % palette.length]
    const colorStr = oklchToRgbaString({ ...color, alpha: beamAlpha })
    const angle = randomAngleInRange(rng, blendAngleRange)
    const beamCenter = rngRange(rng, 8, 92)
    const coreWidth = rngRange(rng, 5, 14) * lerp(1.1, 0.42, intensity)
    const fadeWidth = coreWidth * lerp(3.6, 1.1, intensity)
    pushLinearBeam(gradients, colorStr, angle, beamCenter, coreWidth, fadeWidth)
  }

  const smearCount = Math.max(1, Math.round(lerp(2, blobCount + 3, intensity)))
  const smearAlpha = blobAlpha * lerp(0.3, 0.85, intensity)
  for (let i = 0; i < smearCount; i++) {
    const color = palette[(i + streakCount) % palette.length]
    const colorStr = oklchToRgbaString({ ...color, alpha: smearAlpha })
    const smearAngle = randomAngleInRange(rng, blendAngleRange)
    const smearRad = (smearAngle * Math.PI) / 180
    const offset = rngRange(rng, -40, 40)
    const x = 50 + offset * Math.sin(smearRad) + rngRange(rng, -4, 4)
    const y = 50 - offset * Math.cos(smearRad) + rngRange(rng, -4, 4)
    const length = rngRange(rng, 100, 220) * lerp(0.3, 1.0, intensity)
    const thickness = rngRange(rng, 4, 9) * lerp(1.0, 0.32, intensity)
    gradients.push(
      `radial-gradient(ellipse ${length.toFixed(0)}% ${Math.max(2, thickness).toFixed(0)}% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${colorStr} 0%, transparent 100%)`
    )
  }

  const roundBlobWeight = Math.max(0, 1 - intensity * 1.12)
  if (roundBlobWeight > 0.02) {
    for (let i = 0; i < blobCount; i++) {
      const color = palette[i % palette.length]
      const x = rngRange(rng, 5, 95)
      const y = rngRange(rng, 5, 95)
      const spread = rngRange(rng, 30, 60)
      const colorStr = oklchToRgbaString({
        ...color,
        alpha: blobAlpha * roundBlobWeight
      })

      if (intensity > 0.15) {
        const widthPct = spread * (1 + intensity * 2.5)
        const heightPct = spread * (1 - intensity * 0.85)
        gradients.push(
          `radial-gradient(ellipse ${widthPct.toFixed(0)}% ${Math.max(3, heightPct).toFixed(0)}% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${colorStr} 0%, transparent 100%)`
        )
      } else {
        gradients.push(
          `radial-gradient(ellipse at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${colorStr} 0%, transparent ${spread.toFixed(0)}%)`
        )
      }
    }
  }
}

function appendSpiralBlend(
  gradients: string[],
  palette: Oklch[],
  rng: ReturnType<typeof createRng>,
  intensity: number,
  blobCount: number,
  blobAlpha: number,
  blendAngleRange?: [number, number]
): void {
  const wedgeAlpha = blobAlpha * lerp(0.5, 1, intensity)

  for (let i = 0; i < blobCount; i++) {
    const color = palette[i % palette.length]
    const colorStr = oklchToRgbaString({ ...color, alpha: wedgeAlpha })
    const fromAngle = randomAngleInRange(rng, blendAngleRange)
    const x = rngRange(rng, 15, 85)
    const y = rngRange(rng, 15, 85)
    gradients.push(
      `conic-gradient(from ${fromAngle.toFixed(0)}deg at ${x.toFixed(1)}% ${y.toFixed(1)}%, transparent 0deg, ${colorStr} 60deg, transparent 140deg, transparent 360deg)`
    )
  }
}

export function composeBackground(
  palette: Oklch[],
  seed: string | number,
  options: ComposeOptions = {}
): ComposedBackground {
  const {
    blobCount = 5,
    blurPx = 70,
    blobAlpha = 0.7,
    blendShape = 'round',
    blendIntensity = 0,
    blendAngleRange,
    streakBlurScale = 0.92,
    minBlurPx = 6
  } = options

  if (palette.length === 0) {
    return { background: 'transparent', filter: '' }
  }

  const intensity = clamp01(blendIntensity)
  const shape: BlendShape =
    intensity <= 0 || blendShape === 'round' ? 'round' : blendShape
  const rng = createRng(seed)
  const gradients: string[] = []

  if (shape === 'round') {
    appendRoundBlobs(gradients, palette, rng, blobCount, blobAlpha)
  } else if (shape === 'linear') {
    appendLinearBlend(
      gradients,
      palette,
      rng,
      intensity,
      blobCount,
      blobAlpha,
      blendAngleRange
    )
  } else {
    appendSpiralBlend(
      gradients,
      palette,
      rng,
      intensity,
      blobCount,
      blobAlpha,
      blendAngleRange
    )
  }

  if (palette.length >= 2) {
    const baseAlpha =
      shape === 'round' || shape === 'spiral'
        ? 1
        : lerp(1, 0.15, Math.max(0, (intensity - 0.4) / 0.6))
    const a = oklchToRgbaString({ ...palette[0], alpha: baseAlpha })
    const b = oklchToRgbaString({ ...palette[1], alpha: baseAlpha })
    gradients.push(`linear-gradient(135deg, ${a}, ${b})`)
  }

  let effectiveBlur: number
  if (shape === 'round') {
    effectiveBlur = blurPx
  } else if (shape === 'spiral') {
    effectiveBlur = Math.round(blurPx * (1 - intensity) * 0.15)
  } else {
    effectiveBlur = Math.round(
      Math.max(minBlurPx, blurPx * (1 - intensity * streakBlurScale))
    )
  }

  return {
    background: gradients.join(', '),
    filter: effectiveBlur > 0 ? `blur(${effectiveBlur}px)` : ''
  }
}
