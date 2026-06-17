import type { BlendShape, MoodBackgroundOptions } from 'tiny-mood/browser'
import type { SelectedPreset } from './presets'
import { PRESET_PALETTES } from './presets'

export type DemoTab =
  | 'blog'
  | 'podcast'
  | 'newsletter'
  | 'avatars'
  | 'commits'
  | 'journal'
  | 'blendLab'

export type MoodOptions = Pick<
  MoodBackgroundOptions,
  'colors' | 'blendShape' | 'blendIntensity' | 'blendAngleRange'
>

export interface DemoState {
  tab: DemoTab
  selected: SelectedPreset
  blendShape: BlendShape
  blendIntensity: number
}

export function buildMoodOptions(
  selected: SelectedPreset,
  blendShape: BlendShape,
  blendIntensity: number,
  blendAngleMin: number,
  blendAngleMax: number
): MoodOptions {
  const preset = selected !== 'unbranded' ? PRESET_PALETTES[selected] : null
  return {
    blendShape,
    blendIntensity,
    blendAngleRange: [blendAngleMin, blendAngleMax],
    ...(preset ? { colors: [...preset.colors] } : {}),
  }
}

export type { SelectedPreset, PresetKey, PRESET_ORDER } from './presets'
export { presetDotColor } from './presets'
