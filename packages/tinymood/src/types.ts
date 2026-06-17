export interface MoodVector {
  weight: number
  energy: number
  warmth: number
}

/** word -> calibrated MoodVector, produced by tiny-mood-generate */
export type MoodTable = Record<string, MoodVector>
