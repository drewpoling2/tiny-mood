export { getMoodVector } from './mood-vector.js'
export type { MoodVector } from './mood-vector.js'

export { moodToOklch } from './mood-to-oklch.js'

export { composeBackground } from './compose-background.js'
export type { ComposeOptions, ComposedBackground } from './compose-background.js'

export { oklchToRgbaString } from './oklch.js'
export type { Oklch } from './oklch.js'

export { createRng, hashStringToSeed } from './seeded-random.js'

import type { MoodVector } from './mood-vector.js'
import { getMoodVector } from './mood-vector.js'
import { moodToOklch } from './mood-to-oklch.js'
import { composeBackground, type ComposeOptions, type ComposedBackground } from './compose-background.js'

export function getMoodBackground(
  text: string,
  seed?: string | number,
  options?: ComposeOptions
): ComposedBackground & { mood: MoodVector } {
  const mood = getMoodVector(text)
  const palette = moodToOklch(mood)
  const composed = composeBackground(palette, seed ?? text, options)
  return { ...composed, mood }
}
