import type { MoodOptions } from '../../lib/demo-types'
import { podcastEpisodes } from '../../lib/podcasts'
import { useMoodSurface } from '../../hooks/useMoodSurface'

function PodcastCard({
  episode,
  moodOptions,
}: {
  episode: (typeof podcastEpisodes)[number]
  moodOptions?: MoodOptions
}) {
  const text = `${episode.title} ${episode.description}`
  const { background, filter } = useMoodSurface(
    text,
    episode.slug,
    moodOptions
  )

  return (
    <article className="media-card">
      <div className="media-card-cover" aria-hidden="true">
        <div className="mood-surface" style={{ background, filter }} />
      </div>
      <div className="media-card-body">
        <p className="media-card-meta">
          {episode.show} · {episode.episode}
        </p>
        <h2 className="media-card-title">{episode.title}</h2>
        <p className="media-card-desc">{episode.description}</p>
      </div>
    </article>
  )
}

export function PodcastView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <div className="media-grid">
      {podcastEpisodes.map(ep => (
        <PodcastCard key={ep.slug} episode={ep} moodOptions={moodOptions} />
      ))}
    </div>
  )
}
