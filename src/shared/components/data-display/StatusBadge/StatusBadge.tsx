import styles from './StatusBadge.module.scss'

export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface StatusBadgeProps {
  label: string
  tone: StatusTone
  dot?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({
  className = '',
  dot = false,
  label,
  size = 'sm',
  tone,
}: StatusBadgeProps) {
  const classes = [styles.badge, styles[tone], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {label}
    </span>
  )
}
