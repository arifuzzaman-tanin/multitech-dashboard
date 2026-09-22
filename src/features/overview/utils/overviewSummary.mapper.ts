import type { DashboardOverviewSummary } from '../api/graphql/dashboardOverview.types'
import type { OverviewDashboardData, OverviewMetric } from '../types/overview.types'

const countFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

const timestampFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  weekday: 'short',
  year: 'numeric',
})

export function mapDashboardOverviewSummary(
  summary: DashboardOverviewSummary,
  mockData: OverviewDashboardData,
): OverviewDashboardData {
  const lastUpdated = parseLastUpdated(summary.lastUpdatedUtc)

  return {
    ...mockData,
    lastUpdatedLabel: formatLastUpdatedLabel(lastUpdated),
    metrics: mapSummaryMetrics(summary),
    timestampLabel: `${timestampFormatter.format(lastUpdated)} (UTC)`,
  }
}

function mapSummaryMetrics(summary: DashboardOverviewSummary): OverviewMetric[] {
  return [
    {
      icon: 'device',
      id: 'managed-devices',
      label: 'Managed Devices',
      value: countFormatter.format(summary.managedDevices),
    },
    {
      accent: 'success',
      icon: 'wifi',
      id: 'online',
      label: 'Online',
      value: countFormatter.format(summary.onlineDevices),
    },
    {
      icon: 'gateway',
      id: 'gateways',
      label: 'Gateways',
      value: countFormatter.format(summary.gateways),
    },
    {
      icon: 'sensor',
      id: 'sensors',
      label: 'Sensors',
      value: countFormatter.format(summary.sensors),
    },
    {
      accent: summary.criticalAlerts > 0 ? 'danger' : undefined,
      icon: 'alert',
      id: 'critical-alerts',
      label: 'Critical Alerts',
      value: countFormatter.format(summary.criticalAlerts),
    },
    {
      accent: 'success',
      icon: 'signal',
      id: 'connectivity-health',
      label: 'Connectivity Health',
      value: `${percentFormatter.format(summary.connectivityHealthPercent)}%`,
    },
    {
      icon: 'database',
      id: 'messages',
      label: 'Messages / 24h',
      value: countFormatter.format(summary.messagesLast24Hours),
    },
    {
      icon: 'location',
      id: 'sites',
      label: 'Sites',
      value: countFormatter.format(summary.sites),
    },
  ]
}

function parseLastUpdated(lastUpdatedUtc: string): Date {
  const date = new Date(lastUpdatedUtc)

  if (Number.isNaN(date.getTime())) {
    throw new Error('Dashboard overview timestamp is invalid.')
  }

  return date
}

function formatLastUpdatedLabel(lastUpdated: Date): string {
  const elapsedMs = Date.now() - lastUpdated.getTime()

  if (elapsedMs < 0) {
    return `Last updated: ${timestampFormatter.format(lastUpdated)} (UTC)`
  }

  const elapsedMinutes = Math.floor(elapsedMs / 60_000)

  if (elapsedMinutes < 1) {
    return 'Last updated: just now'
  }

  if (elapsedMinutes < 60) {
    return `Last updated: ${elapsedMinutes} min ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)

  if (elapsedHours < 24) {
    return `Last updated: ${elapsedHours} hr ago`
  }

  return `Last updated: ${timestampFormatter.format(lastUpdated)} (UTC)`
}
