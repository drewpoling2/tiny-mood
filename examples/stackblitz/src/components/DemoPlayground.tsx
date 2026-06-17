import { useState } from 'react'
import type { BlendShape } from 'tiny-mood/browser'
import { BlogPostCard } from './BlogPostCard'
import { BrandControls } from './BrandControls'
import { PRESET_PALETTES, type SelectedPreset } from '../lib/presets'
import { examplePosts } from '../lib/posts'

export function DemoPlayground() {
  const [selected, setSelected] = useState<SelectedPreset>('unbranded')
  const [blendShape, setBlendShape] = useState<BlendShape>('round')
  const [blendIntensity, setBlendIntensity] = useState(0)
  const [blendAngleMin, setBlendAngleMin] = useState(100)
  const [blendAngleMax, setBlendAngleMax] = useState(160)

  const preset = selected !== 'unbranded' ? PRESET_PALETTES[selected] : null
  const moodOptions = {
    blendShape,
    blendIntensity,
    blendAngleRange: [blendAngleMin, blendAngleMax] as [number, number],
    ...(preset ? { colors: [...preset.colors] } : {}),
  }

  return (
    <>
      <BrandControls
        selected={selected}
        onChange={setSelected}
        blendShape={blendShape}
        onBlendShapeChange={setBlendShape}
        blendIntensity={blendIntensity}
        onBlendIntensityChange={setBlendIntensity}
        blendAngleMin={blendAngleMin}
        blendAngleMax={blendAngleMax}
        onBlendAngleMinChange={setBlendAngleMin}
        onBlendAngleMaxChange={setBlendAngleMax}
      />

      <ul className="card-grid">
        {examplePosts.map(post => (
          <li key={post.slug}>
            <BlogPostCard post={post} moodOptions={moodOptions} />
          </li>
        ))}
      </ul>
    </>
  )
}
