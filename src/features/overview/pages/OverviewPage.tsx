import {
  ActiveIncidents,
  ConnectivityBreakdown,
  FleetTopology,
  OrganizationHealth,
  RecentChanges,
  SelectedGateway,
  SiteMap,
  SystemHealth,
  TelemetryFleet,
  TelemetryTrends,
} from '../components/DashboardSections'
import { MetricsGrid } from '../components/MetricsGrid'
import { OverviewHeader } from '../components/OverviewHeader'
import { useOverviewDashboard } from '../hooks/useOverviewDashboard'
import styles from './OverviewPage.module.scss'

export function OverviewPage() {
  const { data, error, isLoading } = useOverviewDashboard()

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>Loading fleet operations...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>
          <h1>Unable to load overview</h1>
          <p>{error ?? 'Overview data is not available.'}</p>
          <button type="button">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <OverviewHeader
        lastUpdatedLabel={data.lastUpdatedLabel}
        timestampLabel={data.timestampLabel}
      />
      <MetricsGrid metrics={data.metrics} />

      <section className={styles.operationsGrid} aria-label="Operations">
        <FleetTopology topology={data.topology} />
        <ActiveIncidents incidents={data.incidents} selectedIncident={data.selectedIncident} />
      </section>

      <section className={styles.analyticsGrid} aria-label="Analytics">
        <TelemetryTrends points={data.telemetryTrends} />
        <ConnectivityBreakdown segments={data.connectivity} />
        <OrganizationHealth rows={data.organizationHealth} />
      </section>

      <section className={styles.fleetGrid} aria-label="Fleet">
        <TelemetryFleet gateways={data.gateways} />
        <SelectedGateway gateway={data.selectedGateway} />
      </section>

      <section className={styles.bottomGrid} aria-label="System activity">
        <SiteMap sites={data.sites} />
        <RecentChanges changes={data.recentChanges} />
        <SystemHealth health={data.systemHealth} />
      </section>
    </div>
  )
}
