import type { StatusTone } from '@/shared/components/data-display/StatusBadge'

export type TrendSentiment = 'positive' | 'negative' | 'neutral'
export type MetricAccent = 'primary' | 'success' | 'danger' | 'warning' | 'neutral'
export type Severity = 'critical' | 'major' | 'minor' | 'info'
export type OperationalStatus = 'online' | 'offline' | 'degraded'
export type IncidentStatus = 'open' | 'investigating' | 'resolved'

export interface OverviewMetric {
  id: string
  label: string
  value: string
  icon: OverviewIconName
  trendValue?: number
  trendSentiment?: TrendSentiment
  accent?: MetricAccent
}

export type OverviewIconName =
  | 'air'
  | 'alert'
  | 'arrow-right'
  | 'bolt'
  | 'calendar'
  | 'cellular'
  | 'cloud'
  | 'clock'
  | 'database'
  | 'device'
  | 'door'
  | 'droplets'
  | 'ethernet'
  | 'factory'
  | 'flow'
  | 'gauge'
  | 'gateway'
  | 'level'
  | 'location'
  | 'lora'
  | 'organization'
  | 'occupancy'
  | 'signal'
  | 'sensor'
  | 'thermometer'
  | 'vibration'
  | 'wifi'

export interface TopologySensor {
  id: string
  name: string
  status: OperationalStatus
}

export interface TopologySite {
  id: string
  name: string
  deviceCount: string
  gatewayName: string
  gatewayStatus: OperationalStatus
  connection: 'Cellular' | 'LoRaWAN' | 'Wi-Fi' | 'Ethernet'
  sensors: TopologySensor[]
}

export interface TopologyGroup {
  id: string
  name: string
  deviceCount: string
  site: TopologySite
}

export interface FleetTopologyData {
  groups: TopologyGroup[]
}

export interface Incident {
  id: string
  severity: Severity
  title: string
  organization: string
  site: string
  affectedDevices: number
  firstSeen: string
  status: IncidentStatus
}

export interface IncidentDetailsModel extends Incident {
  model: string
  serial: string
  firmware: string
  lastSeen: string
  signal: string
  packetLoss: string
  ipAddress: string
  cpu: string
  memory: string
  uptime: string
  connectedSensors: string
  recommendedAction: string
}

export interface TelemetryPoint {
  label: string
  temperature: number
  humidity: number
  vibration: number
  power: number
  messages: number
  alerts: number
}

export interface ConnectivitySegment {
  id: string
  label: string
  percentage: number
  count: number
  color: string
}

export interface OrganizationHealthRow {
  id: string
  organizationName: string
  onlinePercentage: number
  criticalAlerts: number
  gateways: number
  sensors: number
  dataRate: string
}

export interface FleetGateway {
  id: string
  gateway: string
  model: string
  organization: string
  site: string
  backhaul: string
  lorawanDevices: number
  status: OperationalStatus
  lastSeen: string
  firmware: string
  cpu: string
  memory: string
  signal: string
}

export interface SelectedGatewayModel extends FleetGateway {
  region: string
}

export interface SiteLocation {
  id: string
  name: string
  status: OperationalStatus
  latitude: number
  longitude: number
}

export interface RecentChange {
  id: string
  time: string
  user: string
  action: string
  target: string
  details: string
}

export interface SystemHealthItem {
  id: string
  label: string
  percentage: number
  tone: StatusTone
}

export interface SystemHealthData {
  statusLabel: string
  statusTone: StatusTone
  items: SystemHealthItem[]
}

export interface OverviewDashboardData {
  timestampLabel: string
  lastUpdatedLabel: string
  metrics: OverviewMetric[]
  topology: FleetTopologyData
  incidents: Incident[]
  selectedIncident: IncidentDetailsModel
  telemetryTrends: TelemetryPoint[]
  connectivity: ConnectivitySegment[]
  organizationHealth: OrganizationHealthRow[]
  gateways: FleetGateway[]
  selectedGateway: SelectedGatewayModel
  sites: SiteLocation[]
  recentChanges: RecentChange[]
  systemHealth: SystemHealthData
}
