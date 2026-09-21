import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/components/actions/Button/Button'
import { DataTable, type DataTableColumn } from '@/shared/components/data-display/DataTable'
import { Panel } from '@/shared/components/data-display/Panel'
import { StatusBadge, type StatusTone } from '@/shared/components/data-display/StatusBadge'
import { OverviewIcon } from './OverviewIcon'
import type {
  ConnectivitySegment,
  FleetGateway,
  FleetTopologyData,
  Incident,
  IncidentDetailsModel,
  IncidentStatus,
  OperationalStatus,
  OrganizationHealthRow,
  RecentChange,
  Severity,
  SiteLocation,
  SystemHealthData,
  TelemetryPoint,
  TopologyGroup,
  TopologySensor,
  TopologySite,
} from '../types/overview.types'
import styles from './DashboardSections.module.scss'

const operationalTone: Record<OperationalStatus, StatusTone> = {
  degraded: 'warning',
  offline: 'danger',
  online: 'success',
}

const severityTone: Record<Severity, StatusTone> = {
  critical: 'danger',
  info: 'info',
  major: 'warning',
  minor: 'warning',
}

const incidentStatusTone: Record<IncidentStatus, StatusTone> = {
  investigating: 'warning',
  open: 'danger',
  resolved: 'success',
}

const formatStatus = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const signalClass = (signal: string) => (signal.includes('-112') ? styles.dangerText : '')

const groupIconById: Record<string, 'bolt' | 'factory' | 'organization'> = {
  manufacturing: 'factory',
  utilities: 'bolt',
}

const gatewayIconByConnection: Record<TopologySite['connection'], 'cellular' | 'ethernet' | 'lora' | 'wifi'> = {
  Cellular: 'cellular',
  Ethernet: 'ethernet',
  LoRaWAN: 'lora',
  'Wi-Fi': 'wifi',
}

const sensorIconByName: Record<string, 'air' | 'bolt' | 'door' | 'droplets' | 'flow' | 'gauge' | 'level' | 'occupancy' | 'thermometer' | 'vibration'> = {
  'air quality': 'air',
  current: 'bolt',
  door: 'door',
  energy: 'bolt',
  flow: 'flow',
  humidity: 'droplets',
  level: 'level',
  occupancy: 'occupancy',
  pressure: 'gauge',
  temp: 'thermometer',
  temperature: 'thermometer',
  vibration: 'vibration',
}

const getGroupIcon = (group: TopologyGroup) => groupIconById[group.id] ?? 'organization'

const getSensorIcon = (sensor: TopologySensor) =>
  sensorIconByName[sensor.name.trim().toLowerCase()] ?? 'sensor'

interface FleetTopologyProps {
  topology: FleetTopologyData
}

export function FleetTopology({ topology }: FleetTopologyProps) {
  const fullscreenRootRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'topology' | 'list'>('topology')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === fullscreenRootRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleToggleFullscreen = async () => {
    if (document.fullscreenElement === fullscreenRootRef.current) {
      await document.exitFullscreen()
      return
    }

    await fullscreenRootRef.current?.requestFullscreen()
  }

  return (
    <div className={styles.topologyFullscreenRoot} ref={fullscreenRootRef}>
      <Panel
        title="Fleet Topology"
        className={[
          styles.topologyPanel,
          isFullscreen ? styles.fullscreenPanel : '',
        ].filter(Boolean).join(' ')}
        actions={
          <div className={styles.toolbar}>
            <button
              className={view === 'topology' ? styles.activeControl : ''}
              onClick={() => setView('topology')}
              type="button"
            >
              Topology
            </button>
            <button
              className={view === 'list' ? styles.activeControl : ''}
              onClick={() => setView('list')}
              type="button"
            >
              List
            </button>
            <button
              aria-pressed={isFullscreen}
              onClick={handleToggleFullscreen}
              type="button"
            >
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          </div>
        }
      >
        <div className={styles.legend} aria-label="Fleet topology legend">
          <div className={styles.legendContent}>
            <div className={[styles.legendGroup, styles.statusLegendGroup].join(' ')}>
              <span className={styles.legendLabel}>Status</span>
              <div className={styles.legendItems}>
                <LegendDot label="Online" status="online" />
                <LegendDot label="Degraded" status="degraded" />
                <LegendDot label="Offline" status="offline" />
              </div>
            </div>
            <div className={[styles.legendGroup, styles.connectionLegendGroup].join(' ')}>
              <span className={styles.legendLabel}>Connection</span>
              <div className={styles.legendItems}>
                <LegendLine connection="Cellular" />
                <LegendLine connection="LoRaWAN" />
                <LegendLine connection="Wi-Fi" />
                <LegendLine connection="Ethernet" />
              </div>
            </div>
          </div>
        </div>
        {view === 'topology' ? (
          <div className={styles.topologySurface}>
            <div className={styles.topologyCanvas}>
              <div className={styles.cloudNode}>
                <OverviewIcon name="cloud" />
                <strong>mCloud</strong>
              </div>
              <div className={styles.topologyTree}>
                <div className={styles.cloudStem} aria-hidden="true" />
                <div className={styles.organizationBranch} aria-hidden="true" />
                <div className={styles.topologyGrid}>
                  {topology.groups.map((group) => (
                    <TopologyColumn group={group} key={group.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={topologyColumns}
            getRowKey={(row) => row.id}
            rows={topology.groups}
            emptyMessage="No topology groups found."
          />
        )}
      </Panel>
    </div>
  )
}

function LegendDot({ label, status }: { label: string; status: OperationalStatus }) {
  return (
    <span className={[styles.legendItem, styles.legendStatusItem, styles[`legend${formatStatus(status)}`]].join(' ')}>
      <span className={[styles.legendDot, styles[status]].join(' ')} aria-hidden="true" />
      {label}
    </span>
  )
}

function LegendLine({ connection }: { connection: TopologySite['connection'] }) {
  const connectionKey = connection.replace('-', '')
  const connectionClass = styles[`legendConnection${connectionKey}`]
  const connectionIcon = gatewayIconByConnection[connection]

  return (
    <span className={[styles.legendItem, styles.legendConnectionItem, connectionClass].join(' ')}>
      <OverviewIcon name={connectionIcon} size={16} strokeWidth={2.6} />
      {connection}
    </span>
  )
}

function TopologyColumn({ group }: { group: TopologyGroup }) {
  const connectionClass = styles[`connection${group.site.connection.replace('-', '')}`]

  return (
    <div className={styles.topologyColumn}>
      <div className={styles.organizationStem} aria-hidden="true" />
      <div className={styles.topologyNode}>
        <OverviewIcon name={getGroupIcon(group)} size={18} />
        <span><strong>{group.name}</strong><small>{group.deviceCount}</small></span>
      </div>
      <div className={styles.nodeConnector} aria-hidden="true" />
      <div className={styles.siteNode}>
        <OverviewIcon name="factory" size={17} />
        <span><strong>{group.site.name}</strong><small>{group.site.deviceCount}</small></span>
      </div>
      <div className={[styles.gatewayConnector, connectionClass].join(' ')} aria-hidden="true" />
      <div className={styles.gatewayNode}>
        <OverviewIcon
          className={styles.gatewayTypeIcon}
          name={gatewayIconByConnection[group.site.connection]}
          size={19}
        />
        <strong>{group.site.gatewayName}</strong>
      </div>
      <div className={[styles.sensorConnector, connectionClass].join(' ')} aria-hidden="true" />
      <div className={[styles.sensorBranch, connectionClass].join(' ')} aria-hidden="true" />
      <div className={styles.sensorGrid}>
        {group.site.sensors.map((sensor) => (
          <div className={styles.sensorNode} key={sensor.id}>
            <span className={[styles.sensorStem, connectionClass].join(' ')} aria-hidden="true" />
            <OverviewIcon name={getSensorIcon(sensor)} size={18} />
            <strong>{sensor.name}</strong>
            <small className={styles[sensor.status]}>{formatStatus(sensor.status)}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const topologyColumns: DataTableColumn<TopologyGroup>[] = [
  { id: 'group', header: 'Organization', cell: (row) => row.name },
  { id: 'devices', header: 'Devices', cell: (row) => row.deviceCount },
  { id: 'site', header: 'Site', cell: (row) => row.site.name },
  { id: 'gateway', header: 'Gateway', cell: (row) => row.site.gatewayName },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge className={styles.statusBadge} label={formatStatus(row.site.gatewayStatus)} tone={operationalTone[row.site.gatewayStatus]} dot /> },
]

interface ActiveIncidentsProps {
  incidents: Incident[]
  selectedIncident: IncidentDetailsModel
}

const incidentColumns: DataTableColumn<Incident>[] = [
  { id: 'severity', header: 'Severity', cell: (row) => <StatusBadge className={styles.statusBadge} label={formatStatus(row.severity)} tone={severityTone[row.severity]} dot /> },
  { id: 'incident', header: 'Incident', cell: (row) => row.title },
  { id: 'site', header: 'Organization / Site', cell: (row) => `${row.organization} / ${row.site}` },
  { id: 'devices', header: 'Devices', align: 'center', cell: (row) => row.affectedDevices },
  { id: 'seen', header: 'First Seen', cell: (row) => row.firstSeen },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge className={styles.statusBadge} label={formatStatus(row.status)} tone={incidentStatusTone[row.status]} /> },
]

export function ActiveIncidents({ incidents, selectedIncident }: ActiveIncidentsProps) {
  return (
    <Panel
      title="Active Incidents & Troubleshooting"
      actions={<button className={styles.linkButton} type="button">View All</button>}
    >
      <DataTable
        columns={incidentColumns}
        getRowKey={(row) => row.id}
        rows={incidents}
        emptyMessage="No active incidents."
      />
      <article className={styles.incidentDetail}>
        <div className={styles.incidentBody}>
          <div className={styles.incidentDevice} aria-hidden="true">
            <div className={styles.deviceAntenna} />
            <div className={styles.deviceAntennaSmall} />
            <div className={styles.deviceShell}>
              <span>MultiTech</span>
            </div>
          </div>
          <div className={styles.incidentContent}>
            <div className={styles.detailHeader}>
              <StatusBadge className={styles.statusBadge} label="Critical" tone="danger" />
              <div className={styles.detailTitle}>
                <h3>Gateway Offline - Detroit Plant</h3>
                <p>MTCDT-AP-0023 · Last seen: {selectedIncident.firstSeen}</p>
              </div>
              <Button className={styles.smallButton}>Diagnose</Button>
            </div>
            <div className={styles.detailGrid}>
              <KeyValue label="Model" value={selectedIncident.model} />
              <KeyValue label="Serial" value={selectedIncident.serial} />
              <KeyValue label="Firmware" value={selectedIncident.firmware} />
              <KeyValue label="Site" value={selectedIncident.site} />
              <KeyValue label="Last Seen" value={selectedIncident.lastSeen} />
              <KeyValue label="Signal" value={selectedIncident.signal} strong />
              <KeyValue label="Packet Loss" value={selectedIncident.packetLoss} strong />
              <KeyValue label="Connected Sensors" value={selectedIncident.connectedSensors} strong />
              <KeyValue label="IP Address" value={selectedIncident.ipAddress} />
              <KeyValue label="CPU" value={selectedIncident.cpu} />
              <KeyValue label="Memory" value={selectedIncident.memory} />
              <KeyValue label="Uptime" value={selectedIncident.uptime} />
            </div>
            <div className={styles.nextAction}>
              <span className={styles.actionIcon} aria-hidden="true">!</span>
              <div>
                <strong>Recommended Next Action</strong>
                <p>{selectedIncident.recommendedAction}</p>
                <Button className={styles.smallButton} variant="secondary">Run Connectivity Test</Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Panel>
  )
}

function KeyValue({ label, strong = false, value }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={styles.keyValue}>
      <span>{label}</span>
      <strong className={strong ? styles.dangerText : ''}>{value}</strong>
    </div>
  )
}

export function TelemetryTrends({ points }: { points: TelemetryPoint[] }) {
  return (
    <Panel
      title="Telemetry & Alert Trends"
      actions={<select className={styles.select} aria-label="Telemetry trend time range"><option>Last 24 hours</option></select>}
    >
      <div className={styles.chartLegend}>
        <LegendDot label="Temperature (°C)" status="online" />
        <LegendDot label="Humidity (%)" status="degraded" />
        <LegendDot label="Messages/sec" status="online" />
        <LegendDot label="Alerts" status="offline" />
      </div>
      <LineChart points={points} />
    </Panel>
  )
}

function LineChart({ points }: { points: TelemetryPoint[] }) {
  const width = 720
  const height = 170
  const maxValue = 100
  const xStep = width / Math.max(points.length - 1, 1)
  const toPath = (key: keyof Pick<TelemetryPoint, 'temperature' | 'humidity' | 'vibration' | 'power' | 'messages'>) =>
    points
      .map((point, index) => {
        const x = index * xStep
        const y = height - (point[key] / maxValue) * (height - 30) - 15
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')

  return (
    <svg className={styles.lineChart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Telemetry trends for temperature, humidity, vibration, power, messages, and alerts over the last 24 hours.">
      {[25, 50, 75, 100].map((tick) => (
        <line key={tick} x1="0" x2={width} y1={height - (tick / 100) * (height - 30) - 15} y2={height - (tick / 100) * (height - 30) - 15} />
      ))}
      <path className={styles.seriesBlue} d={toPath('messages')} />
      <path className={styles.seriesGreen} d={toPath('temperature')} />
      <path className={styles.seriesCyan} d={toPath('humidity')} />
      <path className={styles.seriesAmber} d={toPath('power')} />
      {points.map((point, index) => {
        const barHeight = point.alerts * 3
        return <rect className={styles.alertBar} height={barHeight} key={point.label} width="10" x={index * xStep + 4} y={height - barHeight - 4} />
      })}
    </svg>
  )
}

export function ConnectivityBreakdown({ segments }: { segments: ConnectivitySegment[] }) {
  const gradient = segments
    .reduce<{ parts: string[]; offset: number }>((acc, segment) => {
      const start = acc.offset
      const end = start + segment.percentage
      acc.parts.push(`${segment.color} ${start}% ${end}%`)
      acc.offset = end
      return acc
    }, { offset: 0, parts: [] })
    .parts
    .join(', ')

  return (
    <Panel title="Connectivity Breakdown">
      <div className={styles.donutLayout}>
        <div className={styles.donut} style={{ background: `conic-gradient(${gradient})` }} aria-label="Connectivity device breakdown chart">
          <div>
            <strong>12,846</strong>
            <span>Devices</span>
          </div>
        </div>
        <div className={styles.segmentList}>
          {segments.map((segment) => (
            <div className={styles.segment} key={segment.id}>
              <span style={{ background: segment.color }} aria-hidden="true" />
              <strong>{segment.label}</strong>
              <em>{segment.percentage}% ({segment.count.toLocaleString()})</em>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

const organizationColumns: DataTableColumn<OrganizationHealthRow>[] = [
  { id: 'org', header: 'Organization', cell: (row) => row.organizationName },
  { id: 'online', header: 'Online %', cell: (row) => <strong className={row.onlinePercentage < 95 ? styles.dangerText : styles.successText}>{row.onlinePercentage}%</strong> },
  { id: 'alerts', header: 'Critical Alerts', align: 'center', cell: (row) => <strong className={row.criticalAlerts > 0 ? styles.dangerText : ''}>{row.criticalAlerts}</strong> },
  { id: 'gateways', header: 'Gateways', align: 'center', cell: (row) => row.gateways },
  { id: 'sensors', header: 'Sensors', align: 'center', cell: (row) => row.sensors.toLocaleString() },
  { id: 'rate', header: 'Data Rate', cell: (row) => row.dataRate },
  { id: 'action', header: 'Action', cell: () => <button className={styles.pillButton} type="button">View</button> },
]

export function OrganizationHealth({ rows }: { rows: OrganizationHealthRow[] }) {
  return (
    <Panel title="Organization Health" actions={<button className={styles.linkButton} type="button">View All</button>}>
      <DataTable columns={organizationColumns} getRowKey={(row) => row.id} rows={rows} emptyMessage="No organizations found." />
    </Panel>
  )
}

const gatewayColumns: DataTableColumn<FleetGateway>[] = [
  { id: 'gateway', header: 'Gateway', cell: (row) => row.gateway },
  { id: 'model', header: 'Model', cell: (row) => row.model },
  { id: 'org', header: 'Organization', cell: (row) => row.organization },
  { id: 'site', header: 'Site', cell: (row) => row.site },
  { id: 'backhaul', header: 'Backhaul', cell: (row) => row.backhaul },
  { id: 'lorawan', header: 'LoRaWAN Devices', align: 'center', cell: (row) => row.lorawanDevices },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge className={styles.statusBadge} label={formatStatus(row.status)} tone={operationalTone[row.status]} dot /> },
  { id: 'seen', header: 'Last Seen', cell: (row) => row.lastSeen },
  { id: 'firmware', header: 'Firmware', cell: (row) => row.firmware },
  { id: 'cpu', header: 'CPU', cell: (row) => row.cpu },
  { id: 'memory', header: 'Memory', cell: (row) => row.memory },
  { id: 'signal', header: 'Signal', cell: (row) => <strong className={signalClass(row.signal)}>{row.signal}</strong> },
]

export function TelemetryFleet({ gateways }: { gateways: FleetGateway[] }) {
  return (
    <Panel title="Telemetry Fleet">
      <DataTable columns={gatewayColumns} getRowKey={(row) => row.id} rows={gateways} emptyMessage="No gateways found." />
    </Panel>
  )
}

export function SelectedGateway({ gateway }: { gateway: FleetGateway & { region: string } }) {
  return (
    <Panel title="Selected Gateway" actions={<button className={styles.linkButton} type="button">View Audit Trail</button>}>
      <div className={styles.gatewaySummary}>
        <div className={styles.gatewayDevice} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <h3>{gateway.gateway}</h3>
          <p>{gateway.region}</p>
          <StatusBadge className={styles.statusBadge} label={formatStatus(gateway.status)} tone={operationalTone[gateway.status]} dot />
        </div>
      </div>
      <div className={styles.gatewayActions}>
        {['Restart Service', 'Reboot Gateway', 'Sync Config', 'Run Connectivity Test', 'View Logs', 'Deploy Firmware'].map((action) => (
          <button key={action} type="button">{action}</button>
        ))}
      </div>
      <p className={styles.auditNote}>All actions are logged and audited</p>
    </Panel>
  )
}

export function SiteMap({ sites }: { sites: SiteLocation[] }) {
  return (
    <Panel title="Site Map" actions={<div className={styles.mapControls}><button aria-label="Zoom in map" type="button">+</button><button aria-label="Zoom out map" type="button">−</button></div>}>
      <div className={styles.map} role="img" aria-label="Map showing monitored sites across North America, Europe, and Asia Pacific.">
        {sites.map((site) => (
          <span
            className={[styles.mapPin, styles[site.status]].join(' ')}
            key={site.id}
            style={{ left: `${site.x}%`, top: `${site.y}%` }}
            title={`${site.name}: ${formatStatus(site.status)}`}
          />
        ))}
      </div>
    </Panel>
  )
}

const changeColumns: DataTableColumn<RecentChange>[] = [
  { id: 'time', header: 'Time', cell: (row) => row.time },
  { id: 'user', header: 'User', cell: (row) => row.user },
  { id: 'action', header: 'Action', cell: (row) => row.action },
  { id: 'target', header: 'Target', cell: (row) => row.target },
  { id: 'details', header: 'Details', cell: (row) => row.details },
]

export function RecentChanges({ changes }: { changes: RecentChange[] }) {
  return (
    <Panel title="Recent Changes" actions={<button className={styles.linkButton} type="button">View All</button>}>
      <DataTable columns={changeColumns} getRowKey={(row) => row.id} rows={changes} emptyMessage="No recent changes." />
    </Panel>
  )
}

export function SystemHealth({ health }: { health: SystemHealthData }) {
  return (
    <Panel
      title="System Health"
      actions={<StatusBadge className={styles.statusBadge} label={health.statusLabel} tone={health.statusTone} dot />}
    >
      <div className={styles.healthGrid}>
        {health.items.map((item) => (
          <article className={styles.healthCard} key={item.id}>
            <span>{item.label}</span>
            <strong className={styles[item.tone]}>{item.value}</strong>
          </article>
        ))}
      </div>
    </Panel>
  )
}
