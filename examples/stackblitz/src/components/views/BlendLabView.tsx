import { useMemo, useState } from 'react'
import type { MoodTable, MoodVector } from 'tiny-mood/browser'
import { getMoodBackground } from 'tiny-mood/browser'
import { MoodAxisStat } from '../MoodAxisStat'
import { MoodClip } from '../MoodClip'
import type { MoodOptions } from '../../lib/demo-types'
import {
  BLEND_LAB_DEFAULT_TAGS,
  BLEND_LAB_MAX_TAGS,
  BLEND_LAB_TAGS,
  blendLabText,
  type BlendLabTagWord,
} from '../../lib/blend-lab-tags'
import moodTable from '../../../mood-table.json'

const table = moodTable as MoodTable

function tagByWord(word: BlendLabTagWord) {
  return BLEND_LAB_TAGS.find(t => t.word === word)!
}

export function BlendLabView({ moodOptions }: { moodOptions?: MoodOptions }) {
  const [selected, setSelected] = useState<BlendLabTagWord[]>(
    BLEND_LAB_DEFAULT_TAGS
  )

  const text = blendLabText(selected)
  const seed = selected.length ? selected.join('-') : 'blend-lab-empty'

  const { background, filter, mood } = useMemo(
    () => getMoodBackground(text, table, seed, moodOptions),
    [text, seed, moodOptions]
  )

  const breakdown = useMemo(
    () =>
      selected.map(word => ({
        word,
        label: tagByWord(word).label,
        mood: table[word] as MoodVector,
      })),
    [selected]
  )

  function toggleTag(word: BlendLabTagWord) {
    setSelected(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word)
      }
      if (prev.length >= BLEND_LAB_MAX_TAGS) {
        return [...prev.slice(1), word]
      }
      return [...prev, word]
    })
  }

  return (
    <section className="blend-lab">
      <MoodClip className="blend-lab-hero" background={background} filter={filter}>
        <div className="blend-lab-hero-stats">
          <MoodAxisStat axis="weight" value={mood.weight} large />
          <MoodAxisStat axis="energy" value={mood.energy} large />
          <MoodAxisStat axis="warmth" value={mood.warmth} large />
        </div>
      </MoodClip>

      <p className="blend-lab-hint">
        Pick up to {BLEND_LAB_MAX_TAGS} — watch the gradient and numbers shift
      </p>

      <div className="blend-lab-tags" role="group" aria-label="Mood tags">
        {BLEND_LAB_TAGS.map(({ word, label }) => {
          const active = selected.includes(word)
          return (
            <button
              key={word}
              type="button"
              className={active ? 'blend-lab-tag active' : 'blend-lab-tag'}
              aria-pressed={active}
              onClick={() => toggleTag(word)}
            >
              {label}
            </button>
          )
        })}
      </div>

      {breakdown.length > 0 ? (
        <div className="blend-lab-breakdown">
          <h2 className="blend-lab-breakdown-title">Per-word breakdown</h2>
          <div className="blend-lab-breakdown-grid">
            {breakdown.map(({ word, label, mood: wordMood }) => (
              <article key={word} className="blend-lab-breakdown-card">
                <h3>{label}</h3>
                <div className="blend-lab-breakdown-stats">
                  <MoodAxisStat axis="weight" value={wordMood.weight} />
                  <MoodAxisStat axis="energy" value={wordMood.energy} />
                  <MoodAxisStat axis="warmth" value={wordMood.warmth} />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <p className="blend-lab-empty">Select at least one tag to see a mood.</p>
      )}
    </section>
  )
}
