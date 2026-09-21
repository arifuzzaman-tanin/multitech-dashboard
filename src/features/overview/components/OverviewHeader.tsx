import { OverviewIcon } from './OverviewIcon'
import styles from './OverviewHeader.module.scss'

interface OverviewHeaderProps {
  timestampLabel: string
  lastUpdatedLabel: string
}

export function OverviewHeader({ lastUpdatedLabel, timestampLabel }: OverviewHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <div className={styles.icon}>
          <OverviewIcon name="factory" size={22} />
        </div>
        <div className={styles.titleGroup}>
          <h1>Fleet Operations</h1>
          <p>Monitor connectivity, telemetry, device health, and incidents across organizations.</p>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.metaPill}>
          {timestampLabel}
        </span>
        <span className={[styles.metaPill, styles.update].join(' ')}>
          <span className={styles.statusDot} aria-hidden="true" />
          {lastUpdatedLabel}
        </span>
      </div>
    </header>
  )
}
