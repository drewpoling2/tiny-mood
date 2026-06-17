/** Display label → mood-table lookup word (all words exist in mood-table.json). */
export const BLEND_LAB_TAGS = [
  { word: 'calm', label: 'calm' },
  { word: 'fast', label: 'urgent' },
  { word: 'fun', label: 'fun' },
  { word: 'technical', label: 'technical' },
  { word: 'journey', label: 'deep' },
  { word: 'gentle', label: 'gentle' },
  { word: 'launch', label: 'bold' },
  { word: 'quiet', label: 'quiet' },
  { word: 'welcome', label: 'warm' },
  { word: 'regulatory', label: 'serious' },
] as const

export type BlendLabTagWord = (typeof BLEND_LAB_TAGS)[number]['word']

export const BLEND_LAB_MAX_TAGS = 3

export const BLEND_LAB_DEFAULT_TAGS: BlendLabTagWord[] = ['calm', 'fast']

export function blendLabText(words: BlendLabTagWord[]): string {
  return words.join(' ')
}
