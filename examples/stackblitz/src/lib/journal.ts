export interface JournalDay {
  slug: string
  day: number
  text: string
}

export const journalDays: JournalDay[] = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1
  const moods = [
    'quiet gentle calm reflection',
    'fast exciting launch energy',
    'technical data metrics review',
    'honest community welcome story',
    'regulatory governance compliance',
    'fun joyful simple sharing',
    'architecture infrastructure deploy',
  ]
  return {
    slug: `journal-day-${day}`,
    day,
    text: moods[i % moods.length],
  }
})
