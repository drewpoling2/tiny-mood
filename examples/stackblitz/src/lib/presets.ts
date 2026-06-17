export const PRESET_PALETTES = {
  // Nostalgia Co. — classic handheld greens plus berry, teal, gray, orange accents.
  nostalgiaCo: {
    label: 'Nostalgia Co.',
    colors: [
      '#0f380f',
      '#306230',
      '#8bac0f',
      '#9bbc0f',
      '#c83264',
      '#ff8800',
      '#1a8fa3',
      '#9a9a9a',
    ],
  },
  // Ledger & Loop — blue-violet SaaS core with coral, emerald, and amber accents.
  ledgerLoop: {
    label: 'Ledger & Loop',
    colors: [
      '#635bff',
      '#0a2540',
      '#00d4ff',
      '#425466',
      '#f6f9fc',
      '#ff6b4a',
      '#10b981',
      '#fbbf24',
    ],
  },
  // Tidewell — deep ocean blues through bright surf and sea-glass teal.
  // Coral (#fb7185) is an invented coastal accent — not a verified real-world
  // brand color — to open hue range beyond the blue/teal cluster.
  tidewell: {
    label: 'Tidewell',
    colors: [
      '#0a1628',
      '#0c4a6e',
      '#0369a1',
      '#0ea5e9',
      '#38bdf8',
      '#164e63',
      '#14b8a6',
      '#e0f2fe',
      '#fb7185',
    ],
  },
  // Harvest Supply — burnt earth through amber harvest tones.
  // Deep olive (#3f6212) is an invented agricultural accent — not a verified
  // real-world brand color — to open hue range beyond the orange/amber cluster.
  harvestSupply: {
    label: 'Harvest Supply',
    colors: [
      '#451a03',
      '#7c2d12',
      '#9a3412',
      '#c2410c',
      '#ea580c',
      '#f97316',
      '#fb923c',
      '#fbbf24',
      '#3f6212',
    ],
  },
  // Bright Signal — yellow/teal marketing anchors with violet and coral accents.
  brightSignal: {
    label: 'Bright Signal',
    colors: [
      '#ffe01b',
      '#241c15',
      '#007c89',
      '#ffc107',
      '#73706b',
      '#7c3aed',
      '#e63946',
      '#2dd4bf',
    ],
  },
  // Northbound — restrained neutrals with rose/blue tints and two accent hues.
  northbound: {
    label: 'Northbound',
    colors: [
      '#000000',
      '#373530',
      '#64748b',
      '#9b9a97',
      '#fdf2f4',
      '#eff6ff',
      '#2383e2',
      '#e85d75',
    ],
  },
} as const

export type PresetKey = keyof typeof PRESET_PALETTES

export type SelectedPreset = PresetKey | 'unbranded'

export const PRESET_ORDER = [
  'nostalgiaCo',
  'ledgerLoop',
  'tidewell',
  'harvestSupply',
  'brightSignal',
  'northbound',
] as const satisfies readonly PresetKey[]

/** Representative swatch shown on each preset pill (first of eight brand colors). */
export function presetDotColor(key: PresetKey): string {
  return PRESET_PALETTES[key].colors[0]
}
