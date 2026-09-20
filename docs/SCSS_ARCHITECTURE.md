# Reusable SCSS Architecture for React

## Purpose

This guide defines a scalable, reusable, and maintainable SCSS architecture for an existing React application.

The goals are to:

- Keep global styles organized.
- Keep component styles isolated.
- Avoid duplicated CSS.
- Centralize design tokens.
- Support responsive design consistently.
- Support light/dark themes.
- Make styles easy to maintain as the application grows.
- Give AI coding agents clear styling rules to follow.

---

# 1. Recommended Folder Structure

```text
src/
├── assets/
│   └── styles/
│       ├── abstracts/
│       │   ├── _variables.scss
│       │   ├── _functions.scss
│       │   ├── _mixins.scss
│       │   ├── _breakpoints.scss
│       │   └── _index.scss
│       │
│       ├── base/
│       │   ├── _reset.scss
│       │   ├── _typography.scss
│       │   ├── _global.scss
│       │   └── _index.scss
│       │
│       ├── themes/
│       │   ├── _light.scss
│       │   ├── _dark.scss
│       │   └── _index.scss
│       │
│       ├── utilities/
│       │   ├── _spacing.scss
│       │   ├── _display.scss
│       │   ├── _text.scss
│       │   ├── _accessibility.scss
│       │   └── _index.scss
│       │
│       └── main.scss
│
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.scss
│   │
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.module.scss
│   │
│   └── ...
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm/
│   │   │       ├── LoginForm.tsx
│   │   │       └── LoginForm.module.scss
│   │   └── ...
│   │
│   └── settings/
│
└── layouts/
    └── MainLayout/
        ├── MainLayout.tsx
        └── MainLayout.module.scss
```

---

# 2. Core Architecture Rules

## 2.1 Use SCSS Modules for Components

Each reusable component should have its own SCSS module.

```text
Button/
├── Button.tsx
└── Button.module.scss
```

Example:

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

React:

```tsx
import styles from './Button.module.scss';

export function Button() {
  return (
    <button className={styles.button}>
      Save
    </button>
  );
}
```

Do not create one large global `components.scss` file.

Component styles should live next to the component whenever possible.

---

# 3. Design Tokens

Repeated design values must be centralized.

Avoid hard-coded values throughout the application.

## 3.1 Spacing

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

## 3.2 Border Radius

```scss
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;
```

## 3.3 Typography

```scss
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;
```

## 3.4 Transitions

```scss
$transition-fast: 150ms ease;
$transition-normal: 250ms ease;
$transition-slow: 350ms ease;
```

## 3.5 Z-Index

```scss
$z-dropdown: 1000;
$z-sticky: 1100;
$z-modal: 1200;
$z-toast: 1300;
$z-tooltip: 1400;
```

Use named z-index tokens instead of random values such as:

```scss
z-index: 99999;
```

---

# 4. CSS Variables for Theme Values

Use CSS custom properties for values that may change at runtime.

This is especially useful for:

- Colors
- Themes
- User preferences
- Dynamic branding

Example:

```scss
:root {
  --color-primary: #16835e;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #667085;
  --color-border: #e5e7eb;
}
```

Component:

```scss
.card {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

Use:

- CSS variables for runtime theme values.
- SCSS variables for compile-time constants.

---

# 5. Theme Architecture

Example light theme:

```scss
:root,
[data-theme='light'] {
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #667085;
  --color-border: #e5e7eb;
}
```

Example dark theme:

```scss
[data-theme='dark'] {
  --color-background: #101828;
  --color-surface: #1d2939;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d0d5dd;
  --color-border: #344054;
}
```

Components should consume theme variables rather than defining theme-specific colors locally.

---

# 6. Reusable Mixins

Reusable styling logic belongs in `_mixins.scss`.

Example:

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin focus-ring {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

Usage:

```scss
.button {
  @include flex-center;
}
```

Do not copy the same multi-line CSS block into many components.

---

# 7. Responsive Architecture

All breakpoints must be centralized.

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  xxl: 1440px
);
```

Mixin:

```scss
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

Usage:

```scss
.container {
  padding: $spacing-md;

  @include respond-to(lg) {
    padding: $spacing-lg;
  }
}
```

Follow a mobile-first approach.

Avoid random breakpoints such as:

```text
742px
790px
815px
1035px
```

unless a specific design requirement genuinely requires one.

---

# 8. SCSS Index Files

Use `@forward` to expose reusable SCSS modules.

Example:

```scss
// abstracts/_index.scss

@forward 'variables';
@forward 'functions';
@forward 'mixins';
@forward 'breakpoints';
```

Then components can use:

```scss
@use '@/assets/styles/abstracts' as *;
```

instead of importing many files individually.

---

# 9. Global Entry File

Keep `main.scss` small.

```scss
@use './base';
@use './themes';
@use './utilities';
```

Import it once from the React application entry point.

For example:

```tsx
import '@/assets/styles/main.scss';
```

Do not repeatedly import global SCSS files inside individual components.

---

# 10. Base Styles

The `base` folder contains application-wide defaults.

Example:

```text
base/
├── _reset.scss
├── _typography.scss
├── _global.scss
└── _index.scss
```

Typical responsibilities:

### `_reset.scss`

- Box sizing
- Browser normalization
- Default margins
- Image behavior
- Button/input font inheritance

### `_typography.scss`

- Body typography
- Heading defaults
- Paragraph defaults
- Links

### `_global.scss`

- Body background
- Root application styles
- Shared application behavior

Avoid placing component-specific styles here.

---

# 11. Utility Classes

Utility classes should only represent genuinely global behavior.

Examples:

```scss
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.textCenter {
  text-align: center;
}

.hidden {
  display: none;
}
```

Do not create hundreds of utilities if CSS Modules already handle component styling.

---

# 12. Reusable vs Feature Styles

## Reusable UI

Reusable components belong under shared component directories.

Examples:

```text
components/
├── Button/
├── Modal/
├── Dropdown/
├── Toast/
├── Input/
├── Checkbox/
├── Tabs/
└── Tooltip/
```

Each component owns its SCSS module.

---

## Feature-Specific UI

Styles used only by one feature should stay inside that feature.

Example:

```text
features/
└── settings/
    ├── components/
    │   └── GeneralSettings/
    │       ├── GeneralSettings.tsx
    │       └── GeneralSettings.module.scss
    └── pages/
```

Do not move feature-specific styles into the global styles folder just because they might be used more than once inside that feature.

---

# 13. SCSS Nesting Rules

Keep nesting shallow.

Maximum recommended nesting depth:

```text
3 levels
```

Good:

```scss
.card {
  padding: $spacing-md;

  &__title {
    font-weight: 600;
  }

  &:hover {
    box-shadow: var(--shadow-sm);
  }
}
```

Avoid:

```scss
.page {
  .container {
    .card {
      .header {
        .title {
          span {
          }
        }
      }
    }
  }
}
```

Deep nesting makes CSS harder to override, understand, and maintain.

---

# 14. Selector Rules

Prefer class selectors.

Good:

```scss
.settingsHeader {}
```

Avoid styling application components using IDs:

```scss
#settingsHeader {}
```

Avoid overly broad element selectors:

```scss
div {}
span {}
button {}
```

Global HTML element styling should exist only in base/reset/typography files.

---

# 15. `!important` Rule

Avoid `!important`.

Do not use:

```scss
color: red !important;
```

unless:

- A third-party library cannot reasonably be overridden otherwise.
- The reason is documented.
- There is no cleaner architecture-level solution.

Repeated `!important` usage normally indicates a specificity problem.

---

# 16. File Size Guidelines

Component SCSS files should preferably stay below approximately:

```text
250 lines
```

This is a guideline, not a hard technical limitation.

If a stylesheet becomes difficult to navigate:

- Check whether the component itself is too large.
- Split component responsibilities.
- Extract reusable styles.
- Extract repeated mixins.
- Extract design tokens.
- Remove unused styles.

Do not split files only to satisfy an arbitrary line count.

---

# 17. Naming Rules

Use clear names based on component meaning.

Good:

```scss
.header {}
.title {}
.actions {}
.searchInput {}
.emptyState {}
```

Avoid:

```scss
.box1 {}
.leftThing {}
.newStyle {}
.test {}
.wrapper2 {}
```

For CSS Modules, simple semantic local class names are normally enough because classes are automatically scoped.

---

# 18. Avoid Magic Values

Avoid repeating arbitrary values:

```scss
margin-top: 17px;
padding: 23px;
border-radius: 7px;
```

First check whether the value already exists in the design system.

Prefer:

```scss
margin-top: $spacing-md;
padding: $spacing-lg;
border-radius: $radius-md;
```

A unique value is acceptable when the design genuinely requires it.

---

# 19. Component State Styling

Use clear state naming.

Example:

```scss
.button {
  // base styles
}

.disabled {
  // disabled state
}

.loading {
  // loading state
}

.active {
  // active state
}
```

React:

```tsx
<button
  className={`${styles.button} ${isLoading ? styles.loading : ''}`}
>
  Save
</button>
```

For complex conditional class handling, use an appropriate class name utility such as `clsx` if already available in the project.

---

# 20. Accessibility

Styles must support accessibility.

Always consider:

- Keyboard focus
- Visible focus indicators
- Sufficient color contrast
- Reduced motion
- Screen-reader-only content
- Disabled states
- Hover and focus parity

Example:

```scss
.button {
  &:focus-visible {
    @include focus-ring;
  }
}
```

Reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

# 21. Performance Rules

Avoid unnecessarily expensive selectors.

Avoid:

```scss
.page * {
  ...
}
```

Avoid excessive global CSS.

Prefer component-level SCSS Modules so unused screens do not depend on giant feature stylesheets.

Remove unused styles when components are removed or refactored.

Do not duplicate entire style blocks across files.

---

# 22. Third-Party Library Overrides

Keep third-party overrides isolated.

Example:

```text
styles/
└── vendors/
    ├── _datepicker.scss
    └── _editor.scss
```

Do not scatter library overrides across unrelated component files.

Only introduce a `vendors` directory when the application actually needs third-party style overrides.

---

# 23. Recommended Architecture Flow

```text
React Component
      ↓
SCSS Module
      ↓
Shared SCSS Abstracts
      ↓
Design Tokens
      ↓
Mixins / Functions
      ↓
CSS Theme Variables
```

Recommended technology combination:

```text
React
+
CSS Modules
+
SCSS
+
Design Tokens
+
Reusable Mixins
+
CSS Variables for Themes
```

---

# 24. Rules for AI Coding Agents

When an AI coding agent creates or updates React UI, it must follow these rules:

1. Follow the existing project architecture before introducing new folders.
2. Use `ComponentName.module.scss` for component-specific styling.
3. Do not create global component CSS.
4. Reuse existing design tokens before adding new values.
5. Reuse existing mixins before duplicating CSS logic.
6. Use CSS variables for theme-dependent colors.
7. Do not hard-code repeated colors.
8. Do not introduce arbitrary breakpoints.
9. Follow mobile-first responsive styling.
10. Keep SCSS nesting at three levels or fewer.
11. Avoid `!important`.
12. Avoid ID selectors.
13. Avoid broad global selectors.
14. Keep reusable component styles with the reusable component.
15. Keep feature-only styles inside the feature.
16. Do not create a reusable abstraction until there is a realistic reuse case.
17. Do not create new components only for styling purposes.
18. Preserve existing UI behavior while refactoring styles.
19. Remove unused CSS introduced by previous implementations when safe.
20. Maintain keyboard focus and accessibility states.
21. Do not duplicate existing spacing, typography, color, radius, or breakpoint tokens.
22. Prefer semantic class names.
23. Do not create large shared stylesheet files containing unrelated components.
24. Keep `main.scss` focused on global/base/theme/utility imports.
25. Follow the project's existing path aliases and import conventions.

---

# 25. Implementation Strategy for an Existing React Application

Do not rewrite all existing CSS/SCSS at once.

Migrate incrementally.

Recommended order:

```text
Step 1
Create the styles architecture.

Step 2
Move global variables and common values into design tokens.

Step 3
Create common breakpoints and mixins.

Step 4
Set up global/base styles.

Step 5
Introduce theme CSS variables.

Step 6
Convert shared/reusable components to SCSS Modules.

Step 7
Convert feature components gradually.

Step 8
Remove duplicated styles.

Step 9
Remove unused legacy global CSS.

Step 10
Enforce the architecture for all new development.
```

Existing components should continue working during the migration.

Avoid a large one-time styling rewrite unless there is a strong project reason.

---

# 26. Final Architecture Principles

The SCSS architecture should follow these principles:

```text
Global behavior → base/

Design values → abstracts/

Reusable styling logic → abstracts/mixins

Responsive rules → abstracts/breakpoints

Runtime themes → themes/

Small global helpers → utilities/

Reusable component styles → component SCSS Modules

Feature-specific styles → feature SCSS Modules
```

The most important rule is:

> Keep styles as close as possible to the component that owns them, while keeping shared design decisions centralized.

This keeps the React application scalable without turning the stylesheet architecture into another layer of complexity.
