import type { MoodOptions } from '../../lib/demo-types'
import { journalDays } from '../../lib/journal'
import { useMoodSurface } from '../../hooks/useMoodSurface'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function JournalCell({
  day,
  text,
  moodOptions,
}: {
  day: number
  text: string
  moodOptions?: MoodOptions
}) {
  const { background, filter } = useMoodSurface(
    text,
    `journal-day-${day}`,
    moodOptions
  )

  return (
    <div className="journal-cell">
      <div className="journal-cell-bg" style={{ background, filter }} aria-hidden="true" />
      <span className="journal-day-num">{day}</span>
    </div>
  )
}

export function JournalView({ moodOptions }: { moodOptions?: MoodOptions }) {
  return (
    <section className="journal-panel">
      <header className="journal-header">
        <h2>June 2026</h2>
        <p>Emotional texture across 30 days — same entry, same color, every time.</p>
      </header>
      <div className="journal-weekdays">
        {WEEKDAYS.map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="journal-grid">
        {journalDays.map(({ day, text }) => (
          <JournalCell key={day} day={day} text={text} moodOptions={moodOptions} />
        ))}
      </div>
    </section>
  )
}
