import { Button } from '@/shared/components/actions/Button/Button'
import { NavIcon } from '@/shared/components/navigation/icons'
import styles from './DashboardUnavailablePage.module.scss'

interface DashboardUnavailablePageProps {
  sectionLabel: string
  onVisitOverview: () => void
}

export function DashboardUnavailablePage({
  sectionLabel,
  onVisitOverview,
}: DashboardUnavailablePageProps) {
  return (
    <div className={styles.page}>
      <section className={styles.message} aria-labelledby="dashboard-unavailable-title">
        <div className={styles.illustration} aria-hidden="true">
          <span className={styles.iconRing}>
            <NavIcon name="activity" size={32} strokeWidth={1.7} />
          </span>
          <span className={styles.statusDot} />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Demo dashboard</p>
          <h1 id="dashboard-unavailable-title">{sectionLabel} is not available in this demo</h1>
          <p className={styles.description}>
            This dashboard is provided for demonstration purposes. Currently, only the
            Overview page is available.
          </p>
        </div>

        <Button
          className={styles.overviewButton}
          leadingIcon={<NavIcon name="activity" size={19} />}
          onClick={onVisitOverview}
        >
          Go to overview
        </Button>
      </section>
    </div>
  )
}
