import type { ReactNode } from 'react'
import styles from './Panel.module.scss'

interface PanelProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  padding?: 'none' | 'sm' | 'md'
}

export function Panel({
  actions,
  children,
  className = '',
  contentClassName = '',
  description,
  padding = 'md',
  title,
}: PanelProps) {
  const classes = [styles.panel, styles[`padding-${padding}`], className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes} aria-label={title}>
      {(title || description || actions) && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>{children}</div>
    </section>
  )
}
