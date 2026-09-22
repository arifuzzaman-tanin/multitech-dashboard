# Dashboard Overview Summary Cards GraphQL Integration

> Use this file as the implementation specification for an AI coding agent working in the existing `multitech-dashboard` React application.
>
> Scope: connect the existing Overview summary cards to the backend GraphQL API. Preserve the rest of the Overview page and its current mock-backed sections.

## 1. Objective

Replace the mock data used by the eight existing Overview summary cards with data fetched from the backend through one GraphQL request.

The cards are already rendered by the Overview feature:

- Managed Devices
- Online
- Gateways
- Sensors
- Critical Alerts
- Connectivity Health
- Messages / 24h
- Sites

Do not redesign these cards. Keep their existing component structure, icons, responsive grid, SCSS Modules, design tokens, and visual styling.

The intended frontend flow is:

```text
OverviewPage
    -> useOverviewDashboard
    -> Overview GraphQL API module
    -> shared API/GraphQL transport
    -> POST /graphql
    -> backend dashboardOverview query
```

## 2. Mandatory First Step

Before changing code, read and follow:

- `AGENTS.md`
- `docs/REACT_ARCHITECTURE.md`
- `docs/SCSS_ARCHITECTURE.md`
- `docs/OVERVIEW_PAGE.md`
- `src/shared/api/apiClient.ts`
- `src/features/overview/hooks/useOverviewDashboard.ts`
- `src/features/overview/types/overview.types.ts`
- `src/features/overview/mock/overview.mock.ts`
- `src/features/overview/components/MetricsGrid.tsx`
- `src/features/overview/pages/OverviewPage.tsx`
- `vite.config.ts`

Inspect the current repository again before implementation because these files may have changed since this specification was written.

Follow the established architecture and naming conventions. Do not introduce Apollo Client, Relay, TanStack Query, Redux, Zustand, a generated GraphQL client, or another state-management dependency for this small read-only integration unless one has already been adopted by the application when implementation begins.

## 3. Existing Architecture To Preserve

The application currently uses:

- React 19 and strict TypeScript.
- A feature-first folder structure.
- `@/` path aliases.
- Feature-specific types and hooks under `src/features/overview`.
- Shared HTTP behavior in `src/shared/api/apiClient.ts`.
- Authentication headers configured centrally through the shared API client.
- SCSS Modules and shared SCSS tokens/mixins.
- A data-driven `MetricsGrid` that receives `OverviewMetric[]`.
- A single mock object that currently supplies both summary cards and the unfinished Overview sections.

Keep transport logic out of `OverviewPage`, `MetricsGrid`, and individual cards. Keep GraphQL response types inside the Overview feature unless they become genuinely shared by another feature.

## 4. Backend GraphQL Contract

The backend GraphQL endpoint is:

```text
POST /graphql
```

Use this operation:

```graphql
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
```

Expected response shape:

```json
{
  "data": {
    "dashboardOverview": {
      "managedDevices": 248,
      "onlineDevices": 232,
      "gateways": 24,
      "sensors": 224,
      "criticalAlerts": 9,
      "connectivityHealthPercent": 93.55,
      "messagesLast24Hours": 3881095,
      "sites": 10,
      "lastUpdatedUtc": "2026-09-22T06:45:00Z"
    }
  }
}
```

GraphQL can return HTTP `200` with an `errors` array. Treat a response containing GraphQL errors, missing `data`, or missing `dashboardOverview` as a failed request. Do not silently render zeroes or stale mock values in those cases.

Suggested transport types:

```ts
interface GraphQlError {
  message: string
}

interface GraphQlResponse<TData> {
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
```

Use names that match current project conventions if equivalent types already exist.

## 5. Dev Server Routing

The Vite development server currently proxies `/api` only. Add a `/graphql` proxy using the same backend target and TLS behavior:

```ts
'/graphql': {
  target: 'https://localhost:7139',
  changeOrigin: true,
  secure: false,
},
```

The frontend request should use the relative path `/graphql` through the shared API infrastructure. This keeps local development same-origin and allows `VITE_API_BASE_URL` to continue controlling deployed environments.

Do not hard-code `https://localhost:7139` in feature code.

## 6. Suggested File Placement

Adapt this list if the current repository already has an equivalent module:

```text
src/
  features/
    overview/
      api/
        graphql/
          dashboardOverview.query.ts
          dashboardOverview.types.ts
      hooks/
        useOverviewDashboard.ts
      types/
        overview.types.ts
      utils/
        overviewSummary.mapper.ts
```

Create only files that provide a clear responsibility. A mapper may remain in the API module if it is short and cohesive. Do not create empty fragment, generated-code, service, constant, or index files merely to match this example.

If a generic GraphQL request wrapper is useful, place it under `src/shared/api` and keep it transport-focused. It should reuse `apiRequest` so authentication, base URL handling, and unauthorized retry behavior remain centralized.

## 7. API Implementation Requirements

Create an Overview feature API function such as:

```ts
export function getDashboardOverview(): Promise<DashboardOverviewSummary>
```

Requirements:

- Send one `POST` request to `/graphql`.
- Send JSON with the query in a `query` property.
- Reuse `apiRequest` rather than calling `fetch` directly from the feature if practical.
- Preserve the shared API client's authorization and refresh behavior.
- Check both HTTP failures and GraphQL `errors`.
- Return the typed `dashboardOverview` payload, not the full GraphQL envelope.
- Surface a safe, useful error message to the hook/page.
- Never use `any`.
- Do not log access tokens, response headers, or sensitive payloads.

If request cancellation is added, extend the shared API request options with an optional `AbortSignal` and pass it to `fetch`. Keep that change backward compatible with existing REST calls.

## 8. Mapping Backend Values To Existing Cards

Keep `MetricsGrid` presentational. Map the GraphQL payload into the existing `OverviewMetric[]` model before rendering.

Use this mapping:

| Card ID | Label | GraphQL field | Existing icon | Accent |
|---|---|---|---|---|
| `managed-devices` | Managed Devices | `managedDevices` | `device` | existing/default |
| `online` | Online | `onlineDevices` | `wifi` | `success` |
| `gateways` | Gateways | `gateways` | `gateway` | existing/default |
| `sensors` | Sensors | `sensors` | `sensor` | existing/default |
| `critical-alerts` | Critical Alerts | `criticalAlerts` | `alert` | `danger` when greater than zero |
| `connectivity-health` | Connectivity Health | `connectivityHealthPercent` | `signal` | `success` |
| `messages` | Messages / 24h | `messagesLast24Hours` | `database` | existing/default |
| `sites` | Sites | `sites` | `location` | existing/default |

Formatting requirements:

- Format integer counts with `Intl.NumberFormat` using the application's current locale behavior.
- Format connectivity health with at most two decimal places and append `%`.
- Format message counts compactly only if this matches the existing UI (`3.9M`, for example); otherwise use grouped digits consistently.
- Keep raw API values numeric in transport/domain types. Convert to display strings only in the mapping/presentation boundary.
- Do not fabricate trend percentages because the backend does not return trend data.
- Omit `trendValue` and `trendSentiment` for GraphQL-backed cards.
- Parse `lastUpdatedUtc` as a real timestamp and format it for the existing Overview header. Handle invalid timestamps as an error rather than displaying `Invalid Date`.

Do not mutate `overviewMockData` at runtime.

## 9. Hook Integration

Update `useOverviewDashboard` so it owns the summary request lifecycle.

The hook should expose enough state for the current page to render and retry:

```ts
interface UseOverviewDashboardResult {
  data: OverviewDashboardData | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}
```

Behavior:

1. Fetch the dashboard summary when the Overview page mounts.
2. Prevent state updates after unmount. Prefer `AbortController` when supported by the shared API layer.
3. Set loading state during the initial request and explicit retries.
4. Clear a previous error before retrying.
5. Map the GraphQL summary into `metrics`, `timestampLabel`, and `lastUpdatedLabel`.
6. Continue using the existing mock data for topology, incidents, analytics, fleet, map, recent changes, and system health because those fields are not included in this backend query.
7. Return a new composed `OverviewDashboardData`; do not mutate the imported mock object.
8. Account for React `StrictMode` during development and avoid stale updates or accidental race conditions.

The request should not poll automatically unless the application already has an established polling convention. A single request on mount plus manual retry is sufficient for this scope.

## 10. Page States And Retry

Preserve the page's existing loading and error layouts unless nearby project patterns provide better reusable primitives.

Update the existing Retry button so it calls the hook's `refetch` function. The button must be a real accessible button and should use the existing shared `Button` component if its API and styling fit the current state card.

Required states:

- Loading: shown during the initial summary request.
- Success: all eight cards show GraphQL-backed values.
- Error: show a safe error message and a working Retry action.
- Empty/missing GraphQL data: treat as an error because all summary fields are required by the backend schema.

Do not show the old mock summary card values while a request has failed. This would make the UI look live when it is not.

## 11. Styling And Component Rules

- Reuse `MetricsGrid` and `MetricsGrid.module.scss`.
- Do not redesign the cards or change the responsive column behavior unless required to fix a verified defect.
- Keep feature styles in SCSS Modules.
- Reuse existing spacing, color, radius, typography, and breakpoint tokens.
- Do not add a CSS framework, CSS-in-JS library, or inline style system.
- Preserve keyboard accessibility, semantic markup, visible focus, and screen-reader labels.
- Do not move Overview-specific components into `shared`.
- Do not add explanatory UI text about GraphQL, API calls, mocks, or implementation details.

## 12. Configuration And Security

- Do not place secrets or credentials in frontend environment variables.
- Treat `VITE_API_BASE_URL` as public configuration.
- Keep the request path relative and rely on `appConfig`/the shared API client.
- Let the existing authentication integration attach bearer tokens when available.
- Do not weaken certificate checks in production code. `secure: false` is allowed only in the Vite development proxy for the local ASP.NET development certificate.
- If the backend later protects `dashboardOverview`, use the existing auth refresh behavior rather than adding feature-specific token handling.

## 13. Testing

First inspect whether a frontend test runner has been added since this document was created.

If the project has an established test stack, add focused tests for:

- Successful GraphQL response parsing.
- GraphQL `errors` returned with HTTP `200`.
- Missing `dashboardOverview` data.
- Mapping all eight fields to the correct cards.
- Number and percentage formatting.
- Hook loading, success, error, and retry behavior.
- The Retry button triggering a new request.

Mock the network boundary, not `MetricsGrid` internals.

If no test framework exists, do not add one solely for this task without explicit approval. Compensate with lint, TypeScript build, production build, and a manual browser verification against the running backend.

## 14. Manual Verification

Run the backend GraphQL API and the Vite application. Confirm in browser developer tools that:

1. The browser sends one `POST /graphql` request when the page mounts.
2. The operation is `GetDashboardOverview`.
3. The response contains `data.dashboardOverview`.
4. All eight cards match the response values.
5. No mock trend percentages remain on those cards.
6. Refreshing the page still works through the Vite proxy.
7. A forced backend/network failure shows the error state.
8. Retry succeeds after the backend becomes available.
9. No secrets or tokens are written to the console.
10. The layout remains correct at mobile, tablet, laptop, and wide desktop widths.

Useful local commands:

```powershell
# Backend repository.
dotnet run --project src\MultiTech.Platform.Api\MultiTech.Platform.Api.csproj --launch-profile https

# React repository.
npm run dev
```

## 15. Required Verification Commands

From the React application root, run:

```powershell
npm run lint
npm run build
```

Run existing tests if a test script or test project is present. Fix all failures introduced by this change. Do not suppress TypeScript or ESLint errors to make verification pass.

## 16. Out Of Scope

Do not implement or change:

- Backend entities, migrations, seed data, or GraphQL resolvers.
- The non-summary Overview sections that remain mock-backed.
- New charts, tables, topology behavior, or export behavior.
- Automatic polling, subscriptions, WebSockets, caching frameworks, or optimistic updates.
- A general-purpose GraphQL code-generation pipeline.
- Authentication architecture.
- A visual redesign of the Overview page.
- Unrelated refactors or formatting churn.

## 17. Acceptance Criteria

The implementation is complete when:

- The existing eight summary cards are populated from one backend GraphQL request.
- The request uses `POST /graphql` and the `dashboardOverview` query.
- The Vite development proxy supports `/graphql`.
- API and GraphQL error responses are handled explicitly.
- Transport types are strongly typed and contain no `any`.
- GraphQL/network code is outside presentational components.
- The current shared API/auth infrastructure is reused.
- Backend numeric values are formatted at the UI boundary.
- Mock trend values are not shown for live summary data.
- Existing mock data remains in use only for the unsupported Overview sections.
- Loading, error, and retry states work.
- Existing responsive styling and accessibility are preserved.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification against the running backend succeeds.

## 18. Final Instruction To The Coding Agent

Read this entire specification before making changes. Implement the GraphQL integration for the existing Dashboard Overview summary cards only.

Start by inspecting the current React architecture and all files listed in the mandatory first step. Reuse the existing `MetricsGrid`, Overview types, hook boundary, shared API client, authentication handling, SCSS Modules, design tokens, aliases, and responsive patterns. Do not create a parallel architecture or install a GraphQL/state-management library for this request.

Fetch `dashboardOverview` once through `POST /graphql`, validate the GraphQL envelope, map its nine fields into the existing eight metrics and header timestamp, preserve mock data for all other Overview sections, and implement reliable loading, error, and retry behavior. Add the Vite `/graphql` proxy and keep backend URLs out of feature code.

After implementation, run lint and the production build, run any existing tests, and manually verify the page against the running backend. Finish with a concise report listing files changed, behavior implemented, checks run, and any remaining limitations.
