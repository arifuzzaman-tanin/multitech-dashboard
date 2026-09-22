# Overview Page — AI Agent Implementation Guide

## Purpose

Create the **Overview / Fleet Operations** page based on the supplied dashboard reference image.

This task is for the **main content area only**.

The sidebar and top navbar are assumed to be handled by the existing application shell.

The first implementation is **UI-first with local mock data**. Do not connect GraphQL yet. The page must be structured so GraphQL can be integrated later without rewriting the presentation components.

---

# 1. Mandatory Architecture Rules

Before changing code, the AI agent must inspect and follow the existing project.

The existing application architecture is feature-first. Business functionality belongs inside `features/`, reusable application-wide UI belongs in `shared/`, and API implementation should remain outside presentational components.

The preferred dependency direction is:

```text
app
 ↓
features
 ↓
shared
 ↓
infrastructure / core
```

For future GraphQL integration, the intended flow is:

```text
OverviewPage
    ↓
Overview feature hook
    ↓
Overview GraphQL operations
    ↓
Shared GraphQL infrastructure/client
    ↓
Backend
```

Do not import Apollo/client infrastructure directly inside dashboard UI components.

Follow these existing application principles:

- React + TypeScript
- Feature-first organization
- Shared components only when genuinely reusable
- Feature-specific components stay inside the feature
- SCSS Modules for component styles
- Existing design tokens and mixins first
- Mobile-first responsive rules
- Existing path aliases/import conventions
- No unnecessary new dependencies
- Avoid circular dependencies
- Avoid direct data-fetching logic inside visual components
- No `any` unless unavoidable and documented
- No duplicated constants
- No hardcoded repeated colors when existing tokens are available

---

# 2. First Step for the Agent

Before implementing the page, inspect:

1. Existing `src/features`
2. Existing `src/shared`
3. Existing `src/app`
4. Existing application layout/AppShell
5. Existing sidebar/navbar implementation
6. Existing SCSS architecture
7. Existing design tokens
8. Existing typography tokens
9. Existing spacing/radius/shadow tokens
10. Existing breakpoints
11. Existing icon library
12. Existing Card component
13. Existing Button/IconButton components
14. Existing Badge/Status components
15. Existing Table components
16. Existing Dropdown/Select components
17. Existing Tooltip component
18. Existing Loading/Skeleton components
19. Existing chart library, if any
20. Existing routing
21. Existing test setup
22. Existing GraphQL infrastructure, even though it will not be used yet

Do not recreate an existing component under a new name.

---

# 3. Reference Image — Main Content Analysis

The Overview page contains the following major regions.

```text
Overview Page
│
├── Page Header
│   ├── "Fleet Operations"
│   ├── subtitle
│   ├── current time / last updated
│   └── Export action
│
├── KPI Summary Row
│   ├── Managed Devices
│   ├── Online
│   ├── Gateways
│   ├── Sensors
│   ├── Critical Alerts
│   ├── Connectivity Health
│   ├── Messages / 24h
│   └── Sites
│
├── Main Operations Row
│   ├── Fleet Topology
│   └── Active Incidents & Troubleshooting
│
├── Analytics Row
│   ├── Telemetry & Alert Trends
│   ├── Connectivity Breakdown
│   └── Organization Health
│
├── Fleet Row
│   ├── Telemetry Fleet
│   └── Selected Gateway
│
└── Bottom Row
    ├── Site Map
    ├── Recent Changes
    └── System Health
```

The page is information-dense, but it remains visually clean because:

- panels share a consistent card system
- spacing is tight but predictable
- status colors are semantic
- typography hierarchy is clear
- borders are subtle
- background is very light
- data tables use compact rows
- most cards use white surfaces
- important alerts use red only where necessary
- charts use a limited visual palette
- sections use reusable headers instead of custom layouts

---

# 4. Feature Folder

Prefer a dedicated feature:

```text
src/
└── features/
    └── overview/
        ├── api/
        │   └── graphql/
        │       ├── queries/
        │       ├── fragments/
        │       └── generated/
        │
        ├── components/
        │   ├── OverviewHeader/
        │   ├── MetricsGrid/
        │   ├── FleetTopology/
        │   ├── ActiveIncidents/
        │   ├── TelemetryTrends/
        │   ├── ConnectivityBreakdown/
        │   ├── OrganizationHealth/
        │   ├── TelemetryFleet/
        │   ├── SelectedGateway/
        │   ├── SiteMap/
        │   ├── RecentChanges/
        │   └── SystemHealth/
        │
        ├── hooks/
        │   └── useOverviewDashboard.ts
        │
        ├── models/
        ├── types/
        │   └── overview.types.ts
        │
        ├── constants/
        │   └── overview.constants.ts
        │
        ├── mock/
        │   └── overview.mock.ts
        │
        ├── utils/
        ├── pages/
        │   ├── OverviewPage.tsx
        │   └── OverviewPage.module.scss
        │
        └── index.ts
```

### Important

Do **not** create every folder just because it appears above.

Create only the folders/files required by the implementation.

The `api/graphql` directories can remain absent until GraphQL integration actually starts.

---

# 5. Shared Reusable Components

Small, truly reusable primitives may belong under the existing shared UI architecture.

Reuse existing versions first.

Possible reusable components:

```text
shared/
└── components/
    ├── DataCard/
    ├── MetricCard/
    ├── Panel/
    ├── PanelHeader/
    ├── StatusBadge/
    ├── TrendIndicator/
    ├── DataTable/
    ├── EmptyState/
    ├── LoadingState/
    ├── ErrorState/
    ├── IconButton/
    ├── SegmentedControl/
    ├── StatValue/
    ├── MiniSparkline/
    └── ProgressIndicator/
```

Do not move components such as `FleetTopology`, `OrganizationHealth`, or `SelectedGateway` into `shared/`. Those are Overview/domain-specific.

---

# 6. Core Shared Primitive: Panel

Many sections in the screenshot use the same visual container.

Create or reuse a generic `Panel`.

Suggested API:

```ts
interface PanelProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
}
```

Responsibilities:

- white surface
- subtle border
- small radius
- optional header
- consistent title style
- optional right-side action area
- content padding
- no business-specific logic

Do not create separate card wrappers for every dashboard section if they share the same visual structure.

---

# 7. Panel Header

Reusable panel header example:

```text
Fleet Topology                           View: Topology | List | Filter | + | −
```

Suggested API:

```ts
interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

Use it in:

- Fleet Topology
- Active Incidents
- Telemetry Trends
- Connectivity Breakdown
- Organization Health
- Telemetry Fleet
- Site Map
- Recent Changes
- System Health

---

# 8. Status Badge

A reusable status badge will be useful across the entire product.

Examples in the screenshot:

```text
Online
Offline
Degraded
Critical
Major
Minor
Info
Open
Investigating
Production
All Systems Operational
```

Suggested model:

```ts
type StatusTone =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral';

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  dot?: boolean;
  size?: 'sm' | 'md';
}
```

Do not couple the shared component to specific words such as `"Online"`.

Map business statuses to visual tones inside the Overview feature.

Example:

```ts
const gatewayStatusTone: Record<GatewayStatus, StatusTone> = {
  online: 'success',
  offline: 'danger',
  degraded: 'warning',
};
```

---

# 9. Trend Indicator

The KPI cards repeatedly show values such as:

```text
↑ +2.3%
↓ -4.3%
```

Create/reuse a small `TrendIndicator`.

Suggested API:

```ts
interface TrendIndicatorProps {
  value: number;
  direction?: 'up' | 'down' | 'flat';
  sentiment?: 'positive' | 'negative' | 'neutral';
  suffix?: string;
}
```

Important:

Direction is not always equivalent to good/bad.

Example:

- Critical Alerts increasing = negative
- Online Devices increasing = positive

Therefore the feature should explicitly provide `sentiment`.

---

# 10. Metric Card

The top row contains eight KPI cards.

Create/reuse a reusable `MetricCard`.

Suggested API:

```ts
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
  accent?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
  footer?: React.ReactNode;
}
```

The card may support an optional sparkline later.

Do not make eight different KPI components.

---

# 11. Overview Header

Reference:

```text
Fleet Operations    Monitor connectivity, telemetry, device health,
                    and incidents across organizations.

Mon, Apr 28, 2025 14:32 (UTC)   ● Last updated: 1 min ago   [Export]
```

Create a feature-specific `OverviewHeader`.

It should contain:

- Page title
- Short description
- Last-updated indicator
- Optional current/reference timestamp
- Export action

Suggested props:

```ts
interface OverviewHeaderProps {
  title: string;
  description?: string;
  timestamp?: Date;
  lastUpdatedLabel?: string;
  onExport?: () => void;
}
```

For the initial UI:

- use mock timestamp
- export may use a no-op handler or disabled/demo behavior
- do not implement backend export yet

---

# 12. Metrics Grid

The top row should be data driven.

Do not write eight cards manually in JSX.

Suggested type:

```ts
interface OverviewMetric {
  id: string;
  label: string;
  value: string;
  icon: IconName;
  trendValue?: number;
  trendSentiment?: TrendSentiment;
  accent?: MetricAccent;
}
```

Example mock data:

```ts
export const overviewMetrics: OverviewMetric[] = [
  {
    id: 'managed-devices',
    label: 'Managed Devices',
    value: '12,846',
    icon: 'devices',
    trendValue: 2.3,
    trendSentiment: 'positive',
  },
  {
    id: 'online',
    label: 'Online',
    value: '12,071',
    icon: 'wifi',
    trendValue: 1.1,
    trendSentiment: 'positive',
  },
  {
    id: 'gateways',
    label: 'Gateways',
    value: '386',
    icon: 'gateway',
    trendValue: 2.4,
    trendSentiment: 'positive',
  },
  {
    id: 'sensors',
    label: 'Sensors',
    value: '12,460',
    icon: 'sensor',
    trendValue: 2.6,
    trendSentiment: 'positive',
  },
  {
    id: 'critical-alerts',
    label: 'Critical Alerts',
    value: '23',
    icon: 'alert',
    trendValue: 4.3,
    trendSentiment: 'negative',
    accent: 'danger',
  },
  {
    id: 'connectivity-health',
    label: 'Connectivity Health',
    value: '97.8%',
    icon: 'signal',
    trendValue: 0.6,
    trendSentiment: 'positive',
  },
  {
    id: 'messages',
    label: 'Messages / 24h',
    value: '18.4M',
    icon: 'database',
    trendValue: 1.2,
    trendSentiment: 'positive',
  },
  {
    id: 'sites',
    label: 'Sites',
    value: '74',
    icon: 'location',
    trendValue: 3,
    trendSentiment: 'positive',
  },
];
```

These values are mock data only.

---

# 13. Fleet Topology

This is the largest panel in the screenshot.

The reference visualizes:

```text
mCloud
  │
  ├── North America
  │     └── Riverside Plant
  │           └── Gateway
  │                └── Sensors
  │
  ├── Europe
  ├── Asia Pacific
  ├── Manufacturing
  └── Utilities
```

The initial implementation should reproduce the visual concept without building a fully dynamic topology engine.

Create feature-level components such as:

```text
FleetTopology
├── TopologyToolbar
├── TopologyLegend
├── TopologyRootNode
├── TopologyGroupNode
├── TopologySiteNode
├── TopologyGatewayNode
└── TopologySensorNode
```

### Reuse Rule

Only extract a generic `TopologyNode` if the implementation genuinely shares enough structure.

Do not create excessive abstractions for one screen.

### Topology toolbar

Include UI controls similar to:

- Topology/List toggle
- Filter
- Zoom in
- Zoom out
- Fit/fullscreen

Initial implementation:

- Topology/List toggle can switch presentation if easy
- Filter may be a visual control only
- Zoom controls may be disabled/no-op unless a scalable topology surface is implemented
- Do not fake functionality that is not actually implemented

---

# 14. Topology Legend

Reference statuses:

```text
● Online
● Degraded
● Offline

--- Cellular
--- LoRaWAN
--- Wi-Fi
--- Ethernet
```

Create a small reusable legend primitive if a similar legend will also be used by charts.

Possible shared component:

```ts
interface LegendItem {
  id: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  lineStyle?: 'solid' | 'dashed';
}

interface LegendProps {
  items: LegendItem[];
}
```

Use existing theme/status tokens instead of business colors inside the shared component.

---

# 15. Active Incidents & Troubleshooting

The right side of the main row contains:

1. Compact incident table
2. Expanded/selected incident detail card

### Incident table columns

```text
Severity
Incident
Organization / Site
Devices
First Seen
Status
Action
```

Suggested type:

```ts
interface Incident {
  id: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  title: string;
  organization: string;
  site: string;
  affectedDevices: number;
  firstSeen: string;
  status: 'open' | 'investigating' | 'resolved';
}
```

Use a reusable table primitive if one already exists.

Do not build a general enterprise table library just for this page.

---

# 16. Selected Incident Detail

The reference expands a critical incident:

```text
Gateway Offline — Detroit Plant
Critical

Model
Serial
Firmware
Site
Organization

Last Seen
Gateway
Signal
Packet Loss
Connected Sensors

IP
CPU
Memory
Uptime

Recommended Next Action

[Diagnose]
[Run Connectivity Test]
```

Create a feature-level component:

```text
IncidentDetails
```

Useful smaller reusable primitives inside it:

- `KeyValueList`
- `StatusBadge`
- `Button`
- `DataValue`
- `Callout`

A generic `KeyValueList` can live in shared UI if there is already another realistic use.

Suggested API:

```ts
interface KeyValueItem {
  label: string;
  value: React.ReactNode;
}

interface KeyValueListProps {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
}
```

---

# 17. Telemetry & Alert Trends

Reference is a multi-series line chart plus alert bars.

Series include:

- Temperature
- Humidity
- Vibration
- Power
- Messages/sec
- Alerts

Controls include:

```text
Last 24 hours
```

Implementation rules:

- Reuse the chart package already installed
- Do not add a second chart library
- Isolate chart configuration from mock data
- Make tooltip keyboard/mouse friendly where supported
- Ensure chart has an accessible text summary or aria label
- Handle empty/loading states

Suggested component structure:

```text
TelemetryTrends
├── PanelHeader
├── Legend
├── TimeRangeSelect
└── TelemetryTrendChart
```

Do not put GraphQL query logic inside the chart.

---

# 18. Connectivity Breakdown

Reference is a donut chart with total in the center:

```text
12,846
Devices
```

Breakdown:

- LoRaWAN
- Cellular (4G/5G)
- Private LTE
- Wi-Fi
- Ethernet

Suggested type:

```ts
interface ConnectivitySegment {
  id: string;
  label: string;
  percentage: number;
  count: number;
}
```

Component:

```text
ConnectivityBreakdown
├── DonutChart
└── ConnectivityLegend
```

If the chart library already provides a reusable donut component, use it.

---

# 19. Organization Health

Reference table columns:

```text
Organization
Online %
Critical Alerts
Gateways
Sensors
Data Rate
Action
```

Example organizations:

- North America
- Europe
- Asia Pacific
- Manufacturing
- Utilities

Create:

```text
OrganizationHealth
```

Possible type:

```ts
interface OrganizationHealthRow {
  id: string;
  organizationName: string;
  onlinePercentage: number;
  criticalAlerts: number;
  gateways: number;
  sensors: number;
  dataRate: string;
}
```

Rules:

- Percentage should use semantic status styling
- Critical alerts should use danger styling when > 0
- `View` should be a real button/link
- Keep desktop table compact
- On smaller screens allow horizontal scrolling or convert rows into compact cards based on the existing application pattern

---

# 20. Telemetry Fleet

This is the wider table in the lower section.

Columns in the screenshot:

```text
Gateway
Model
Organization
Site
Backhaul
LoRaWAN Devices
Status
Last Seen
Firmware
CPU
Memory
Signal
Actions
```

Suggested type:

```ts
interface FleetGateway {
  id: string;
  name: string;
  model: string;
  organization: string;
  site: string;
  backhaul: string;
  loraWanDevices: number;
  status: GatewayStatus;
  lastSeen: string;
  firmwareVersion: string;
  cpuPercentage: number;
  memoryPercentage: number;
  signalDbm: number;
}
```

Create:

```text
TelemetryFleet
```

Use:

- shared `DataTable`
- shared `StatusBadge`
- shared `IconButton`
- feature formatters

Do not put mock rows directly into table JSX.

---

# 21. Selected Gateway

Reference shows a compact detail/action card.

Information:

```text
MTGW-LR-0044
Degraded

Asia Pacific / Singapore Site

[Restart Service]
[Reboot Gateway]
[Sync Config]
[Run Connectivity Test]
[View Logs]
[Deploy Firmware]

All actions are logged and audited
View Audit Trail
```

Create:

```text
SelectedGateway
```

Suggested props:

```ts
interface SelectedGatewayProps {
  gateway: SelectedGatewayModel;
  onRestartService?: () => void;
  onReboot?: () => void;
  onSyncConfig?: () => void;
  onConnectivityTest?: () => void;
  onViewLogs?: () => void;
  onDeployFirmware?: () => void;
}
```

Initial handlers may be mock callbacks.

Buttons should still have normal disabled/loading capability so future mutations can be plugged in easily.

---

# 22. Site Map

The screenshot contains a small world map with site status markers.

Initial UI options:

### Preferred

If the project already uses a map library, reuse it.

### Otherwise

Create a lightweight visual placeholder using an existing local world map asset or simple map surface.

Do not add a heavy mapping SDK just to imitate this small dashboard widget.

Component:

```text
SiteMap
```

Possible data:

```ts
interface SiteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: GatewayStatus;
}
```

Keep data shape ready for future GraphQL.

---

# 23. Recent Changes

Reference table:

```text
Time
User
Action
Target
Details
```

Examples:

```text
14:28  JD  Updated configuration  MTGW-LR-0044  LoRa settings changed
12:14  MS  Acknowledged alert     MTCDT-AP-0023 Gateway Offline
10:03  RP  Deployed firmware      MTRR-900-0101 4.1.0
```

Create:

```text
RecentChanges
```

Suggested type:

```ts
interface RecentChange {
  id: string;
  timestamp: string;
  userInitials: string;
  action: string;
  target: string;
  details: string;
}
```

---

# 24. System Health

Reference displays small service health blocks:

```text
API Latency            42 ms
Ingestion Lag          3 sec
GraphQL                99.9%
Azure Services         99.8%
Event Processing       99.8%
Last Deployment        Apr 26, 2025 14:12 UTC
```

The panel header includes:

```text
● All Systems Operational
View Details
```

Create:

```text
SystemHealth
```

Reuse a small generic `StatValue` if useful elsewhere.

Suggested type:

```ts
interface SystemHealthMetric {
  id: string;
  label: string;
  value: string;
  tone?: StatusTone;
}
```

---

# 25. Mock Data Strategy

All initial data should come from one or more dedicated mock files.

Example:

```text
features/overview/mock/
├── metrics.mock.ts
├── topology.mock.ts
├── incidents.mock.ts
├── telemetry.mock.ts
├── organizations.mock.ts
├── gateways.mock.ts
├── changes.mock.ts
└── system-health.mock.ts
```

Or use one file if the data volume remains small:

```text
overview.mock.ts
```

Do not:

```tsx
<MetricCard value="12,846" />
<MetricCard value="12,071" />
```

throughout the page with unrelated hardcoded values.

Instead:

```tsx
<MetricsGrid metrics={overviewMetrics} />
```

This makes GraphQL replacement straightforward later.

---

# 26. GraphQL-Ready Data Boundary

Even though GraphQL is not being connected now, create a clean data boundary.

A simple first version may be:

```ts
export function useOverviewDashboard() {
  return {
    data: overviewMockData,
    loading: false,
    error: null,
    refetch: async () => undefined,
  };
}
```

The page then uses:

```tsx
const { data, loading, error } = useOverviewDashboard();
```

Later this implementation can change internally to GraphQL without changing the whole component tree.

### Future flow

```text
OverviewPage
    ↓
useOverviewDashboard
    ↓
useOverviewQuery / generated GraphQL hook
    ↓
Overview GraphQL query
```

Do not create fake GraphQL operations now.

---

# 27. Future GraphQL Organization

When API integration starts, follow the application's GraphQL architecture.

Recommended future shape:

```text
features/
└── overview/
    └── api/
        └── graphql/
            ├── queries/
            │   └── getOverviewDashboard.graphql
            ├── fragments/
            │   ├── gatewaySummary.graphql
            │   ├── incidentSummary.graphql
            │   └── organizationHealth.graphql
            └── generated/
```

Keep the configured GraphQL client under the existing global infrastructure layer.

Components should consume feature hooks rather than importing the configured client directly.

---

# 28. Possible Future Overview Query

Do not implement this until the backend schema is available.

Conceptually the query may eventually request:

```graphql
query GetOverviewDashboard(
  $organizationId: ID
  $siteId: ID
  $timeRange: OverviewTimeRange!
) {
  overview(
    organizationId: $organizationId
    siteId: $siteId
    timeRange: $timeRange
  ) {
    metrics {
      managedDevices
      onlineDevices
      gateways
      sensors
      criticalAlerts
      connectivityHealth
      messages24h
      sites
    }

    incidents {
      id
      severity
      title
      status
    }

    connectivity {
      type
      count
      percentage
    }

    organizationHealth {
      organizationId
      organizationName
      onlinePercentage
      criticalAlerts
      gateways
      sensors
      dataRate
    }
  }
}
```

This is only an architectural example.

Do not invent a production GraphQL contract before the real backend schema exists.

---

# 29. Page Composition

`OverviewPage.tsx` should remain primarily composition.

Example:

```tsx
export function OverviewPage() {
  const { data, loading, error } = useOverviewDashboard();

  if (loading) {
    return <OverviewPageSkeleton />;
  }

  if (error) {
    return <OverviewErrorState />;
  }

  return (
    <div className={styles.page}>
      <OverviewHeader />

      <MetricsGrid metrics={data.metrics} />

      <section className={styles.operationsGrid}>
        <FleetTopology data={data.topology} />
        <ActiveIncidents incidents={data.incidents} />
      </section>

      <section className={styles.analyticsGrid}>
        <TelemetryTrends data={data.telemetryTrends} />
        <ConnectivityBreakdown data={data.connectivity} />
        <OrganizationHealth rows={data.organizationHealth} />
      </section>

      <section className={styles.fleetGrid}>
        <TelemetryFleet gateways={data.gateways} />
        <SelectedGateway gateway={data.selectedGateway} />
      </section>

      <section className={styles.bottomGrid}>
        <SiteMap sites={data.sites} />
        <RecentChanges changes={data.recentChanges} />
        <SystemHealth health={data.systemHealth} />
      </section>
    </div>
  );
}
```

This is an example, not a requirement to use these exact names.

Follow existing naming and export conventions.

---

# 30. Responsive Layout

The screenshot is a large desktop dashboard.

The implementation must not assume a 1920px screen.

## Desktop / Large Laptop

Suggested:

```text
Page
├── Header
├── 8 KPI cards in responsive grid
├── 2-column operations row
├── 3-column analytics row
├── 2-column fleet row
└── 3-column bottom row
```

Possible grid ratios:

```scss
operations:
  minmax(0, 1.6fr) minmax(320px, 1fr)

analytics:
  minmax(0, 1.5fr) minmax(280px, 0.8fr) minmax(360px, 1fr)

fleet:
  minmax(0, 2fr) minmax(320px, 0.9fr)

bottom:
  repeat(3, minmax(0, 1fr))
```

Do not blindly use these values if the existing breakpoint system suggests something better.

---

# 31. Tablet

At tablet sizes:

- KPI cards: 2–4 columns depending on width
- Topology and incidents: stack if necessary
- Analytics panels: wrap/stack
- Tables: horizontal scroll when column reduction would remove important information
- Selected Gateway: full width
- Bottom cards: 1–2 columns

Do not make fonts extremely small to keep the desktop arrangement.

---

# 32. Mobile

Mobile should prioritize summary information.

Suggested order:

```text
Page Header
Metrics
Critical Incidents
Connectivity Breakdown
Organization Health
Selected Gateway
Telemetry Trends
Telemetry Fleet
Recent Changes
System Health
Site Map / Topology
```

Possible approaches:

- render same DOM order when practical
- use CSS grid reflow
- do not duplicate components only to reorder mobile layout

For dense tables:

- horizontal scroll, OR
- a compact card representation if the application already uses this pattern

Do not shrink a 13-column table into unreadable text.

---

# 33. KPI Grid Responsiveness

Suggested behavior:

```text
>= very large: 8 columns if space permits
desktop:       4 columns
tablet:        2 columns
mobile:        1 column
```

The exact breakpoints must come from the existing SCSS architecture.

---

# 34. Visual Styling

The overview page uses:

### Page background

Very light cool gray/blue.

### Panels

- white
- subtle gray-blue border
- small radius
- little or no heavy shadow

### Headings

Dark navy/blue.

### Primary interactive color

Bright enterprise blue.

### Semantic colors

- Green = healthy / online / success
- Red = critical / offline / error
- Amber = degraded / warning
- Blue = info / neutral operational data

Do not introduce arbitrary colors if equivalent tokens already exist.

---

# 35. Spacing

The screenshot is compact.

Recommended visual rhythm:

```text
Page gap:          12–16px
Panel gap:         10–14px
Panel padding:     12–16px
Card radius:       ~6–10px
Compact row:       ~32–40px
```

These are reference values only.

Use existing spacing tokens whenever available.

---

# 36. Typography

Maintain a clear hierarchy:

```text
Page title
Panel title
Metric label
Metric value
Table header
Table cell
Supporting/meta text
```

Do not create a unique font size for each card.

Reuse typography tokens/classes.

---

# 37. Reusable Data Table

If no suitable table component already exists, create a lightweight reusable `DataTable`.

It should support:

- column definitions
- row data
- custom cell renderer
- row key
- empty state
- optional compact density
- horizontal overflow
- accessible table markup

Suggested simplified types:

```ts
interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  compact?: boolean;
}
```

Do not attempt to recreate TanStack Table unless advanced table behavior is required.

If TanStack Table or another table system is already installed and used, reuse it.

---

# 38. Reusable Loading States

Dashboard data will later come from GraphQL.

Prepare for loading now.

Possible shared primitives:

```text
Skeleton
PanelSkeleton
TableSkeleton
MetricCardSkeleton
```

Or feature-specific:

```text
OverviewPageSkeleton
```

Do not create dozens of one-off skeleton files unless necessary.

---

# 39. Error State

The future Overview query can fail.

Provide a page-level error state with:

- useful message
- retry action
- no stack trace
- no raw GraphQL error dumped into UI

Example interface:

```ts
interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}
```

---

# 40. Empty States

Individual sections may be empty later.

Examples:

```text
No active incidents
No recent changes
No gateways found
No telemetry available for this time range
```

Do not hide the entire card unexpectedly.

Prefer a small meaningful empty state inside the panel.

---

# 41. Accessibility

The overview must remain usable beyond visual presentation.

Requirements:

- semantic headings
- each panel should have an accessible title
- real `<button>` elements for actions
- real table semantics
- `aria-label` on icon-only controls
- visible focus indicators
- chart text alternatives
- status meaning should not depend only on color
- sufficient color contrast
- no clickable `<div>`
- tooltips where icon meaning is unclear
- keyboard-accessible menus/selectors

---

# 42. Performance

This is a dense dashboard, so avoid unnecessary re-rendering.

Guidelines:

- keep static column definitions/config outside render where possible
- do not add `useMemo` everywhere without reason
- chart datasets can be memoized if transformation is expensive
- use stable row keys
- avoid storing derived data in component state
- do not duplicate the same dataset in multiple state variables
- lazy-load a heavy map or topology visualization only if it materially improves initial load
- do not optimize prematurely

---

# 43. Type Definitions

Create clear domain types in the Overview feature.

Example:

```ts
export interface OverviewDashboardData {
  metrics: OverviewMetric[];
  topology: FleetTopologyData;
  incidents: Incident[];
  telemetryTrends: TelemetryTrendData;
  connectivity: ConnectivitySegment[];
  organizationHealth: OrganizationHealthRow[];
  gateways: FleetGateway[];
  selectedGateway: SelectedGatewayModel | null;
  sites: SiteLocation[];
  recentChanges: RecentChange[];
  systemHealth: SystemHealthData;
}
```

The page should consume this model rather than multiple unrelated constants.

This will simplify future mapping from generated GraphQL types.

---

# 44. Mapper Layer for Future GraphQL

When GraphQL arrives, do not force GraphQL-generated types through the entire UI.

Prefer:

```text
Generated GraphQL Type
        ↓
Overview Mapper
        ↓
OverviewDashboardData
        ↓
UI
```

Example future location:

```text
features/overview/mappers/mapOverviewDashboard.ts
```

Benefits:

- UI remains independent of schema quirks
- formatting is centralized
- null-handling is centralized
- backend schema changes have smaller UI impact

---

# 45. Data Formatting Utilities

Create small feature utilities only when needed.

Examples:

```text
formatMetricValue
formatLastSeen
formatPercentage
formatSignalStrength
formatDataRate
formatDeviceCount
```

Prefer existing global formatters first.

Do not create a new generic utility if the application already has one.

---

# 46. Interaction Rules

Initial interactions may include:

- time-range selection
- topology/list toggle
- selecting an incident
- selecting a gateway
- panel action buttons
- View links/buttons
- Export button
- table row actions

For mock mode:

- local component/feature state is acceptable
- keep interactions deterministic
- do not simulate random network behavior
- clearly separate UI state from mock server data

---

# 47. Avoid Overengineering

Do not introduce:

- Redux solely for this page
- a new chart library if one already exists
- a new CSS framework
- a new component library
- micro-frontends
- complicated event buses
- custom state machines for simple interactions
- a generic dashboard engine
- dynamic drag-and-drop layout
- GraphQL before schema/API is ready

Build the overview page cleanly and incrementally.

---

# 48. Styling Architecture

Follow the existing SCSS approach:

```text
React Component
      ↓
ComponentName.module.scss
      ↓
Shared SCSS abstracts
      ↓
Design tokens
      ↓
Mixins/functions
      ↓
CSS theme variables
```

Rules:

- component-specific styles use `.module.scss`
- keep feature-only styling inside the Overview feature
- shared component styling stays beside that shared component
- reuse existing design tokens
- reuse existing mixins
- mobile-first responsive styling
- max SCSS nesting around three levels
- avoid `!important`
- avoid ID selectors
- avoid broad global selectors
- do not add arbitrary breakpoints
- do not duplicate existing spacing/typography/colors/radii

---

# 49. Suggested Page SCSS Structure

Example:

```scss
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.metricsGrid {
  display: grid;
  gap: var(--space-3);
}

.operationsGrid,
.analyticsGrid,
.fleetGrid,
.bottomGrid {
  display: grid;
  gap: var(--space-3);
}
```

Use the real project's tokens and breakpoint mixins.

Do not copy these variable names unless they already exist.

---

# 50. Component Size Guidance

Keep components focused.

Recommended guidance:

```text
Page composition component: ideally <= 200–250 lines
Feature section component:   ideally <= 200 lines
Shared UI primitive:         ideally <= 150 lines
Function:                    ideally <= 40–50 lines
```

These are guidelines, not artificial hard limits.

Split by responsibility, not just line count.

---

# 51. Testing

If the existing project has testing configured, include useful tests.

### Overview Page

Verify:

- page renders all major sections
- loading state
- error state
- mock data is rendered

### Metric Card

Verify:

- label/value render
- positive/negative trend state
- optional trend missing does not break layout

### Status Badge

Verify:

- label renders
- semantic tone class/attribute is applied

### Incidents

Verify:

- incident rows render
- selected incident detail updates when selection changes

### Telemetry Fleet

Verify:

- gateway rows render
- status badge renders
- action button accessible

Do not write tests for trivial implementation details.

---

# 52. Suggested Build Order

The AI coding agent should implement in this order:

1. Inspect existing architecture and styles
2. Create Overview feature boundary if missing
3. Define Overview domain types
4. Create mock data
5. Implement/reuse `Panel`
6. Implement/reuse `PanelHeader`
7. Implement/reuse `StatusBadge`
8. Implement/reuse `TrendIndicator`
9. Implement/reuse `MetricCard`
10. Create `OverviewHeader`
11. Create `MetricsGrid`
12. Create `FleetTopology`
13. Create `ActiveIncidents`
14. Create `TelemetryTrends`
15. Create `ConnectivityBreakdown`
16. Create `OrganizationHealth`
17. Create `TelemetryFleet`
18. Create `SelectedGateway`
19. Create `SiteMap`
20. Create `RecentChanges`
21. Create `SystemHealth`
22. Compose `OverviewPage`
23. Add responsive SCSS
24. Add loading/error/empty states
25. Wire route
26. Run lint
27. Run TypeScript check
28. Run tests if available
29. Run production build
30. Fix issues caused by the implementation

---

# 53. AI Agent — Important Reuse Decision

Before creating each component, ask:

```text
Does this already exist?
        │
        ├── Yes → reuse it
        │
        └── No
             │
             ├── Is it truly application-wide?
             │      ├── Yes → shared component
             │      └── No → Overview feature component
```

Examples:

```text
StatusBadge        → likely shared
Panel              → likely shared
IconButton         → shared
DataTable          → shared if already useful elsewhere
FleetTopology      → overview feature
ActiveIncidents    → overview feature
SelectedGateway    → overview feature
OrganizationHealth → overview feature
```

---

# 54. Expected Initial Mock View Model

The hook may initially return:

```ts
const data: OverviewDashboardData = {
  metrics,
  topology,
  incidents,
  telemetryTrends,
  connectivity,
  organizationHealth,
  gateways,
  selectedGateway,
  sites,
  recentChanges,
  systemHealth,
};
```

When GraphQL is added later, only the data source and mapper should need major changes.

---

# 55. Acceptance Criteria

The Overview page is complete when:

- it visually follows the supplied Fleet Operations reference
- it contains all major dashboard areas from the image
- it does not recreate the sidebar/navbar
- it uses the existing AppShell
- the page is implemented as an Overview feature
- mock data is separated from presentation
- page structure is GraphQL-ready
- there is no GraphQL/backend implementation yet
- reusable primitives are reused or created where justified
- business-specific components remain feature-local
- KPI cards are data-driven
- status treatments are consistent
- tables are readable and responsive
- charts are responsive
- desktop layout resembles the reference
- tablet layout remains usable
- mobile layout remains usable
- loading/error/empty patterns are supported
- no unrelated feature is modified
- no duplicate shared component is introduced
- existing SCSS architecture is followed
- existing React architecture is followed
- TypeScript/lint/build complete without new errors

---

# 56. Final Prompt to Give the Coding Agent

Use this after placing this Markdown file in the repository:

> Read this entire specification before making any changes.
>
> First inspect the existing React architecture, SCSS architecture, AppShell, routing, shared UI components, design tokens, icon library, chart dependencies, table components, and existing coding conventions.
>
> The supplied reference image is the visual target for the **Overview / Fleet Operations main content only**. Do not recreate or replace the sidebar or top navbar.
>
> Build the Overview page using the existing application architecture. This project uses a feature-first structure, so Overview-specific business UI should remain inside the Overview feature. Only move/create components in shared UI when they are genuinely reusable across the application.
>
> Reuse existing Card/Panel, Button, IconButton, Badge, Select, Table, Tooltip, Skeleton, and other shared primitives before creating new ones.
>
> Recreate these sections from the reference:
>
> - Overview/Fleet Operations page header
> - KPI metrics grid
> - Fleet Topology
> - Active Incidents & Troubleshooting
> - Telemetry & Alert Trends
> - Connectivity Breakdown
> - Organization Health
> - Telemetry Fleet
> - Selected Gateway
> - Site Map
> - Recent Changes
> - System Health
>
> Use dedicated mock data and strongly typed Overview models. Do not hardcode large datasets directly inside JSX.
>
> Do not connect the backend or GraphQL yet. However, design the data boundary so GraphQL can be introduced later through an Overview feature hook without rewriting the presentation components.
>
> A good initial boundary is `useOverviewDashboard()`, which returns the typed mock `OverviewDashboardData`. Later this hook will call feature-local GraphQL operations and map generated GraphQL types to the Overview UI model.
>
> Do not import the configured GraphQL client into visual components.
>
> Use the chart library that is already installed. Do not install another chart package unless the project has no chart capability and implementation genuinely requires one.
>
> Follow the existing SCSS architecture. Use component SCSS Modules, existing design tokens, existing mixins, mobile-first breakpoints, and existing theme variables. Do not create duplicated global CSS or arbitrary hardcoded colors.
>
> Make the dashboard responsive. Preserve the dense desktop layout on large screens, progressively stack panels on tablets, and provide readable mobile layouts. Do not make desktop tables unreadably small on mobile; use horizontal overflow or the existing mobile table/card pattern.
>
> Add loading, error, and empty-state handling now so future GraphQL data can plug in cleanly.
>
> Maintain accessibility: semantic headings, accessible tables, real buttons, keyboard navigation, visible focus states, ARIA labels for icon-only actions, and status indicators that do not rely only on color.
>
> Do not over-engineer the page. Do not introduce Redux, a new UI framework, a second chart library, a generic dashboard engine, or GraphQL operations before they are needed.
>
> After implementation:
>
> 1. run lint
> 2. run TypeScript checks
> 3. run existing tests
> 4. run the production build
> 5. fix all issues caused by these changes
>
> Then provide a short implementation report containing:
>
> - files created
> - files modified
> - existing shared components reused
> - new reusable shared components created
> - Overview-specific components created
> - mock data locations
> - responsive behavior implemented
> - functionality intentionally left for GraphQL/backend integration
> - any assumptions made

---

# 57. Final Principle

Build the page so that today:

```text
Overview UI
    ↓
Typed mock data
```

can later become:

```text
Overview UI
    ↓
Overview feature hook
    ↓
GraphQL query
    ↓
Backend
```

without redesigning the component tree.

The UI should know **what data it needs**, not **how that data is fetched**.
