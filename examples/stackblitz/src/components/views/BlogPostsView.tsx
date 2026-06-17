import type { MoodOptions } from '../../lib/demo-types'
import { formatMoodValue } from '../../lib/mood-format'
import type { ExamplePost } from '../../lib/posts'
import { examplePosts } from '../../lib/posts'
import { useMoodSurface } from '../../hooks/useMoodSurface'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function BlogCard({
  post,
  moodOptions,
}: {
  post: ExamplePost
  moodOptions?: MoodOptions
}) {
  const text = `${post.title} ${post.description}`
  const { background, filter, mood } = useMoodSurface(
    text,
    post.slug,
    moodOptions
  )

  return (
    <article className="blog-card">
      <div className="blog-card-cover" aria-hidden="true">
        <div className="mood-surface" style={{ background, filter }} />
      </div>
      <div className="blog-card-body">
        <p className="blog-card-meta">
          <span>{post.category}</span>
          <span>{formatDate(post.date)}</span>
        </p>
        <h2 className="blog-card-title">{post.title}</h2>
        <p className="blog-card-desc">{post.description}</p>
        <dl className="mood-stats">
          <div>
            <dt>Weight</dt>
            <dd>{formatMoodValue(mood.weight)}</dd>
          </div>
          <div>
            <dt>Energy</dt>
            <dd>{formatMoodValue(mood.energy)}</dd>
          </div>
          <div>
            <dt>Warmth</dt>
            <dd>{formatMoodValue(mood.warmth)}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function BlogPostsView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <div className="blog-grid">
      {examplePosts.map(post => (
        <BlogCard key={post.slug} post={post} moodOptions={moodOptions} />
      ))}
    </div>
  )
}
