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
  blendAngleMin: number
  blendAngleMax: number
  onBlendAngleMinChange: (value: number) => void
  onBlendAngleMaxChange: (value: number) => void
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
  blendAngleMin,
  blendAngleMax,
  onBlendAngleMinChange,
  onBlendAngleMaxChange,
}: ControlBarProps) {
  const preset = selected !== 'unbranded' ? PRESET_PALETTES[selected] : null
  const angleDisabled = blendShape === 'round'

  return (
    <div className="control-panel">
      <div className="control-row control-row--brand">
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
        {preset ? (
          <div
            className="brand-colors-strip"
            aria-label={`${preset.label} brand colors`}
          >
            {preset.colors.map(color => (
              <span
                key={color}
                className="brand-color-dot"
                style={{ background: color }}
                title={color}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="control-row control-row--blend">
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

        <span className="control-label control-label--spaced">Intensity</span>
        <div className="control-slider-wrap">
          <input
            className="control-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={blendIntensity}
            onChange={e => onBlendIntensityChange(Number(e.target.value))}
            disabled={blendShape === 'round'}
            aria-valuenow={blendIntensity}
          />
          <span className="control-slider-value">
            {blendIntensity.toFixed(2)}
          </span>
        </div>

        <span className="control-label control-label--spaced">Angle</span>
        <div className="control-angle">
          <div className="control-angle-field">
            <span className="control-sublabel">Min</span>
            <input
              className="control-slider control-slider--angle"
              type="range"
              min={0}
              max={360}
              step={1}
              value={blendAngleMin}
              onChange={e => {
                const next = Number(e.target.value)
                onBlendAngleMinChange(next)
                if (next > blendAngleMax) onBlendAngleMaxChange(next)
              }}
              disabled={angleDisabled}
              aria-label="Blend angle minimum"
            />
            <span className="control-angle-value">{blendAngleMin}°</span>
          </div>
          <div className="control-angle-field">
            <span className="control-sublabel">Max</span>
            <input
              className="control-slider control-slider--angle"
              type="range"
              min={0}
              max={360}
              step={1}
              value={blendAngleMax}
              onChange={e => {
                const next = Number(e.target.value)
                onBlendAngleMaxChange(next)
                if (next < blendAngleMin) onBlendAngleMinChange(next)
              }}
              disabled={angleDisabled}
              aria-label="Blend angle maximum"
            />
            <span className="control-angle-value">{blendAngleMax}°</span>
          </div>
        </div>
      </div>
    </div>
  )
}
