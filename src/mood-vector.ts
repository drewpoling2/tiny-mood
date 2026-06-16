export interface MoodVector {
  weight: number
  energy: number
  warmth: number
}

const NEUTRAL: MoodVector = { weight: 0, energy: 0, warmth: 0 }

const LEXICON: Record<string, Partial<MoodVector>> = {
  launch: { energy: 0.6, warmth: 0.2 },
  ship: { energy: 0.6 },
  fast: { energy: 0.5 },
  now: { energy: 0.4 },
  breaking: { energy: 0.6, weight: -0.2 },
  urgent: { energy: 0.7, weight: -0.3 },
  new: { energy: 0.3, weight: 0.2 },
  announcing: { energy: 0.5, warmth: 0.3 },
  introducing: { energy: 0.4, warmth: 0.2 },
  exciting: { energy: 0.6, warmth: 0.3, weight: 0.2 },
  power: { energy: 0.4 },
  fire: { energy: 0.5 },

  quiet: { energy: -0.6, weight: 0.1 },
  calm: { energy: -0.6 },
  steady: { energy: -0.4 },
  slow: { energy: -0.4 },
  gentle: { energy: -0.5, warmth: 0.4, weight: 0.3 },
  reflect: { energy: -0.4, weight: -0.1 },
  reflecting: { energy: -0.4, weight: -0.1 },
  thoughts: { energy: -0.3 },
  notes: { energy: -0.3 },
  journal: { energy: -0.3, warmth: 0.2 },

  architecture: { weight: -0.4, energy: -0.2 },
  schema: { weight: -0.4, energy: -0.2 },
  infrastructure: { weight: -0.4, energy: -0.2 },
  problem: { weight: -0.3, energy: -0.1 },
  failure: { weight: -0.5, warmth: -0.2 },
  error: { weight: -0.3, warmth: -0.2, energy: 0.2 },
  bug: { weight: -0.2, energy: 0.1 },
  postmortem: { weight: -0.5, energy: -0.2 },
  serious: { weight: -0.4 },
  difficult: { weight: -0.4, energy: -0.1 },
  hard: { weight: -0.3 },

  fun: { weight: 0.5, warmth: 0.3, energy: 0.2 },
  playful: { weight: 0.6, warmth: 0.3 },
  simple: { weight: 0.3, energy: -0.1 },
  easy: { weight: 0.3 },
  small: { weight: 0.2, energy: -0.1 },
  tiny: { weight: 0.3, energy: -0.1 },
  delight: { weight: 0.5, warmth: 0.4, energy: 0.2 },
  delightful: { weight: 0.5, warmth: 0.4, energy: 0.2 },

  welcome: { warmth: 0.5, energy: 0.1 },
  community: { warmth: 0.5 },
  thanks: { warmth: 0.5 },
  thank: { warmth: 0.5 },
  together: { warmth: 0.4 },
  story: { warmth: 0.3, weight: 0.1 },
  journey: { warmth: 0.3, energy: 0.1 },
  honest: { warmth: 0.3, weight: -0.1 },
  learned: { warmth: 0.2, weight: -0.1 },

  technical: { warmth: -0.3, weight: -0.2 },
  data: { warmth: -0.3 },
  metrics: { warmth: -0.3, energy: 0.1 },
  benchmark: { warmth: -0.3, energy: 0.1 },
  protocol: { warmth: -0.4, weight: -0.2 },
  spec: { warmth: -0.3, weight: -0.2 },
  system: { warmth: -0.2, weight: -0.1 },

  release: { energy: 0.3, weight: 0.1 },
  milestone: { energy: 0.3, warmth: 0.2 },
  update: { energy: 0.2 },
  changelog: { energy: 0.1, weight: -0.1 }
}

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

export function getMoodVector(text: string): MoodVector {
  if (!text || !text.trim()) return { ...NEUTRAL }

  const tokens = tokenize(text)
  let matches = 0
  const totals: MoodVector = { weight: 0, energy: 0, warmth: 0 }

  for (const token of tokens) {
    const entry = LEXICON[token]
    if (!entry) continue
    matches++
    totals.weight += entry.weight ?? 0
    totals.energy += entry.energy ?? 0
    totals.warmth += entry.warmth ?? 0
  }

  if (matches === 0) return { ...NEUTRAL }

  return {
    weight: clamp(totals.weight / matches),
    energy: clamp(totals.energy / matches),
    warmth: clamp(totals.warmth / matches)
  }
}
