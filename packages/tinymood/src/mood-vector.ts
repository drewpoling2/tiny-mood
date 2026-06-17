import type { MoodVector, MoodTable } from './types.js'

const NEUTRAL: MoodVector = { weight: 0, energy: 0, warmth: 0 }

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function clamp(n: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, n))
}

export function getMoodVector(text: string, table: MoodTable): MoodVector {
  if (!text || !text.trim()) return { ...NEUTRAL }

  const tokens = tokenize(text)
  let matches = 0
  const totals: MoodVector = { weight: 0, energy: 0, warmth: 0 }

  for (const token of tokens) {
    const entry = table[token]
    if (!entry) continue
    matches++
    totals.weight += entry.weight
    totals.energy += entry.energy
    totals.warmth += entry.warmth
  }

  if (matches === 0) return { ...NEUTRAL }

  return {
    weight: clamp(totals.weight / matches),
    energy: clamp(totals.energy / matches),
    warmth: clamp(totals.warmth / matches)
  }
}
