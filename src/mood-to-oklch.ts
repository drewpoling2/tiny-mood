import type { MoodVector } from './mood-vector.js'
import type { Oklch } from './oklch.js'

function warmthToHue(warmth: number): number {
  if (warmth >= 0) {
    return 150 - warmth * 120
  }
  return 150 + Math.abs(warmth) * 110
}

export function moodToOklch(mood: MoodVector, count = 5): Oklch[] {
  const baseHue = warmthToHue(mood.warmth)
  const baseLightness = 0.55 + mood.weight * 0.15
  const baseChroma = 0.1 + (mood.energy + 1) * 0.05

  const colors: Oklch[] = []
  for (let i = 0; i < count; i++) {
    const hueSpread = 15 + (mood.energy + 1) * 15
    const hue = (baseHue + (i - count / 2) * hueSpread + 360) % 360

    const lightness = Math.max(
      0.25,
      Math.min(0.85, baseLightness + (i % 2 === 0 ? 0.05 : -0.05))
    )
    const chroma = Math.max(0.02, Math.min(0.3, baseChroma + (i % 3) * 0.02))

    colors.push({ l: lightness, c: chroma, h: hue })
  }

  return colors
}
