import type { BlendShape } from 'tiny-mood/browser'
import {
  PRESET_ORDER,
  PRESET_PALETTES,
  presetDotColor,
  type PresetKey,
  type SelectedPreset,
} from '../lib/presets'

interface ControlBarProps {
  selected: SelectedPreset
  onChange: (selected: SelectedPreset) => void
  blendShape: BlendShape
  onBlendShapeChange: (value: BlendShape) => void
  blendIntensity: number
  onBlendIntensityChange: (value: number) => void
}

const BLEND_SHAPES: { value: BlendShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'linear', label: 'Linear' },
  { value: 'spiral', label: 'Spiral' },
]

export function ControlBar({
  selected,
  onChange,
  blendShape,
  onBlendShapeChange,
  blendIntensity,
  onBlendIntensityChange,
}: ControlBarProps) {
  return (
    <div className="control-bar">
      <div className="control-group">
        <span className="control-label">Brand</span>
        <div className="control-pills" role="group" aria-label="Brand palette">
          <button
            type="button"
            className={
              selected === 'unbranded' ? 'control-pill active' : 'control-pill'
            }
            onClick={() => onChange('unbranded')}
          >
            Free hue
          </button>
          {PRESET_ORDER.map((key: PresetKey) => (
            <button
              key={key}
              type="button"
              className={selected === key ? 'control-pill active' : 'control-pill'}
              onClick={() => onChange(key)}
            >
              <span
                className="preset-dot"
                style={{ background: presetDotColor(key) }}
                aria-hidden="true"
              />
              {PRESET_PALETTES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Blend</span>
        <div className="control-pills" role="radiogroup" aria-label="Blend shape">
          {BLEND_SHAPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={blendShape === value}
              className={blendShape === value ? 'control-pill active' : 'control-pill'}
              onClick={() => onBlendShapeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group control-group--slider">
        <span className="control-label">Intensity</span>
        <input
          className="intensity-slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={blendIntensity}
          onChange={e => onBlendIntensityChange(Number(e.target.value))}
          disabled={blendShape === 'round'}
          aria-valuenow={blendIntensity}
        />
      </div>
    </div>
  )
}
