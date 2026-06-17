import type { MoodOptions } from '../../lib/demo-types'
import { formatMoodValue } from '../../lib/mood-format'
import { commitEntries } from '../../lib/commits'
import { useMoodSurface } from '../../hooks/useMoodSurface'

function CommitRow({
  entry,
  moodOptions,
}: {
  entry: (typeof commitEntries)[number]
  moodOptions?: MoodOptions
}) {
  const { background, filter, mood } = useMoodSurface(
    entry.message,
    entry.slug,
    moodOptions
  )

  return (
    <article className="commit-row">
      <div
        className="commit-swatch"
        aria-hidden="true"
        style={{ background, filter }}
      />
      <div className="commit-body">
        <p className="commit-message">{entry.message}</p>
        <p className="commit-meta">
          {entry.hash} · {entry.author} · {entry.ago}
        </p>
      </div>
      <dl className="commit-mood">
        <div>
          <dt>W</dt>
          <dd>{formatMoodValue(mood.weight)}</dd>
        </div>
        <div>
          <dt>E</dt>
          <dd>{formatMoodValue(mood.energy)}</dd>
        </div>
        <div>
          <dt>N</dt>
          <dd>{formatMoodValue(mood.warmth)}</dd>
        </div>
      </dl>
    </article>
  )
}

export function CommitsView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <section className="commits-panel">
      <p className="view-lede">
        Each commit gets a mood swatch derived from its message — a glanceable
        emotional signal before reading any text. Urgent fixes read hot; quiet
        docs read cool.
      </p>
      <div className="commit-list">
        {commitEntries.map(entry => (
          <CommitRow key={entry.slug} entry={entry} moodOptions={moodOptions} />
        ))}
      </div>
    </section>
  )
}
