/** Browser-safe entry — no Node/fs dependencies. */

export { getMoodVector } from './mood-vector.js'
export type { MoodVector, MoodTable } from './types.js'

export { composeBackground } from './compose-background.js'
export type { ComposeOptions, ComposedBackground, BlendShape } from './compose-background.js'

export { createBrandPalette } from './create-brand-palette.js'
export type { BrandPaletteOptions, BrandPalette } from './create-brand-palette.js'

export {
  getMoodBackground,
  type MoodBackgroundOptions
} from './index.js'
