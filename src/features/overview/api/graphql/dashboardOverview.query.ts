import { apiRequest } from '@/shared/api/apiClient'

import type {
  DashboardOverviewData,
  DashboardOverviewSummary,
  GraphQlResponse,
} from './dashboardOverview.types'

const dashboardOverviewQuery = `
  query GetDashboardOverview {
    dashboardOverview {
      managedDevices
      onlineDevices
      gateways
      sensors
      criticalAlerts
      connectivityHealthPercent
      messagesLast24Hours
      sites
      lastUpdatedUtc
    }
  }
`

interface DashboardOverviewRequestOptions {
  signal?: AbortSignal
}

export async function getDashboardOverview({
  signal,
}: DashboardOverviewRequestOptions = {}): Promise<DashboardOverviewSummary> {
  const response = await apiRequest<GraphQlResponse<DashboardOverviewData>>('/graphql', {
    body: { query: dashboardOverviewQuery },
    method: 'POST',
    signal,
  })

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0]?.message || 'Unable to load dashboard overview.')
  }

  const dashboardOverview = response.data?.dashboardOverview

  if (!isDashboardOverviewSummary(dashboardOverview)) {
    throw new Error('Dashboard overview data is missing or incomplete.')
  }

  return dashboardOverview
}

function isDashboardOverviewSummary(value: unknown): value is DashboardOverviewSummary {
  if (!isRecord(value)) {
    return false
  }

  return (
    isNumber(value.managedDevices)
    && isNumber(value.onlineDevices)
    && isNumber(value.gateways)
    && isNumber(value.sensors)
    && isNumber(value.criticalAlerts)
    && isNumber(value.connectivityHealthPercent)
    && isNumber(value.messagesLast24Hours)
    && isNumber(value.sites)
    && typeof value.lastUpdatedUtc === 'string'
  )
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
