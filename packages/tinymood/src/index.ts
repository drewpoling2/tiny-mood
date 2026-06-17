export { getMoodVector } from './mood-vector.js'
export type { MoodVector, MoodTable } from './types.js'

export { composeBackground } from './compose-background.js'
export type { ComposeOptions, ComposedBackground } from './compose-background.js'

export { createBrandPalette } from './create-brand-palette.js'
export type { BrandPaletteOptions, BrandPalette } from './create-brand-palette.js'

import type { MoodVector, MoodTable } from './types.js'
import { getMoodVector } from './mood-vector.js'
import { moodToOklch } from './mood-to-oklch.js'
import { createBrandPalette } from './create-brand-palette.js'
import { composeBackground, type ComposeOptions, type ComposedBackground } from './compose-background.js'

export interface MoodBackgroundOptions extends ComposeOptions {
  colors?: string[]
  moodToPosition?: (mood: MoodVector) => number
}

export function getMoodBackground(
  text: string,
  table: MoodTable,
  seed?: string | number,
  options?: MoodBackgroundOptions
): ComposedBackground & { mood: MoodVector } {
  const mood = getMoodVector(text, table)

  const palette = options?.colors
    ? createBrandPalette({
        colors: options.colors,
        moodToPosition: options.moodToPosition
      }).paletteFor(mood)
    : moodToOklch(mood)

  const composed = composeBackground(palette, seed ?? text, options)
  return { ...composed, mood }
}
