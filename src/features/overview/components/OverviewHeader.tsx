import { Button } from '@/shared/components/actions/Button/Button'
import styles from './OverviewHeader.module.scss'

interface OverviewHeaderProps {
  timestampLabel: string
  lastUpdatedLabel: string
}

export function OverviewHeader({ lastUpdatedLabel, timestampLabel }: OverviewHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <div className={styles.titleRow}>
          <h1>Fleet Operations</h1>
          <p>Monitor connectivity, telemetry, device health, and incidents across organizations.</p>
        </div>
      </div>
      <div className={styles.meta}>
        <span>{timestampLabel}</span>
        <span className={styles.update}>
          <span aria-hidden="true" />
          {lastUpdatedLabel}
        </span>
        <Button className={styles.exportButton} variant="primary">
          Export
        </Button>
      </div>
    </header>
  )
}
