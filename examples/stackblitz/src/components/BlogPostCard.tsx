import type { MoodBackgroundOptions, MoodTable } from 'tiny-mood/browser'
import { getMoodBackground } from 'tiny-mood/browser'
import type { ExamplePost } from '../lib/posts'
import moodTable from '../../mood-table.json'

const table = moodTable as MoodTable

interface BlogPostCardProps {
  post: ExamplePost
  moodOptions?: Pick<
    MoodBackgroundOptions,
    | 'colors'
    | 'moodToPosition'
    | 'blendShape'
    | 'blendIntensity'
    | 'blendAngleRange'
    | 'streakBlurScale'
  >
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function moodLabel(value: number) {
  if (value > 0.15) return 'high'
  if (value < -0.15) return 'low'
  return 'neutral'
}

export function BlogPostCard({ post, moodOptions }: BlogPostCardProps) {
  const text = `${post.title} ${post.description}`
  const { background, filter, mood } = getMoodBackground(
    text,
    table,
    post.slug,
    moodOptions
  )

  return (
    <article className="card">
      <div className="card-cover" aria-hidden="true">
        <div className="card-cover-bg" style={{ background, filter }} />
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-category">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <h2 className="card-title">{post.title}</h2>
        <p className="card-description">{post.description}</p>

        <dl className="card-mood">
          <div>
            <dt>Weight</dt>
            <dd data-level={moodLabel(mood.weight)}>{mood.weight.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Energy</dt>
            <dd data-level={moodLabel(mood.energy)}>{mood.energy.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Warmth</dt>
            <dd data-level={moodLabel(mood.warmth)}>{mood.warmth.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
