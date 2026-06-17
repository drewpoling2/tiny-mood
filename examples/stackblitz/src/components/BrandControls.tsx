import type { BlendShape } from 'tiny-mood/browser'
import { createBrandPalette } from 'tiny-mood/browser'
import { PRESET_PALETTES, type SelectedPreset } from '../lib/presets'

interface BrandControlsProps {
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

function hueSpan(sorted: { h: number }[]): number {
  if (sorted.length <= 1) return 0
  const first = sorted[0].h
  const last = sorted[sorted.length - 1].h
  return last >= first ? last - first : 360 - first + last
}

function oklchCss(entry: { l: number; c: number; h: number }): string {
  return `oklch(${(entry.l * 100).toFixed(1)}% ${entry.c.toFixed(3)} ${entry.h.toFixed(1)})`
}

const BLEND_SHAPES: { value: BlendShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'linear', label: 'Linear' },
  { value: 'spiral', label: 'Spiral' },
]

export function BrandControls({
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
}: BrandControlsProps) {
  const preset = selected !== 'unbranded' ? PRESET_PALETTES[selected] : null

  const path = preset
    ? createBrandPalette({ colors: [...preset.colors] })
    : null

  const angleApplies = blendShape === 'linear' || blendShape === 'spiral'

  return (
    <section className="brand-panel">
      <div className="brand-panel-header">
        <h2>Brand palette</h2>
        <p>
          Same blog posts, different brand guardrails — mood walks a path
          through your real brand colors, not a single averaged hue.
        </p>
      </div>

      <div className="brand-presets" role="group" aria-label="Brand palette preset">
        <button
          type="button"
          className={selected === 'unbranded' ? 'brand-preset active' : 'brand-preset'}
          onClick={() => onChange('unbranded')}
        >
          Unbranded (default)
        </button>

        {(Object.entries(PRESET_PALETTES) as [keyof typeof PRESET_PALETTES, (typeof PRESET_PALETTES)[keyof typeof PRESET_PALETTES]][]).map(
          ([key, preset]) => (
            <button
              key={key}
              type="button"
              className={selected === key ? 'brand-preset active' : 'brand-preset'}
              onClick={() => onChange(key)}
            >
              {preset.label}
              <span className="brand-preset-swatches">
                {preset.colors.slice(0, 8).map(color => (
                  <span
                    key={color}
                    className="brand-swatch"
                    style={{ background: color }}
                  />
                ))}
              </span>
            </button>
          )
        )}
      </div>

      <div className="streak-control">
        <fieldset className="blend-shape-fieldset">
          <legend>Blend shape</legend>
          <div className="blend-shape-options" role="radiogroup" aria-label="Blend shape">
            {BLEND_SHAPES.map(({ value, label }) => (
              <label key={value} className="blend-shape-option">
                <input
                  type="radio"
                  name="blend-shape"
                  value={value}
                  checked={blendShape === value}
                  onChange={() => onBlendShapeChange(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="blend-intensity">
          Intensity{' '}
          <span className="streak-value">{blendIntensity.toFixed(2)}</span>
        </label>
        <input
          id="blend-intensity"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={blendIntensity}
          onChange={e => onBlendIntensityChange(Number(e.target.value))}
          disabled={blendShape === 'round'}
        />
        <p className="brand-derived muted">
          {blendShape === 'round'
            ? 'Round is the baseline — soft blobs with no intensity-driven variation.'
            : blendShape === 'linear'
              ? 'Diagonal streak bands — blur and round blobs fade as intensity rises.'
              : 'Conic wedge rays with transparent gaps — sharper/graphic; uses a much lower blur ceiling than linear.'}
        </p>

        {angleApplies ? (
          <div className="streak-angle-range">
            <label htmlFor="blend-angle-min">
              Angle min <span className="streak-value">{blendAngleMin}°</span>
            </label>
            <input
              id="blend-angle-min"
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
            />
            <label htmlFor="blend-angle-max">
              Angle max <span className="streak-value">{blendAngleMax}°</span>
            </label>
            <input
              id="blend-angle-max"
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
            />
            <p className="brand-derived muted">
              Direction guardrail for linear streaks and spiral rotation — each
              layer picks a random angle between min and max (seeded per post).
            </p>
          </div>
        ) : null}
      </div>

      {path ? (
        <div className="brand-path">
          <p className="brand-derived">
            Color path: <strong>{path.sortedColors.length}</strong> brand colors
            sorted from <strong>{path.sortedColors[0].h.toFixed(0)}°</strong> to{' '}
            <strong>{path.sortedColors[path.sortedColors.length - 1].h.toFixed(0)}°</strong>
            , spanning <strong>{hueSpan(path.sortedColors).toFixed(0)}°</strong> of hue
          </p>
          <ul className="brand-path-swatches">
            {path.sortedColors.map((entry, i) => (
              <li key={i} title={`t=${entry.t.toFixed(2)} — ${entry.h.toFixed(1)}°`}>
                <span className="brand-swatch" style={{ background: oklchCss(entry) }} />
                <span className="brand-path-hue">{entry.h.toFixed(0)}°</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="brand-derived muted">
          No brand clamp — hue varies freely from each post&apos;s mood.
        </p>
      )}
    </section>
  )
}
