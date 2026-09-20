# React + TypeScript Application Architecture

> A scalable, production-ready architecture for a modern React application supporting REST APIs, GraphQL, reusable UI, feature isolation, security, performance, testing, localization, and maintainability.

## 1. Goals

This architecture is designed to keep the application:

- Feature-oriented and scalable
- Strongly typed with TypeScript
- Easy to navigate
- Easy to test
- Secure by default
- Optimized without premature optimization
- Ready for REST and GraphQL
- Friendly to AI coding agents and human developers
- Reusable without over-generalization
- Independent from a specific backend implementation

This document defines the architecture and directory responsibilities.

**Do not create reusable components just because their folders are listed here.**
Create a component only when an actual feature requires it.

Examples such as Button, Modal, Table, Input, Layout, Toast, Select, and Pagination describe where reusable components belong when they are implemented.

---

# 2. Architecture Principles

## 2.1 Feature-first architecture

Business functionality should live inside `features/`.

Examples:

- authentication
- users
- settings
- notifications
- billing
- reports

Each feature owns its:

- components
- hooks
- API integration
- GraphQL operations
- validation
- types
- mappers
- utilities
- tests

A feature should expose only what other parts of the application need.

---

## 2.2 Shared code must actually be shared

Do not move code into `shared/` because it *might* be reusable.

Move it there when it is genuinely application-wide.

Good candidates:

- Button
- Modal
- Input
- Select
- Toast
- Loader
- Table primitives
- Layout primitives
- reusable hooks
- formatting utilities
- shared validation helpers

Feature-specific components stay inside their feature.

---

## 2.3 Dependency direction

Preferred dependency flow:

```text
app
 ↓
features
 ↓
shared
 ↓
infrastructure / core
```

Rules:

- `shared` must not import from `features`.
- One feature should avoid directly importing another feature's internal files.
- Features should communicate through public exports, shared abstractions, route state, or application-level orchestration.
- Infrastructure must not depend on UI components.
- Presentational components must not directly own API infrastructure.

Avoid circular dependencies.

---

# 3. Recommended Directory Structure

```text
src/
│
├── app/
│   ├── config/
│   ├── providers/
│   ├── router/
│   ├── guards/
│   └── bootstrap/
│
├── features/
│   ├── authentication/
│   │   ├── api/
│   │   │   ├── rest/
│   │   │   └── graphql/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── models/
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── mappers/
│   │   ├── permissions/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── tests/
│   │
│   ├── users/
│   │   ├── api/
│   │   │   ├── rest/
│   │   │   └── graphql/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── models/
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── mappers/
│   │   ├── permissions/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── tests/
│   │
│   └── <feature-name>/
│       ├── api/
│       │   ├── rest/
│       │   └── graphql/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── models/
│       ├── types/
│       ├── schemas/
│       ├── mappers/
│       ├── permissions/
│       ├── utils/
│       ├── constants/
│       └── tests/
│
├── shared/
│   ├── components/
│   │   ├── actions/
│   │   ├── data-display/
│   │   ├── feedback/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── navigation/
│   │   └── overlays/
│   │
│   ├── hooks/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   ├── schemas/
│   └── tests/
│
├── infrastructure/
│   ├── api/
│   │   ├── rest/
│   │   └── graphql/
│   │
│   ├── auth/
│   ├── cache/
│   ├── logging/
│   ├── monitoring/
│   ├── storage/
│   └── telemetry/
│
├── state/
│   ├── client/
│   └── server/
│
├── layouts/
│
├── pages/
│
├── routes/
│
├── locales/
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── styles/
│   ├── tokens/
│   ├── global/
│   └── themes/
│
├── test/
│   ├── fixtures/
│   ├── mocks/
│   ├── setup/
│   └── utils/
│
├── types/
│
├── main.tsx
└── vite-env.d.ts
```

The folders above define boundaries. They do not mean every feature must create every folder immediately.

**Create only the folders a feature actually needs.**

---

# 4. `app/`

`app/` contains application composition.

It should not contain business feature implementation.

```text
app/
├── config/
├── providers/
├── router/
├── guards/
└── bootstrap/
```

## `config/`

Application-wide configuration.

Responsibilities:

- environment configuration
- feature configuration
- API base URLs
- runtime configuration
- application constants that genuinely apply globally

Environment variables should be read and validated centrally rather than accessed throughout components.

---

## `providers/`

Application-wide React providers.

Examples of providers that may eventually belong here:

- Router provider
- authentication provider
- localization provider
- theme provider
- TanStack Query provider
- Apollo provider
- error monitoring provider

Do not create all providers in advance.

Add one when the application actually requires it.

---

## `router/`

Application routing configuration.

Responsibilities:

- top-level route definitions
- lazy-loaded feature routes
- route metadata
- route error handling

Feature-specific route configuration may stay inside the feature when useful and be composed by the application router.

---

## `guards/`

Route-level authorization and access-control orchestration.

Examples:

- authenticated route requirements
- permission checks
- tenant/workspace requirements

Frontend guards improve UX but must never be considered the security boundary. Authorization must be enforced by the backend.

---

## `bootstrap/`

Application startup concerns.

Examples:

- configuration validation
- monitoring initialization
- API client initialization
- startup error handling

Keep `main.tsx` small.

---

# 5. `features/`

`features/` is the primary business organization of the application.

Example:

```text
features/
└── users/
    ├── api/
    │   ├── rest/
    │   └── graphql/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── models/
    ├── types/
    ├── schemas/
    ├── mappers/
    ├── permissions/
    ├── utils/
    ├── constants/
    └── tests/
```

Not every feature needs every folder.

Start small and add folders only when necessary.

---

# 6. Feature `components/`

Feature-specific UI belongs here.

Example categories may include:

- user profile UI
- user settings UI
- user management table
- authentication form
- feature-specific dialogs

Do **not** move a feature component into `shared/components` just because another component looks similar.

Promote it to shared only after genuine reuse exists.

---

# 7. Feature `pages/`

Pages are route-level feature orchestration.

A page should mainly:

- compose feature components
- call feature hooks
- coordinate route state
- handle top-level loading/error/empty states
- connect feature behavior

Avoid putting large amounts of reusable business logic inside pages.

---

# 8. Feature `hooks/`

Feature-specific React behavior belongs here.

Examples of responsibilities:

- obtaining feature data
- mutations
- workflow state
- feature permissions
- URL-filter synchronization
- feature-specific orchestration

Do not create a custom hook simply to move arbitrary code out of a component.

A hook should represent meaningful React behavior.

---

# 9. Feature `api/`

Each feature owns the API operations it needs.

```text
api/
├── rest/
└── graphql/
```

This allows REST and GraphQL to coexist without coupling UI components directly to either transport.

Components should normally consume feature hooks, not Axios/Apollo/fetch directly.

---

# 10. REST Architecture

Global REST infrastructure:

```text
infrastructure/
└── api/
    └── rest/
        ├── client/
        ├── middleware/
        ├── errors/
        ├── types/
        └── config/
```

Feature REST operations:

```text
features/
└── users/
    └── api/
        └── rest/
```

## Global REST responsibilities

The global REST layer should eventually centralize:

- base URL
- default headers
- credentials
- authentication handling
- request IDs/correlation IDs
- cancellation
- timeouts
- standard error normalization
- response parsing
- retry policy where appropriate

Do not put domain-specific endpoints in the global client.

Feature endpoints stay in feature API folders.

---

# 11. REST Flow

Preferred flow:

```text
React Component
      ↓
Feature Hook
      ↓
Feature API Function
      ↓
Shared REST Client
      ↓
Backend API
```

Example conceptual flow:

```text
UsersPage
   ↓
useUsers
   ↓
users REST operation
   ↓
rest client
   ↓
/api/users
```

The component does not need to know how authentication headers, retry behavior, or error normalization work.

---

# 12. GraphQL Architecture

Global GraphQL infrastructure:

```text
infrastructure/
└── api/
    └── graphql/
        ├── client/
        ├── links/
        ├── cache/
        ├── errors/
        ├── scalars/
        └── config/
```

Feature GraphQL operations:

```text
features/
└── users/
    └── api/
        └── graphql/
            ├── queries/
            ├── mutations/
            ├── fragments/
            ├── subscriptions/
            └── generated/
```

These directories should be created only when GraphQL is used by the feature.

---

# 13. GraphQL Client Boundary

Apollo Client is a strong choice when the application needs:

- normalized GraphQL caching
- queries and mutations
- subscriptions
- link middleware
- cache policies
- authentication integration
- GraphQL-specific error handling

Keep Apollo-specific implementation under:

```text
infrastructure/api/graphql/
```

Avoid importing the configured Apollo client throughout arbitrary components.

Prefer feature hooks and feature GraphQL operations.

This makes it easier to:

- test features
- replace the GraphQL client
- modify authentication
- modify cache policy
- centralize error behavior

---

# 14. GraphQL Operation Organization

Feature-local organization:

```text
features/
└── users/
    └── api/
        └── graphql/
            ├── queries/
            ├── mutations/
            ├── fragments/
            ├── subscriptions/
            └── generated/
```

Rules:

- Keep operations close to the owning feature.
- Reuse fragments only when they represent a stable shared selection.
- Avoid one giant application-wide queries directory.
- Avoid huge GraphQL documents containing unrelated operations.
- Name operations clearly.
- Prefer generated TypeScript types from the GraphQL schema/operations.
- Generated files should not be manually edited.

---

# 15. GraphQL Code Generation

For medium/large GraphQL applications, use GraphQL Code Generator or an equivalent schema-based generation workflow.

Recommended generated concerns:

- operation result types
- variables types
- typed documents
- scalar mappings

Conceptual structure:

```text
graphql/
├── queries/
├── mutations/
├── fragments/
└── generated/
```

Generated code remains separate from handwritten code.

---

# 16. GraphQL Cache Rules

GraphQL caching should be intentional.

Define cache behavior for:

- entity identifiers
- pagination
- list merging
- mutation updates
- invalidation/refetching
- authentication changes

Do not manually manipulate the cache everywhere.

Centralize reusable cache policies in:

```text
infrastructure/api/graphql/cache/
```

Clear or reset user-specific cached data when authentication identity changes.

---

# 17. REST + GraphQL Together

The architecture supports both.

Example:

```text
features/
└── dashboard/
    └── api/
        ├── rest/
        └── graphql/
```

Use the protocol that best fits the backend capability.

The UI should not care whether data came from REST or GraphQL.

Preferred abstraction:

```text
Component
   ↓
Feature Hook
   ↓
Feature Data Layer
   ↓
REST or GraphQL
```

Do not create an unnecessary universal abstraction that hides every possible difference between REST and GraphQL.

---

# 18. Server State

Server state should not be treated like ordinary UI state.

Examples:

- users
- orders
- settings loaded from backend
- reports
- API results
- GraphQL query results

For REST, TanStack Query is a strong default for server-state concerns such as:

- caching
- stale data
- retries
- refetching
- mutations
- request deduplication
- loading/error states

For GraphQL, Apollo Client can own GraphQL server state and normalized caching.

Avoid unnecessarily placing fetched server data into Redux/Zustand/Context.

---

# 19. Client State

Client state examples:

- sidebar open/closed
- currently selected tab
- modal visibility
- temporary wizard progress
- UI preferences
- unsaved local state

Keep state local whenever possible.

Use a global store only when multiple distant parts of the application truly need the same client-side state.

Possible organization:

```text
state/
├── client/
└── server/
```

Do not create a global store merely because the application is large.

---

# 20. `shared/components/`

Global reusable UI belongs here only after it is needed.

```text
shared/
└── components/
    ├── actions/
    ├── data-display/
    ├── feedback/
    ├── forms/
    ├── layout/
    ├── navigation/
    └── overlays/
```

Potential future components:

```text
actions/
  Button
  IconButton

data-display/
  Table
  Badge
  Card
  Avatar

feedback/
  Alert
  Loader
  Skeleton
  EmptyState
  Toast

forms/
  Input
  Select
  SearchableSelect
  Checkbox
  Radio
  DatePicker
  FormField

layout/
  Container
  Stack
  Grid
  PageHeader

navigation/
  Tabs
  Breadcrumb
  Pagination

overlays/
  Modal
  Dialog
  Drawer
  Tooltip
  Popover
```

**These are locations/categories only. Do not create these components until they are required.**

---

# 21. `layouts/`

Application-level layouts belong here.

Potential layout concepts:

- authenticated application layout
- public layout
- settings layout
- dashboard layout

Do not create layout components until the application requires them.

Layouts should coordinate page structure rather than business logic.

---

# 22. `shared/hooks/`

Only globally reusable React behavior belongs here.

Potential examples:

- debounce behavior
- media query behavior
- local storage abstraction
- outside-click behavior
- previous value behavior

Feature-specific hooks remain inside features.

Do not move a hook into shared simply because two hooks have similar code.

---

# 23. `shared/utils/`

Use for truly generic pure utilities.

Potential categories:

```text
shared/utils/
├── date/
├── string/
├── number/
├── currency/
├── collection/
└── validation/
```

Avoid:

```text
utils.ts
```

with hundreds or thousands of unrelated functions.

Feature-specific utility logic stays with the feature.

---

# 24. Models, DTOs, and Mappers

Do not make UI/domain code depend directly on transport DTOs when the shapes differ meaningfully.

Preferred flow:

```text
REST DTO / GraphQL Result
          ↓
        Mapper
          ↓
Application Model
          ↓
     Component/Hook
```

Feature organization:

```text
feature/
├── models/
├── types/
└── mappers/
```

Use mapping when it provides real separation.

Do not create a mapper just to copy identical properties one-to-one.

---

# 25. Validation

Validation belongs at application boundaries.

Potential schema locations:

```text
features/<feature>/schemas/
shared/schemas/
```

Validate:

- forms
- URL/search parameters
- local/session storage
- REST responses when external/untrusted
- configuration
- third-party integrations

TypeScript types do not provide runtime validation.

Zod or another schema validator can be used where runtime validation is valuable.

---

# 26. Authentication Architecture

Authentication infrastructure:

```text
infrastructure/
└── auth/
```

Feature authentication workflows:

```text
features/
└── authentication/
```

Keep these concerns separate:

```text
infrastructure/auth
  → low-level authentication/session mechanisms

features/authentication
  → login/logout/profile/recovery user experience
```

Preferred browser security model when supported by the backend:

- secure
- HttpOnly
- SameSite cookies

This prevents JavaScript from directly reading session tokens.

If bearer tokens are required, centralize token handling and avoid spreading token access throughout the UI.

---

# 27. Authorization

Authorization rules may exist in:

```text
features/<feature>/permissions/
```

or shared authorization infrastructure when genuinely global.

UI permission checks are for:

- hiding unavailable actions
- disabling actions
- improving UX

The backend remains the security boundary and must enforce permissions independently.

---

# 28. Security Rules

## Never expose secrets

Do not put secrets in frontend source code or public environment variables.

Assume anything shipped to the browser can be inspected.

Never expose:

- private API keys
- database credentials
- private tokens
- signing keys
- service credentials

---

## XSS

Avoid rendering untrusted HTML.

Use `dangerouslySetInnerHTML` only when absolutely necessary and sanitize untrusted content before rendering.

Prefer normal React rendering.

---

## Content Security Policy

Use an appropriate Content Security Policy at the hosting/server layer.

Goals include limiting:

- script sources
- frame sources
- object sources
- unsafe inline execution

CSP is defense-in-depth and does not replace safe coding.

---

## CSRF

When using cookie-based authentication:

- use appropriate SameSite cookies
- use CSRF protection where required by the backend architecture
- configure credentialed requests intentionally

---

## Sensitive storage

Do not store unnecessary sensitive information in:

- localStorage
- sessionStorage
- IndexedDB

Browser storage is accessible to JavaScript running in the origin.

Treat XSS protection as critical.

---

# 29. API Error Architecture

Normalize technical API errors before they reach UI components.

Conceptual flow:

```text
Backend Error
    ↓
REST/GraphQL Infrastructure
    ↓
Normalized Application Error
    ↓
Feature Hook
    ↓
User-friendly UI
```

Potential categories:

- validation
- authentication
- authorization
- not found
- conflict
- rate limit
- server
- network
- timeout
- unknown

Do not expose raw stack traces or sensitive backend details to users.

---

# 30. Loading and Error States

Every asynchronous feature should intentionally consider:

- initial loading
- background loading
- success
- empty state
- validation failure
- request error
- unauthorized
- forbidden
- not found
- offline/network failure
- retry
- partial data where applicable

Avoid one generic spinner for every state.

---

# 31. Error Boundaries

Use React error boundaries for unexpected render/runtime failures at useful application boundaries.

Potential boundaries:

- entire application
- route
- major independently functioning feature

Do not use error boundaries as a replacement for normal API error handling.

---

# 32. Performance Architecture

Performance rules should be evidence-based.

Do not add memoization everywhere.

Focus first on architecture.

---

## Route-level code splitting

Lazy-load large routes/features.

Conceptual structure:

```text
router
  ↓
lazy feature page
  ↓
feature chunk
```

Do not eagerly load every feature on initial application startup.

---

## Large lists

For very large collections, consider:

- pagination
- server-side filtering
- server-side sorting
- infinite loading
- virtualization

Do not render thousands of complex rows when only a small viewport is visible.

---

## Memoization

Use:

- `useMemo`
- `useCallback`
- `React.memo`

only when they prevent meaningful expensive work or rerendering.

Do not use them as default boilerplate.

Keep components and hooks pure so React can optimize safely.

---

## Avoid redundant state

Do not store derived values in state when they can be calculated during render.

Avoid duplicated or contradictory state.

Keep state as simple and flat as practical.

---

## Network optimization

Use:

- caching
- appropriate stale times
- request cancellation
- pagination
- debouncing where useful
- prefetching where it improves UX
- GraphQL selection discipline

Avoid duplicate network requests.

---

# 33. GraphQL Performance

GraphQL-specific optimization:

- request only required fields
- use fragments intentionally
- paginate large collections
- avoid unnecessary refetching
- configure normalized cache identifiers
- define pagination merge policies
- avoid giant queries that fetch unrelated screens
- lazy-load feature queries with their features where practical

Performance is not achieved by simply using GraphQL; operation design and caching matter.

---

# 34. REST Performance

REST-specific optimization:

- query-key consistency
- appropriate stale times
- cancellation
- pagination
- cache invalidation after mutations
- selective retries
- prefetch only when useful

Keep query keys centralized or predictable for complex features.

---

# 35. Images and Assets

Use:

```text
assets/
├── fonts/
├── icons/
└── images/
```

For performance:

- use appropriate image formats
- avoid oversized images
- lazy load non-critical imagery
- optimize SVG usage
- avoid bundling unused assets

Do not use the assets folder as a dumping ground.

---

# 36. Styling Architecture

```text
styles/
├── tokens/
├── global/
└── themes/
```

Keep reusable design values centralized:

- spacing
- typography
- colors
- breakpoints
- radius
- shadows
- z-index conventions

Prefer a consistent design system over one-off styling.

Feature styles should remain near the feature when they are feature-specific.

---

# 37. Localization

```text
locales/
```

Do not hard-code user-facing strings in components when localization is enabled.

Support the application's configured languages.

For the current project requirements, ensure new user-facing text can be translated into at least:

- English
- French

Keep translation keys meaningful and organized by feature/domain.

---

# 38. Accessibility

Accessibility is part of component quality, not a later add-on.

When components are implemented:

- use semantic HTML
- support keyboard navigation
- associate labels with controls
- manage modal/dialog focus
- preserve visible focus indicators
- provide accessible error messages
- use ARIA only when semantic HTML is insufficient
- maintain adequate color contrast

Reusable UI components should make the accessible behavior the default behavior.

---

# 39. Testing Architecture

```text
test/
├── fixtures/
├── mocks/
├── setup/
└── utils/
```

Feature-specific tests:

```text
features/<feature>/tests/
```

Tests should be close to the behavior they verify.

Recommended layers:

```text
Unit
  ↓
Component
  ↓
Integration
  ↓
End-to-end for critical flows
```

---

# 40. Unit Tests

Use for:

- pure utilities
- validation
- mappers
- permission logic
- business rules
- non-UI calculations

---

# 41. Component Tests

Test visible behavior.

Prefer testing:

- what the user sees
- what the user can click/type/select
- validation messages
- accessible roles
- loading/error states

Avoid testing internal implementation details.

---

# 42. Integration Tests

Use for meaningful feature workflows.

Examples:

- login
- create/update user
- settings changes
- permission-controlled actions
- REST/GraphQL integration behavior

Mock at sensible boundaries, not every internal function.

---

# 43. API Mocking

For frontend integration tests, a network-level mock such as MSW can keep tests closer to real application behavior.

Keep reusable handlers under:

```text
test/mocks/
```

Feature-specific fixture data may live with the feature.

---

# 44. Observability

```text
infrastructure/
├── logging/
├── monitoring/
└── telemetry/
```

Centralize:

- structured logging
- frontend exception reporting
- performance monitoring
- trace/correlation IDs where applicable

Never log:

- passwords
- session tokens
- authorization headers
- secret values
- unnecessary sensitive user data

---

# 45. Storage Abstraction

```text
infrastructure/
└── storage/
```

Use this when the application requires controlled access to:

- localStorage
- sessionStorage
- IndexedDB

Do not access browser storage randomly throughout features.

A storage abstraction makes:

- key naming
- serialization
- validation
- migration
- cleanup
- testing

more consistent.

Do not store secrets just because a storage abstraction exists.

---

# 46. Caching

```text
infrastructure/
└── cache/
```

Use only for application-level caching concerns not already handled cleanly by:

- TanStack Query
- Apollo Client
- the browser
- service worker infrastructure

Do not create duplicate cache layers without a clear reason.

---

# 47. Public Feature API

A feature may expose a small public API from its root when useful.

Other modules should avoid importing deeply into another feature's private internals.

Conceptually prefer:

```text
features/users
```

over:

```text
features/users/components/internal/something/deep
```

Use barrel files intentionally, not everywhere.

Avoid barrels that create hidden circular dependencies.

---

# 48. File Naming

Recommended conventions:

```text
PascalCase.tsx
  React components when implemented

camelCase.ts
  hooks or functions where consistent with project conventions

*.types.ts
*.schema.ts
*.mapper.ts
*.constants.ts
*.utils.ts
*.test.ts
*.test.tsx
```

Be consistent with the existing repository.

Do not rename an entire existing project simply to enforce a preferred naming style.

---

# 49. Size Guidelines

These are review signals, not hard limits.

```text
React component file:
target <= 200 lines

General TypeScript/JavaScript file:
target <= 250 lines

Custom hook:
target <= 150 lines

Service/class:
target <= 200-250 lines

Function/method:
target <= 30-40 lines

React component function:
target <= 100-120 lines

Review a file:
300+ lines

Strong refactor signal:
500+ lines
```

Do not split cohesive code only to satisfy a number.

Refactor based on responsibility and readability.

---

# 50. Refactoring Signals

Consider splitting code when a file contains:

- unrelated responsibilities
- repeated logic
- many effects
- excessive local state
- many event handlers
- deeply nested rendering
- API infrastructure mixed into presentation
- validation mixed throughout rendering
- complex business rules inside JSX
- permission logic duplicated in multiple places

---

# 51. Dependency Management

Before adding a package:

1. Check whether the project already has a solution.
2. Confirm the package solves a meaningful problem.
3. Check maintenance/activity.
4. Check security history.
5. Check bundle impact.
6. Check licensing.
7. Avoid packages for trivial utilities.

Keep major infrastructure dependencies intentional.

---

# 52. Configuration

Application configuration should be centralized.

Potential structure:

```text
app/config/
```

Validate required environment values during startup.

Avoid scattering:

```text
import.meta.env...
```

through unrelated feature components.

Never treat frontend environment variables as secrets.

---

# 53. React Rules

When components are implemented:

- use functional components
- keep render logic pure
- do not mutate props/state/context
- prefer event handlers for user-driven side effects
- use effects for synchronization with external systems
- avoid unnecessary effects
- clean up subscriptions/timers/listeners
- avoid redundant state
- keep state near its owner
- use stable list keys
- handle async UI states explicitly
- prefer composition
- avoid deeply nested JSX
- avoid premature memoization

---

# 54. Reusability Decision

Before creating new code, check for an existing:

- component
- hook
- utility
- type
- schema
- mapper
- API operation
- constant
- permission
- design-system primitive

But do not force reuse when two things only look superficially similar.

Good reuse reduces meaningful duplication.

Bad reuse creates complicated configuration and hidden coupling.

---

# 55. Reusable Component Promotion Rule

A practical approach:

### First use

Keep the component inside the feature.

### Second genuine use

Evaluate whether the component represents the same concept.

### Cross-feature reuse

If it has no feature-specific business logic, consider promoting it into `shared/components`.

Do not automatically apply "used twice = shared".

Use engineering judgment.

---

# 56. Component Dependency Rule

A globally reusable component should normally depend on:

```text
React
shared types
design tokens
shared hooks/utilities
```

It should generally not depend directly on:

```text
feature APIs
feature state
feature permissions
feature models
specific business workflows
```

Pass data and callbacks through a clear typed API.

---

# 57. Recommended Data Flow

```text
              ┌──────────────────┐
              │      Router      │
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │       Page       │
              └────────┬─────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
 ┌────────▼────────┐       ┌────────▼────────┐
 │ Feature Hook    │       │ UI Components   │
 └────────┬────────┘       └─────────────────┘
          │
 ┌────────▼────────┐
 │ Feature API     │
 └────────┬────────┘
          │
   ┌──────┴───────┐
   │              │
┌──▼────┐    ┌────▼──────┐
│ REST  │    │ GraphQL   │
│Client │    │ Client    │
└──┬────┘    └────┬──────┘
   │              │
   └──────┬───────┘
          │
   ┌──────▼──────┐
   │ Backend(s)  │
   └─────────────┘
```

---

# 58. Recommended Request Flow

REST:

```text
Page
 ↓
Feature Hook
 ↓
TanStack Query
 ↓
Feature REST Function
 ↓
REST Client
 ↓
Backend
```

GraphQL:

```text
Page
 ↓
Feature Hook
 ↓
Apollo Query/Mutation
 ↓
Feature GraphQL Document
 ↓
Apollo Links
 ↓
GraphQL API
```

---

# 59. Suggested Technology Responsibilities

This architecture does not require every tool below, but a common production setup is:

```text
React
  UI

TypeScript
  static type safety

React Router
  SPA routing

TanStack Query
  REST server-state management

Apollo Client
  GraphQL networking + normalized cache

GraphQL Code Generator
  GraphQL type generation

React Hook Form
  complex form state

Zod
  runtime validation

Testing Library
  component behavior testing

Vitest
  unit/component test runner for Vite projects

MSW
  network-level test mocking
```

Choose packages based on actual requirements rather than installing everything upfront.

---

# 60. What Should NOT Be Created Upfront

Do not create empty implementations for:

- Button
- Input
- Select
- Modal
- Toast
- Table
- Pagination
- Loader
- Card
- Layouts
- feature hooks
- feature services
- API operations
- GraphQL queries
- state stores
- providers

Create the directory structure and architectural documentation first.

Implement something when a feature requires it.

This prevents speculative abstractions.

---

# 61. Minimal Initial Structure

If the application is still early, start with this rather than creating every possible directory:

```text
src/
├── app/
│   ├── config/
│   ├── providers/
│   └── router/
│
├── features/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── infrastructure/
│   └── api/
│       ├── rest/
│       └── graphql/
│
├── locales/
├── assets/
├── styles/
├── test/
└── main.tsx
```

Then expand feature folders only as implementation requires them.

This is the preferred approach.

---

# 62. Example Growth

When a `settings` feature is implemented:

```text
features/
└── settings/
    ├── api/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── types/
    └── schemas/
```

If settings later uses GraphQL:

```text
settings/
└── api/
    └── graphql/
        ├── queries/
        └── mutations/
```

If it uses REST instead:

```text
settings/
└── api/
    └── rest/
```

Do not create both unless both are used.

---

# 63. Architecture Review Checklist

Before adding new code, ask:

```text
□ Which feature owns this?

□ Is it genuinely global/shared?

□ Does something equivalent already exist?

□ Is this UI, business logic, infrastructure, or data access?

□ Should this state be local, server state, or global client state?

□ Is an Effect actually necessary?

□ Is the component coupled directly to REST/GraphQL?

□ Is runtime validation needed at this boundary?

□ Is authorization enforced server-side?

□ Am I introducing a dependency for a real reason?

□ Could this create a circular dependency?

□ Does the implementation preserve feature boundaries?

□ Does user-facing text use localization?

□ Are loading/error/empty states considered?

□ Is accessibility considered?

□ Is the change testable?
```

---

# 64. Rules for AI Coding Agents

When an AI agent works in this repository:

1. Inspect the existing project before creating files.
2. Follow existing architecture unless explicitly asked to change it.
3. Determine the owning feature before implementing code.
4. Search for reusable code before creating new code.
5. Do not create speculative reusable components.
6. Do not create empty component files just because they appear in this architecture.
7. Keep feature code inside the feature.
8. Promote code to shared only when it is genuinely cross-feature.
9. Keep REST/GraphQL infrastructure outside presentation components.
10. Prefer feature hooks as the UI-facing data boundary.
11. Do not add new packages without a clear need.
12. Preserve existing behavior unless change is required.
13. Keep changes focused.
14. Avoid unrelated refactoring.
15. Use strict TypeScript.
16. Avoid `any`.
17. Do not hard-code user-facing strings when localization is enabled.
18. Never expose secrets.
19. Add tests appropriate to the change.
20. Run type checking, linting, and relevant tests before considering the task complete.

---

# 65. Final Architectural Rule

The architecture should grow with the application.

Do not build every abstraction on day one.

Use this progression:

```text
Implement feature
      ↓
Keep code feature-local
      ↓
Observe real duplication
      ↓
Extract reusable behavior
      ↓
Promote truly global pieces
      ↓
Keep dependencies one-directional
```

The goal is not to have the most folders.

The goal is to make the location, ownership, dependencies, and responsibilities of code obvious.
