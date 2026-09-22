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
        <span className={styles.metaItem}>
          <OverviewIcon name="calendar" size={16} />
          {timestampLabel}
        </span>
        <span className={[styles.metaItem, styles.update].join(' ')}>
          <OverviewIcon name="clock" size={16} />
          {lastUpdatedLabel}
        </span>
      </div>
    </header>
  )
}
