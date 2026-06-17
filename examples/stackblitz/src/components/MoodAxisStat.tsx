import { formatMoodValue } from '../lib/mood-format'
import { MOOD_AXIS } from '../lib/mood-axis'

type MoodAxisKey = keyof typeof MOOD_AXIS

interface MoodAxisStatProps {
  axis: MoodAxisKey
  value: number
  large?: boolean
}

const AXIS_TITLE: Record<MoodAxisKey, string> = {
  weight: 'Weight',
  energy: 'Energy',
  warmth: 'Warmth',
}

export function MoodAxisStat({ axis, value, large }: MoodAxisStatProps) {
  return (
    <dl className={large ? 'mood-axis-stat mood-axis-stat--large' : 'mood-axis-stat'}>
      <dt>{AXIS_TITLE[axis]}</dt>
      <span className="mood-axis-label">{MOOD_AXIS[axis]}</span>
      <dd>{formatMoodValue(value)}</dd>
    </dl>
  )
}
