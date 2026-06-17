import type { ReactNode } from 'react'

interface MoodClipProps {
  background: string
  filter: string
  className?: string
  children?: ReactNode
}

/** Clips a blurred mood gradient inside a defined container. */
export function MoodClip({
  background,
  filter,
  className,
  children,
}: MoodClipProps) {
  return (
    <div className={className ? `mood-clip ${className}` : 'mood-clip'}>
      <div
        className="mood-surface"
        style={{ background, filter }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
