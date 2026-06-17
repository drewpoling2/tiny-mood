import type { MoodVector, MoodTable } from 'tiny-mood'

export type { MoodVector, MoodTable }

/** A raw embedding vector, dimensionality depends on the source file. */
export type RawVector = number[]

export interface GloveEntry {
  word: string
  vector: RawVector
}
