import { useMemo, useState } from 'react'
import type { BlendShape } from 'tiny-mood/browser'
import { ControlBar } from './ControlBar'
import { TabNav } from './TabNav'
import { AvatarsView } from './views/AvatarsView'
import { BlogPostsView } from './views/BlogPostsView'
import { CommitsView } from './views/CommitsView'
import { JournalView } from './views/JournalView'
import { NewsletterView } from './views/NewsletterView'
import { BlendLabView } from './views/BlendLabView'
import { PodcastView } from './views/PodcastView'
import {
  buildMoodOptions,
  type DemoTab,
} from '../lib/demo-types'
import type { SelectedPreset } from '../lib/presets'

export function DemoPlayground() {
  const [tab, setTab] = useState<DemoTab>('blog')
  const [selected, setSelected] = useState<SelectedPreset>('harvestSupply')
  const [blendShape, setBlendShape] = useState<BlendShape>('round')
  const [blendIntensity, setBlendIntensity] = useState(0)
  const [blendAngleMin, setBlendAngleMin] = useState(90)
  const [blendAngleMax, setBlendAngleMax] = useState(160)

  const moodOptions = useMemo(
    () =>
      buildMoodOptions(
        selected,
        blendShape,
        blendIntensity,
        blendAngleMin,
        blendAngleMax
      ),
    [selected, blendShape, blendIntensity, blendAngleMin, blendAngleMax]
  )

  return (
    <>
      <TabNav active={tab} onChange={setTab} />
      <ControlBar
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
      <div className="tab-content">
        {tab === 'blog' ? <BlogPostsView moodOptions={moodOptions} /> : null}
        {tab === 'podcast' ? <PodcastView moodOptions={moodOptions} /> : null}
        {tab === 'newsletter' ? (
          <NewsletterView moodOptions={moodOptions} />
        ) : null}
        {tab === 'avatars' ? <AvatarsView moodOptions={moodOptions} /> : null}
        {tab === 'commits' ? <CommitsView moodOptions={moodOptions} /> : null}
        {tab === 'journal' ? <JournalView moodOptions={moodOptions} /> : null}
        {tab === 'blendLab' ? (
          <BlendLabView moodOptions={moodOptions} />
        ) : null}
      </div>
    </>
  )
}
