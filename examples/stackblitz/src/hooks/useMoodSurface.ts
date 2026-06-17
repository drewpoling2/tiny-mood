import { useMemo } from 'react'
import type { MoodTable } from 'tiny-mood/browser'
import { getMoodBackground } from 'tiny-mood/browser'
import type { MoodOptions } from '../lib/demo-types'
import moodTable from '../../mood-table.json'

const table = moodTable as MoodTable

export function useMoodSurface(
  text: string,
  seed: string,
  moodOptions?: MoodOptions
) {
  return useMemo(
    () => getMoodBackground(text, table, seed, moodOptions),
    [text, seed, moodOptions]
  )
}
