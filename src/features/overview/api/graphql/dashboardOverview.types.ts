export interface GraphQlError {
  message: string
}

export interface GraphQlResponse<TData> {
  data?: TData
  errors?: GraphQlError[]
}

export interface DashboardOverviewSummary {
  managedDevices: number
  onlineDevices: number
  gateways: number
  sensors: number
  criticalAlerts: number
  connectivityHealthPercent: number
  messagesLast24Hours: number
  sites: number
  lastUpdatedUtc: string
}

export interface DashboardOverviewData {
  dashboardOverview?: DashboardOverviewSummary
}
