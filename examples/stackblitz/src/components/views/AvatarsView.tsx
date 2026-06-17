import type { MoodOptions } from '../../lib/demo-types'
import { formatMoodValue } from '../../lib/mood-format'
import { avatarPersonas } from '../../lib/avatars'
import { useMoodSurface } from '../../hooks/useMoodSurface'
import { MoodClip } from '../MoodClip'

function AvatarCard({
  person,
  moodOptions,
}: {
  person: (typeof avatarPersonas)[number]
  moodOptions?: MoodOptions
}) {
  const text = `${person.name} ${person.title} ${person.bio}`
  const { background, filter, mood } = useMoodSurface(
    text,
    person.slug,
    moodOptions
  )

  return (
    <article className="avatar-card">
      <MoodClip
        className="avatar-circle"
        background={background}
        filter={filter}
      />
      <h2 className="avatar-name">{person.name}</h2>
      <p className="avatar-title">{person.title}</p>
      <p className="avatar-bio">{person.bio}</p>
      <dl className="mood-stats mood-stats--compact">
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
    </article>
  )
}

export function AvatarsView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <div className="avatar-grid">
      {avatarPersonas.map(person => (
        <AvatarCard key={person.slug} person={person} moodOptions={moodOptions} />
      ))}
    </div>
  )
}
