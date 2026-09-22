# AI Agent Implementation Guide — Responsive Sidebar & Top Navbar

## Goal

Recreate the **sidebar** and **top navigation bar** from the provided Fleet Operations dashboard reference image inside the existing React application.

The result should feel like a polished enterprise IoT / operations dashboard, while still following the application's **existing React architecture, SCSS architecture, coding rules, reusable component patterns, routing, icons, and naming conventions**.

Do **not** copy the entire dashboard in the image. This task is only for:

- Left sidebar
- Top navbar / header
- Responsive shell behavior
- Reusable navigation components required by those areas

---

## Reference Image Analysis

The reference uses a modern enterprise dashboard layout with:

### Sidebar

- Fixed left-side navigation
- Deep blue background
- Brand/logo at the top
- Primary navigation items stacked vertically
- White text/icons
- Active item shown with a brighter blue rounded background
- Small badge on items such as **Alerts**
- Expand/collapse indicators on items that can contain children
- Comfortable vertical spacing
- Rounded interactive states
- Clean enterprise styling
- Sidebar stays visually separate from the main workspace
- Desktop sidebar is approximately `190–220px` wide

Reference navigation structure:

1. Overview
2. Fleet
3. Gateways
4. Sensors
5. Topology
6. Alerts
7. Organizations
8. Diagnostics
9. Firmware
10. Analytics
11. Settings

The image contains the **MULTITECH mCloud** branding at the top. In our implementation, use the project’s existing logo/branding asset if one already exists.

Do not hardcode an image logo when an existing reusable logo component or asset is already available.

---

### Top Navbar

The navbar is positioned to the right of the sidebar and contains three logical groups.

#### Left section

- Organization selector
- Site selector
- Environment / status selector

Examples from the image:

- Global Operations
- All Sites
- Production

These should look like compact pill/dropdown controls.

#### Center section

- Large global search field
- Search icon
- Placeholder text similar to:
  `Search devices, gateways, sensors, sites, or organizations...`
- Optional keyboard shortcut indicator such as `Ctrl + K`

#### Right section

- Notification icon
- Help icon
- User avatar / initials
- User name
- User role
- Dropdown chevron

The header uses a very light blue/white background with a subtle divider/shadow.

---

# Implementation Requirements

## 1. First inspect the existing application

Before writing code, inspect the current project and identify:

- Existing React folder structure
- Existing layout components
- Existing router configuration
- Existing SCSS architecture
- Existing design tokens
- Existing variables
- Existing mixins
- Existing icon library
- Existing Button component
- Existing Dropdown / Select component
- Existing Avatar component
- Existing Badge component
- Existing Tooltip component
- Existing Search/Input component
- Existing logo assets
- Existing authentication/user context
- Existing responsive breakpoints

### Important

**Reuse existing components whenever possible.**

Do not create duplicate components if the same responsibility already exists.

If a component is missing and is genuinely reusable, create it in the correct shared/global location according to the project architecture.

---

# 2. Recommended Component Structure

Adapt the structure to the existing architecture instead of blindly creating new folders.

A possible structure is:

```text
src/
├── components/
│   ├── navigation/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarNavItem.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── TopNavbar/
│   │       ├── TopNavbar.tsx
│   │       ├── NavbarSelector.tsx
│   │       └── index.ts
│   │
│   └── layout/
│       └── AppShell/
│           ├── AppShell.tsx
│           └── index.ts
│
├── config/
│   └── navigation.ts
│
└── styles/
    └── ...
```

If the project already has folders such as:

```text
shared/
common/
ui/
layouts/
features/
core/
```

follow the project's existing convention.

---

# 3. Sidebar Requirements

Create the sidebar as a reusable navigation component.

## Desktop

The sidebar should:

- Be fixed/sticky on the left
- Fill the viewport height
- Use a deep blue gradient or deep blue background
- Have a width around `200px`
- Keep the logo at the top
- Scroll internally if the navigation exceeds the viewport height
- Keep the main page content independent from sidebar scrolling

Suggested visual direction:

```scss
background:
  linear-gradient(
    180deg,
    #0757b8 0%,
    #064ea9 45%,
    #034590 100%
  );
```

Do not hardcode these exact colors if the application already has design tokens.

---

## Sidebar Navigation Item

Each item should support:

```ts
interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon: ReactNode;
  badge?: number | string;
  children?: NavigationItem[];
  disabled?: boolean;
}
```

Navigation configuration should live in a separate configuration file.

Example:

```ts
export const mainNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/overview',
    icon: OverviewIcon,
  },
  {
    id: 'fleet',
    label: 'Fleet',
    path: '/fleet',
    icon: FleetIcon,
  },
  {
    id: 'gateways',
    label: 'Gateways',
    path: '/gateways',
    icon: GatewayIcon,
    children: [],
  },
  {
    id: 'alerts',
    label: 'Alerts',
    path: '/alerts',
    icon: AlertIcon,
    badge: 23,
  },
];
```

Do not place the full menu directly inside the JSX.

---

## Sidebar Item States

Support the following states:

### Default

- Transparent background
- White or slightly muted-white label
- White icon with slightly reduced opacity

### Hover

- Slightly lighter blue background
- Smooth transition
- Icon/text should become full white

### Active

Use a brighter blue rounded surface similar to the image.

Example visual behavior:

```text
┌──────────────────────┐
│  ◉  Overview         │
└──────────────────────┘
```

Suggested characteristics:

- Border radius: `8–10px`
- Height: `42–46px`
- Stronger contrast than other items
- No heavy border
- Subtle glow/shadow only if it matches the existing design system

The active route must come from the router instead of manually setting the item.

---

## Icon Styling

Use the icon library already installed in the project.

Do not mix several icon libraries.

Preferred icon size:

```text
18px – 20px
```

Use a consistent stroke width.

---

## Alert Badge

Example:

```text
Alerts                           23
```

The badge should:

- Use a red background
- Use white text
- Use a small rounded pill
- Have a minimum width for one/two-digit values
- Be right-aligned

Use the project's Badge component if available.

---

## Expandable Navigation

Items such as `Gateways` may support nested items.

Requirements:

- Chevron aligned right
- Chevron rotates when expanded
- Smooth height/opacity animation
- `aria-expanded`
- Keyboard accessible
- Do not navigate when clicking only the expand control

---

# 4. Top Navbar Requirements

The navbar should be part of the reusable application shell.

Suggested desktop layout:

```text
┌────────────────────────────────────────────────────────────────────┐
│ Org Selector | Site Selector | Environment | Search | Icons | User │
└────────────────────────────────────────────────────────────────────┘
```

Use CSS Grid or Flexbox.

Do not position individual items with absolute pixel coordinates.

---

# 5. Navbar Selector

Create/reuse a compact reusable selector for:

- Organization
- Site
- Environment

Example:

```text
🌐 Global Operations  ˅
```

Properties may include:

```ts
interface NavbarSelectorProps {
  icon?: ReactNode;
  label: string;
  value: string;
  options?: SelectOption[];
  variant?: 'default' | 'success';
  disabled?: boolean;
  onChange?: (value: string) => void;
}
```

If API data is not available yet:

- use temporary static values
- keep the UI API-ready
- isolate the mock data from the component

Do not implement unnecessary backend calls.

---

# 6. Environment Indicator

The reference shows:

```text
● Production
```

Render this as a compact green status pill.

Requirements:

- Green dot
- Green-tinted background
- Accessible label
- Do not use color as the only status indicator

Possible future statuses:

```ts
type EnvironmentStatus =
  | 'production'
  | 'staging'
  | 'development';
```

---

# 7. Global Search

Create/reuse a search input in the center of the navbar.

Desktop appearance:

```text
🔍 Search devices, gateways, sensors, sites, or organizations...    Ctrl + K
```

Requirements:

- Search icon on the left
- Placeholder
- Clear focus style
- Rounded input
- Subtle border
- Keyboard shortcut badge
- Responsive width
- `aria-label="Global search"`

### Keyboard Shortcut

If no global search logic exists yet:

- support focus using `Ctrl + K`
- also support `Cmd + K` for macOS
- prevent browser default only when focusing this search
- do not implement search backend functionality yet

---

# 8. Navbar Action Icons

The right section should support:

- Notifications
- Help
- User profile

Icons should use reusable icon buttons.

Example:

```text
🔔   ?   [JD] Jessica Davis ˅
```

Icon buttons must have:

- Tooltip
- Accessible label
- Hover state
- Focus-visible state
- Minimum touch target around `40px`

---

# 9. Notification Indicator

Support a notification badge.

Example:

```text
 🔔
  1
```

The badge should be positioned without breaking the icon alignment.

If no notification API exists, use mock data in configuration/state and clearly mark it for replacement.

---

# 10. User Profile Area

Desktop:

```text
[JD]  Jessica Davis
      Super Admin      ˅
```

Requirements:

- Circular avatar
- Initials fallback
- User display name
- Role beneath name
- Chevron
- Reusable dropdown trigger
- Keyboard accessible

If the application already contains authenticated user information, read it from the existing auth/user context.

Do not duplicate user state.

---

# 11. Responsive Behavior

The implementation must work well on:

- Desktop
- Laptop
- Tablet
- Mobile

---

## Large Desktop

Suggested:

```text
Sidebar: ~200px
Navbar height: 56–64px
```

All controls visible.

---

## Medium / Tablet

At tablet widths:

- Sidebar should collapse to icon-only mode OR become a drawer
- Prefer the application's existing responsive navigation pattern if one exists
- Search field may become narrower
- Hide secondary user role text if needed
- Keep important navbar controls visible

Recommended priority:

```text
Menu | Search | Notifications | Profile
```

---

## Mobile

Use an off-canvas sidebar/drawer.

Example:

```text
☰   Logo                   🔔   [JD]
────────────────────────────────────
🔍 Search...
```

Requirements:

- Hamburger button opens sidebar drawer
- Drawer uses overlay
- Escape closes drawer
- Clicking overlay closes drawer
- Route selection closes drawer
- Focus should not disappear behind the drawer
- Body scrolling should be controlled while drawer is open
- Touch targets should be at least `44px`

Do not squeeze the full desktop sidebar into the mobile viewport.

---

# 12. App Shell

The sidebar and navbar should work through one reusable layout shell.

Example:

```tsx
<AppShell>
  <Outlet />
</AppShell>
```

Conceptual layout:

```text
┌─────────────┬──────────────────────────────┐
│             │ Top Navbar                   │
│  Sidebar    ├──────────────────────────────┤
│             │                              │
│             │ Main Page Content            │
│             │                              │
└─────────────┴──────────────────────────────┘
```

The shell should manage:

- Desktop sidebar
- Mobile sidebar state
- Navbar
- Main content offset
- Responsive behavior

Page-level components should not know sidebar dimensions.

---

# 13. Styling Rules

Follow the existing SCSS architecture.

Prefer:

- design tokens
- variables
- mixins
- CSS custom properties
- shared spacing scale
- shared breakpoints

Avoid:

- large inline style objects
- duplicated hex colors
- unexplained magic numbers
- `!important`
- global element overrides
- deeply nested SCSS

Recommended nesting depth:

```text
Maximum 3 levels
```

---

# 14. Suggested Design Tokens

Only add these if equivalent tokens do not already exist.

```scss
:root {
  --sidebar-width: 208px;
  --sidebar-collapsed-width: 72px;

  --navbar-height: 60px;

  --sidebar-bg-start: #0757b8;
  --sidebar-bg-end: #034590;
  --sidebar-text: #ffffff;
  --sidebar-text-muted: rgba(255, 255, 255, 0.82);
  --sidebar-item-hover: rgba(255, 255, 255, 0.10);
  --sidebar-item-active: #0b8cf0;

  --navbar-bg: #f7fbff;
  --navbar-border: #dfeaf5;

  --status-success-bg: #daf5e5;
  --status-success-text: #16854b;

  --notification-danger: #ef2c2c;
}
```

If the project already has theme tokens, map the design to those tokens instead.

---

# 15. Accessibility

The implementation must meet normal accessibility expectations.

Include:

- Semantic `<nav>`
- `aria-label`
- `aria-current="page"` for active route
- `aria-expanded` for expandable navigation
- Keyboard navigation
- Visible focus state
- Buttons should be actual `<button>` elements
- Links should be actual router links
- Tooltips for icon-only controls
- Sufficient color contrast

Do not use clickable `<div>` elements.

---

# 16. Performance

Do not over-engineer this component.

Recommended:

- Navigation config outside render
- Memoize only where it has measurable value
- Avoid unnecessary state
- Avoid recreating large arrays
- Lazy-load complex menu content only if needed
- Use CSS transitions instead of JS animations where possible

Do not add a heavy component library only for the sidebar/navbar.

---

# 17. Security / Data Rules

Navigation UI must not be treated as authorization.

If certain routes are permission-based:

- Use the application's existing permission system
- Hide/disable unavailable navigation where appropriate
- Backend must still enforce authorization

Never rely only on menu visibility for security.

---

# 18. Code Quality Rules

Follow these rules while implementing:

- TypeScript only if the project is TypeScript
- Avoid `any`
- Keep components focused
- Extract repeated logic
- Reuse shared UI components
- Avoid duplicated constants
- Avoid unnecessary props
- Keep data/config separate from presentation

Recommended limits:

```text
React component file: ideally <= 250 lines
Reusable UI component: ideally <= 150 lines
Function: ideally <= 40–50 lines
```

If a component grows beyond these ranges, split it by responsibility.

Do not split files only to satisfy a number.

---

# 19. Suggested Component Responsibilities

## `AppShell`

Responsible for:

- Layout composition
- Responsive sidebar state
- Main content layout

Should NOT contain navigation item definitions.

---

## `Sidebar`

Responsible for:

- Rendering navigation
- Desktop/mobile presentation
- Expanded groups

Should NOT contain route-specific page logic.

---

## `SidebarNavItem`

Responsible for:

- Icon
- Label
- Active state
- Badge
- Expand state
- Nested items

---

## `TopNavbar`

Responsible for:

- Organization selector
- Site selector
- Environment
- Global search
- Action icons
- Profile trigger

---

## `NavbarSelector`

Responsible for:

- Compact selector presentation
- Opening/selecting options

---

# 20. Suggested Navigation Configuration

Example only:

```ts
export const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/overview',
    icon: 'overview',
  },
  {
    id: 'fleet',
    label: 'Fleet',
    path: '/fleet',
    icon: 'fleet',
  },
  {
    id: 'gateways',
    label: 'Gateways',
    path: '/gateways',
    icon: 'gateway',
  },
  {
    id: 'sensors',
    label: 'Sensors',
    path: '/sensors',
    icon: 'sensor',
  },
  {
    id: 'topology',
    label: 'Topology',
    path: '/topology',
    icon: 'topology',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    path: '/alerts',
    icon: 'alert',
    badge: 23,
  },
  {
    id: 'organizations',
    label: 'Organizations',
    path: '/organizations',
    icon: 'organization',
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics',
    path: '/diagnostics',
    icon: 'diagnostics',
  },
  {
    id: 'firmware',
    label: 'Firmware',
    path: '/firmware',
    icon: 'firmware',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'settings',
  },
];
```

Replace icon strings with the application's actual icon mechanism.

---

# 21. Desktop Visual Target

Aim for a clean structure similar to:

```text
┌────────────────────┬──────────────────────────────────────────────────────────────┐
│ MULTITECH          │ 🌐 Global Operations  All Sites  ● Production   Search...   │
│ mCloud             │                                              🔔  ?  JD User │
│                    ├──────────────────────────────────────────────────────────────┤
│ ▣ Overview         │                                                              │
│ 🚚 Fleet           │                                                              │
│ ◫ Gateways       ˅ │                    PAGE CONTENT                              │
│ ◉ Sensors          │                                                              │
│ ◇ Topology         │                                                              │
│ ⚠ Alerts       23  │                                                              │
│ ▦ Organizations    │                                                              │
│ ⤴ Diagnostics      │                                                              │
│ ⚙ Firmware         │                                                              │
│ ▥ Analytics        │                                                              │
│ ⚙ Settings         │                                                              │
└────────────────────┴──────────────────────────────────────────────────────────────┘
```

Use actual application icons instead of emoji.

---

# 22. Visual Quality Expectations

The final UI must not look like a basic default admin template.

Pay attention to:

- Consistent spacing
- Alignment
- Icon sizing
- Active state
- Border radius
- Typography hierarchy
- Focus states
- Hover states
- Badge placement
- Search proportions
- Vertical centering
- Responsive transitions

Avoid excessive dark styling.

The screenshot uses a strong blue sidebar, but the navbar and main workspace are intentionally light. Preserve that contrast so the application does not feel overly dark.

---

# 23. Do Not Implement Yet

Unless already supported by the application, do not implement:

- Real organization API
- Real site API
- Real notification API
- Real search API
- Help center backend
- User profile editing
- Logout backend
- Permission backend

Build the UI and integration points so these can be connected later.

---

# 24. Testing Expectations

Add tests only if the project already has a testing setup.

At minimum verify:

### Sidebar

- Navigation renders
- Active route is highlighted
- Badge renders
- Expandable item opens/closes
- Clicking navigation changes route

### Navbar

- Selectors render
- Search receives focus on `Ctrl/Cmd + K`
- Notification button is accessible
- Profile trigger is keyboard accessible

### Mobile

- Menu opens
- Menu closes
- Overlay closes drawer
- Route navigation closes drawer

---

# 25. Final AI Agent Workflow

The AI coding agent should follow this exact sequence:

1. Inspect the existing React architecture.
2. Inspect the existing SCSS architecture.
3. Identify existing reusable components.
4. Identify the router.
5. Identify the icon library.
6. Identify the logo/branding asset.
7. Identify existing auth/user state.
8. Plan which files need to be changed.
9. Reuse existing components before creating new ones.
10. Implement the AppShell if one does not already exist.
11. Implement/refactor the sidebar.
12. Implement/refactor the top navbar.
13. Add navigation configuration.
14. Implement responsive behavior.
15. Add accessibility attributes.
16. Run TypeScript/lint/build checks.
17. Fix all errors caused by the changes.
18. Review the final visual result against the reference image.
19. Do not modify unrelated pages or business logic.
20. Provide a concise summary of changed files.

---

# 26. Final Prompt for the AI Coding Agent

Use the following prompt with the coding agent after placing this file in the repository:

> Read this entire specification before making changes.
>
> Analyze the existing React project architecture, styling architecture, routing, design tokens, reusable components, and installed dependencies first.
>
> Then recreate the **left sidebar and top navbar** based on the supplied dashboard reference image.
>
> Do not recreate the dashboard content.
>
> Follow the project's existing architecture and SCSS conventions. Reuse existing components and styling utilities wherever possible. Do not create duplicate Button, Dropdown, Avatar, Badge, Input, Tooltip, or IconButton components when suitable reusable components already exist.
>
> The sidebar must include the navigation structure described in this specification, route-aware active states, icons, badges, expandable-item support, and responsive mobile drawer behavior.
>
> The top navbar must include organization/site selectors, a Production status indicator, responsive global search, notification/help actions, and a user profile trigger.
>
> Use mock/static values only where backend data is not yet connected, and keep those values outside presentation components.
>
> Make the UI responsive across desktop, tablet, and mobile. Preserve accessibility, keyboard navigation, visible focus states, semantic elements, and appropriate ARIA attributes.
>
> Do not introduce a new UI framework. Do not change unrelated features. Do not hardcode styling that should come from existing tokens.
>
> After implementation, run the available lint, TypeScript, test, and build commands and resolve problems caused by the changes.
>
> Finally, report:
> - files created
> - files modified
> - reusable components reused
> - any new reusable components added
> - responsive behavior implemented
> - any mock data that still needs API integration

---

# 27. Acceptance Criteria

The work is complete when:

- Sidebar visually resembles the supplied reference
- Navbar visually resembles the supplied reference
- Branding/logo uses the existing project asset
- Active route is automatically highlighted
- Sidebar works on desktop
- Sidebar works as a mobile drawer
- Navbar adapts cleanly to tablet/mobile
- Search can be focused with `Ctrl/Cmd + K`
- Navigation badges are supported
- Expandable navigation is supported
- No unrelated page functionality is changed
- Existing architecture is respected
- Existing SCSS conventions are respected
- No duplicate shared components are introduced unnecessarily
- No TypeScript/lint/build errors are introduced
- Accessibility basics are implemented
