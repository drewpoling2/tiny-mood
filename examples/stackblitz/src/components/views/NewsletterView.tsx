import type { MoodOptions } from '../../lib/demo-types'
import { newsletterIssues } from '../../lib/newsletters'
import { useMoodSurface } from '../../hooks/useMoodSurface'

function NewsletterCard({
  issue,
  moodOptions,
}: {
  issue: (typeof newsletterIssues)[number]
  moodOptions?: MoodOptions
}) {
  const text = `${issue.title} ${issue.description}`
  const { background, filter } = useMoodSurface(text, issue.slug, moodOptions)

  return (
    <article className="newsletter-card">
      <div className="newsletter-card-cover" aria-hidden="true">
        <div className="mood-surface" style={{ background, filter }} />
        <div className="newsletter-card-overlay">
          <p className="newsletter-card-meta">
            {issue.publication} · {issue.issue}
          </p>
          <h2 className="newsletter-card-title">{issue.title}</h2>
        </div>
      </div>
      <p className="newsletter-card-desc">{issue.description}</p>
    </article>
  )
}

export function NewsletterView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <div className="newsletter-grid">
      {newsletterIssues.map(issue => (
        <NewsletterCard key={issue.slug} issue={issue} moodOptions={moodOptions} />
      ))}
    </div>
  )
}
