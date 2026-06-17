export const PRESET_PALETTES = {
  // The 4 green values are verified (matched exactly against independently-
  // confirmed OKLCH conversions). Berry, Teal, Gray, and Orange are
  // approximations of classic Game Boy Color shell colors — not verified
  // against an official source. Orange fills the warm gap between berry
  // (6°) and the green cluster (~122°).
  gameboy: {
    label: 'Game Boy',
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
  // Blue-violet core plus warm/cool accents that sit far outside the
  // 219–278° cluster — coral, emerald, and amber are plausible SaaS
  // semantic colors that open the path to ~240° of real hue variety.
  saasBlue: {
    label: 'SaaS Blue',
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
  // Yellow/teal anchors plus violet and red accents — three distinct hue
  // families instead of two near-duplicate yellows and one teal.
  marketingYellow: {
    label: 'Marketing Yellow',
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
  // Restrained neutrals with rose/blue tints bridging two real accents
  // (#2383e2, #e85d75) — tints keep chroma low but anchor the hue path.
  minimalMono: {
    label: 'Minimal Mono',
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
