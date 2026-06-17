import type { DemoTab } from '../lib/demo-types'

const TABS: { id: DemoTab; label: string }[] = [
  { id: 'blog', label: 'Blog Posts' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'avatars', label: 'Avatars' },
  { id: 'commits', label: 'Commits' },
  { id: 'journal', label: 'Journal' },
  { id: 'blendLab', label: 'Blend Lab' },
]

interface TabNavProps {
  active: DemoTab
  onChange: (tab: DemoTab) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="tab-nav" aria-label="Demo views">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={active === id ? 'tab-link active' : 'tab-link'}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
