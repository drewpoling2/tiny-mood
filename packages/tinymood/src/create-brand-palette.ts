/**
 * create-brand-palette-v3.ts
 *
 * Replaces the single-center-hue-lock approach with hue-spread
 * interpolation: the brand's real colors (sorted by hue) define
 * a continuous path, and mood picks a position along that path
 * rather than wobbling around one averaged center point.
 *
 * Why: the v2 approach (chroma-weighted circular mean -> single
 * center +/- small range) correctly fixed a real averaging bug,
 * but it also collapsed any brand with genuinely varied colors
 * (e.g. green + magenta + teal) down to one fictional "in-between"
 * hue, discarding the real range the brand actually has. If a
 * brand supplies 5+ colors spanning real hue variety, mood should
 * be able to land anywhere across that real variety -- including
 * at the extremes -- not just wobble near a computed average.
 *
 * APPROACH:
 * 1. Convert all provided brand colors to OKLCH.
 * 2. Sort them by hue, handling the circular wrap (hue is 0-360
 *    and wraps around) by picking the rotation that minimizes
 *    the total angular spread, so a brand with colors at 350°
 *    and 10° is treated as "close together near 0°", not as
 *    "as far apart as possible by going the long way around".
 * 3. Map a single mood scalar (derived from the 3-axis MoodVector)
 *    to a position t in [0, 1] along that sorted sequence.
 * 4. Interpolate hue, lightness, and chroma between the two
 *    real brand colors nearest that position -- the output is
 *    always a genuine blend of two real brand colors, never an
 *    invented point outside what the brand actually contains.
 */

import type { MoodVector } from './types.js'
import type { Oklch } from './oklch.js'
import { colorToOklch } from './color-to-oklch.js'

export interface BrandPaletteOptions {
  /** Brand colors in any supported format (hex, rgb(), hsl()) */
  colors: string[]
  /**
   * How mood vector axes combine into a single position scalar
   * used to walk along the sorted hue spread. Default uses weight
   * as the base walk with warmth/energy shifts; each output blob
   * is placed across the full axis range so a card's gradient
   * samples real variety from the brand path.
   */
  moodToPosition?: (mood: MoodVector) => number
}

export interface SortedBrandColor extends Oklch {
  /** Position along the sorted sequence, 0 to 1 */
  t: number
}

export interface BrandPalette {
  /** The brand's colors, converted and sorted by hue, for inspection/debugging */
  sortedColors: SortedBrandColor[]
  /**
   * Generate a brand-spread palette for a given mood. Always
   * produces colors that are genuine interpolations between
   * real brand colors -- never a hue outside what the brand
   * actually spans.
   */
  paletteFor: (mood: MoodVector, count?: number) => Oklch[]
}

function defaultMoodToPosition(mood: MoodVector): number {
  // Weight sets the base walk (serious/dark → playful/bright); warmth and
  // energy push in orthogonal directions so the three axes don't collapse
  // into the same ~0.5 midpoint for typical text.
  const base = (mood.weight + 1) / 2
  return Math.max(0, Math.min(1, base + mood.warmth * 0.25 + mood.energy * 0.25))
}

/** Positions for each output blob, spanning the mood's full axis range. */
function blobPositions(mood: MoodVector, centerT: number, count: number): number[] {
  if (count <= 1) return [centerT]

  const axisTs = [
    (mood.weight + 1) / 2,
    (mood.warmth + 1) / 2,
    (mood.energy + 1) / 2
  ]

  const minSpan = 0.35
  let lo = Math.min(...axisTs, centerT - 0.25)
  let hi = Math.max(...axisTs, centerT + 0.25)

  if (hi - lo < minSpan) {
    const mid = (hi + lo) / 2
    lo = Math.max(0, mid - minSpan / 2)
    hi = Math.min(1, mid + minSpan / 2)
  }

  const positions: number[] = []
  for (let i = 0; i < count; i++) {
    positions.push(lo + (i / (count - 1)) * (hi - lo))
  }
  return positions
}

/**
 * Sort hues to minimize total angular spread, correctly handling
 * the circular wrap. This finds the best "cut point" on the
 * circle so the colors read as a sensible left-to-right sequence
 * rather than naive numeric sort breaking near the 0/360 seam.
 */
function sortHuesCircularly(colors: Oklch[]): Oklch[] {
  if (colors.length <= 2) {
    return [...colors].sort((a, b) => a.h - b.h)
  }

  const hues = colors.map(c => c.h)
  let bestStart = 0
  let smallestGap = 360

  // Try each color as a potential "start" of the sequence by
  // finding the largest gap between consecutive sorted hues --
  // the sequence should start right after the largest gap, since
  // that's the natural break point in a circular arrangement.
  const sorted = [...hues].sort((a, b) => a - b)
  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[(i + 1) % sorted.length]
    const gap = next > sorted[i] ? next - sorted[i] : next + 360 - sorted[i]
    if (gap < smallestGap) continue
    smallestGap = gap
    bestStart = (i + 1) % sorted.length
  }

  const rotated = [...sorted.slice(bestStart), ...sorted.slice(0, bestStart)]
  const hueToColor = new Map(colors.map(c => [c.h, c] as const))
  return rotated.map(h => hueToColor.get(h)!).filter(Boolean)
}

/**
 * Assign path positions proportional to hue distance between anchors,
 * not uniform by swatch count. Without this, a cluster of near-duplicate
 * yellows (4 swatches spanning ~36°) occupies 43% of the mood walk while
 * a single teal anchor gets one slot — mood gets "stuck" in the cluster.
 */
function computeHueProportionalT(sorted: Oklch[]): number[] {
  if (sorted.length <= 1) return [0]

  const distances: number[] = []
  let total = 0

  for (let i = 0; i < sorted.length - 1; i++) {
    let diff = sorted[i + 1].h - sorted[i].h
    if (diff < 0) diff += 360
    distances.push(diff)
    total += diff
  }

  if (total === 0) {
    return sorted.map((_, i) => (sorted.length === 1 ? 0 : i / (sorted.length - 1)))
  }

  const tValues = [0]
  let acc = 0
  for (const d of distances) {
    acc += d
    tValues.push(acc / total)
  }
  return tValues
}

export function createBrandPalette(options: BrandPaletteOptions): BrandPalette {
  if (!options.colors || options.colors.length === 0) {
    throw new Error(
      'createBrandPalette requires at least one color in `colors`.'
    )
  }

  const oklchColors = options.colors.map(colorToOklch)
  const sorted = sortHuesCircularly(oklchColors)
  const tPositions = computeHueProportionalT(sorted)

  const sortedColors: SortedBrandColor[] = sorted.map((c, i) => ({
    ...c,
    t: tPositions[i]
  }))

  const moodToPosition = options.moodToPosition ?? defaultMoodToPosition

  function interpolateAt(t: number): Oklch {
    if (sortedColors.length === 1) return sortedColors[0]

    const clampedT = Math.max(0, Math.min(1, t))
    let lower = sortedColors[0]
    let upper = sortedColors[sortedColors.length - 1]

    for (let i = 0; i < sortedColors.length - 1; i++) {
      if (clampedT >= sortedColors[i].t && clampedT <= sortedColors[i + 1].t) {
        lower = sortedColors[i]
        upper = sortedColors[i + 1]
        break
      }
    }

    const span = upper.t - lower.t
    const localT = span === 0 ? 0 : (clampedT - lower.t) / span

    // Interpolate hue along the shortest circular path between
    // the two anchor colors, not the naive linear path (which
    // would be wrong if e.g. lower=350 and upper=10).
    let hueDiff = upper.h - lower.h
    if (hueDiff > 180) hueDiff -= 360
    if (hueDiff < -180) hueDiff += 360
    const h = (lower.h + hueDiff * localT + 360) % 360

    const l = lower.l + (upper.l - lower.l) * localT
    const c = lower.c + (upper.c - lower.c) * localT

    return { l, c, h }
  }

  function paletteFor(mood: MoodVector, count = 5): Oklch[] {
    const centerT = moodToPosition(mood)
    const positions = blobPositions(mood, centerT, count)
    return positions.map(t => interpolateAt(t))
  }

  return { sortedColors, paletteFor }
}
