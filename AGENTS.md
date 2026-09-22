# React + TypeScript Engineering Skill

## Purpose

Use this skill when creating, reviewing, refactoring, or extending a React application written in TypeScript.

The goal is to produce code that is readable, predictable, strongly typed, reusable, accessible, testable, secure, and easy to maintain.

Always follow the existing project architecture and conventions unless they clearly conflict with the rules below.

---

## 1. Core Engineering Principles

- Prefer simple, readable solutions over clever ones.
- Keep each file, function, component, hook, and module focused on one responsibility.
- Reuse existing project code before creating new abstractions.
- Avoid duplication, but do not over-generalize prematurely.
- Keep feature-specific code inside the feature.
- Move code to `shared` only when it is genuinely reusable across multiple features.
- Prefer composition over large configurable components.
- Optimize for maintainability first. Optimize performance only where needed.
- Do not introduce a new architectural pattern unless it solves a real problem.
- Preserve the existing architecture unless the task explicitly requires architectural change.

---

## 2. TypeScript Rules

### Strict typing

- Use TypeScript for all new application code.
- Keep strict TypeScript settings enabled.
- Do not use `any` unless there is a documented and unavoidable reason.
- Prefer `unknown` when the value is not yet known.
- Use explicit types at important application boundaries.

### Prefer strong domain types

Use interfaces, type aliases, unions, and discriminated unions instead of generic strings or loosely typed objects.

```ts
interface User {
  id: string;
  name: string;
  email: string;
}
```

Prefer:

```ts
type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";
```

Instead of:

```ts
let status: string;
```

### Avoid unnecessary optional properties

Do not model valid required data as optional only to make TypeScript errors disappear.

Prefer separate request/input types when creation and persisted models differ.

### Runtime validation

TypeScript does not validate runtime data.

Validate important external data such as:

- API responses
- form submissions
- URL parameters
- local storage data
- environment variables
- webhook/external integration payloads

Use the validation library already present in the project. If none exists, follow project conventions before adding one.

---

## 3. JavaScript Rules

### Variables

- Use `const` by default.
- Use `let` only when reassignment is required.
- Never use `var` in new code.

### Naming

Use descriptive names.

Bad:

```ts
const u = getUser();
```

Good:

```ts
const currentUser = getUser();
```

Boolean names should normally start with:

- `is`
- `has`
- `can`
- `should`

Examples:

```ts
const isLoading = true;
const hasPermission = false;
const canEditUser = true;
```

Functions should describe actions:

```ts
getCurrentUser()
calculateOrderTotal()
validateEmail()
createCustomer()
```

### Avoid magic values

Do not scatter magic strings or numbers through the codebase.

Prefer constants or typed value objects.

```ts
export const UserRole = {
  Admin: "admin",
  Manager: "manager",
  User: "user",
} as const;
```

### Early returns

Prefer guard clauses and early returns over deep nesting.

### Immutability

Do not mutate React state or shared application data directly.

Prefer immutable updates with spreads, `map`, `filter`, and other clear transformations.

### Async code

- Prefer `async/await` over long promise chains.
- Use `Promise.all` when operations are independent.
- Do not parallelize operations that depend on each other.

### Error handling

- Never silently swallow errors.
- Handle errors at the correct layer.
- Do not use exceptions for normal expected control flow when a typed result is clearer.

---

## 4. React Component Rules

### Functional components

Use functional components for new code.

### Type every prop

Never use untyped component props.

```tsx
interface UserCardProps {
  name: string;
  email: string;
  isActive: boolean;
}
```

### Single responsibility

A component should have one clear responsibility.

Avoid components that simultaneously handle:

- API calls
- validation
- permissions
- complex business rules
- large forms
- analytics
- data transformation
- many unrelated UI sections

Split responsibilities when this happens.

### Page components

Pages should mainly orchestrate features and compose smaller components.

### Reusable components

Reusable components should:

- receive data through props
- receive actions through callbacks
- stay strongly typed
- avoid direct feature-specific API calls
- avoid feature-specific business rules
- expose a clear and predictable public API

### Composition

Prefer composition over components with many boolean or layout props.

Avoid components that require many flags such as:

```text
showHeader
showFooter
showIcon
isCompact
isLarge
useAlternativeLayout
```

If configuration becomes complex, use composition or separate components.

---

## 5. React State Rules

### Avoid unnecessary state

If a value can be derived from existing props or state, calculate it directly instead of storing it in another state variable.

Bad:

```tsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Good:

```tsx
const fullName = `${firstName} ${lastName}`;
```

### State location

Keep state as close as possible to where it is used.

Do not move state into Context, Redux, Zustand, or another global store unless multiple parts of the application genuinely need it.

### Server state vs client state

Treat them differently.

Client state examples:

- modal open/closed
- selected tab
- local form input
- sidebar state

Server state examples:

- users
- orders
- products
- notifications
- remote API results

Use the project's existing server-state solution when available.

### Functional updates

When new state depends on previous state, use functional updates.

```tsx
setCount(previousCount => previousCount + 1);
```

### Never mutate state

Bad:

```tsx
users.push(newUser);
setUsers(users);
```

Good:

```tsx
setUsers(previousUsers => [...previousUsers, newUser]);
```

---

## 6. `useEffect` Rules

Do not use `useEffect` as a default tool for normal calculations.

Use it mainly to synchronize React with external systems, including:

- browser APIs
- subscriptions
- timers
- WebSockets
- external services
- third-party libraries
- DOM integrations

Always clean up subscriptions, listeners, timers, and other resources when required.

Keep dependency arrays correct.

Do not disable dependency lint rules just to silence warnings unless there is a documented reason.

---

## 7. Custom Hook Rules

Use custom hooks for meaningful reusable React behavior.

Examples:

- `useDebounce`
- `usePagination`
- `usePermissions`
- `useCurrentUser`
- `useLocalStorage`
- `useMediaQuery`

Do not create hooks only to move random lines out of a component.

Hooks should represent coherent behavior.

---

## 8. Reusability Rules

Before creating new code, search the existing project for a reusable:

- component
- hook
- service
- API function
- type
- validator
- mapper
- utility
- constant
- design-system primitive

Do not duplicate existing logic.

Extract repeated logic only when it improves maintainability.

Do not force unrelated business concepts into one abstraction just because the code looks similar.

### Shared code rule

Shared modules must remain independent of feature modules.

Preferred dependency direction:

```text
Features -> Shared
```

Avoid:

```text
Shared -> Features
```

---

## 9. Recommended Responsibility Boundaries

Use these responsibilities as a guide:

```text
Component
  UI and interaction

Page
  Feature orchestration

Hook
  Reusable React behavior

API
  HTTP/network communication

Service
  Application or business orchestration

Utility
  Pure reusable calculation

Mapper
  Data transformation

Validator
  Validation rules

Type / Model
  Data definitions

Permission
  Authorization rules

Constants
  Stable reusable values
```

Do not mix multiple responsibilities into one file without a clear reason.

---

## 10. File, Class, Component, and Function Size Guidelines

These are maintainability guidelines, not hard limits.

### Preferred sizes

- React component file: ideally <= 200 lines
- General JavaScript/TypeScript file: ideally <= 250 lines
- Class/service file: ideally <= 200-250 lines
- Custom hook: ideally <= 150 lines
- Function/method: ideally <= 30-40 lines
- React component function: ideally <= 100-120 lines

### Review thresholds

- Files above 300 lines should be reviewed for refactoring.
- Files above 500 lines should normally be split unless there is a strong architectural reason not to.
- Functions above 50-60 lines should be reviewed for multiple responsibilities.

Do not split code only to satisfy a line-count rule.

Refactor based on cohesion, readability, complexity, and responsibility.

### Strong refactoring signals

Refactor when a file/component contains several of these:

- many responsibilities
- many `useState` calls
- many `useEffect` calls
- many event handlers
- repeated logic
- deeply nested conditions
- large JSX sections
- API logic mixed with presentation
- business rules mixed with rendering
- complex permission checks

---

## 11. Feature Structure

For medium and large applications, prefer feature-based organization unless the existing project uses another established structure.

Example:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
│
├── features/
│   ├── authentication/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── validation/
│   │   └── utils/
│   ├── users/
│   └── settings/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
│
└── main.tsx
```

Keep feature-specific code in its feature.

Move code into `shared` only when it is genuinely shared.

---

## 12. Utility and Constant Rules

Avoid giant files such as:

```text
utils.ts
constants.ts
```

containing unrelated responsibilities.

Prefer focused files such as:

```text
date.utils.ts
currency.utils.ts
validation.utils.ts
string.utils.ts
```

Prefer feature-level constants where possible.

---

## 13. Import Rules

Use clear, predictable import paths.

Prefer configured aliases instead of deeply nested relative imports when the project supports them.

Do not import shared top-level folders such as `assets` through long relative paths.
Prefer the configured short alias instead, for example `@/assets/hero.png` instead of `../../../assets/hero.png`.

Avoid circular dependencies.

Do not overuse barrel files (`index.ts`). Use them intentionally at meaningful module boundaries.

---

## 14. API and Data Access Rules

Keep API communication outside presentational components.

Prefer a structure such as:

```text
features/
  users/
    api/
      get-users.ts
      create-user.ts
    hooks/
      use-users.ts
    components/
      UserTable.tsx
```

Centralize shared API concerns such as:

- base URL
- authentication headers
- request/response interceptors
- timeout configuration
- shared error mapping
- serialization/deserialization

Do not make UI components depend directly on transport-layer response shapes if a mapper or application model is appropriate.

---

## 15. Forms and Validation

Use the form approach already established in the project.

For large forms, prefer a form library instead of many independent `useState` calls.

Keep validation rules centralized and reusable.

Use schema-based validation when the project already supports it or when complexity justifies it.

Display validation errors clearly and accessibly.

---

## 16. Error, Loading, and Empty States

Any component that loads remote data should intentionally consider:

- loading
- error
- empty
- success
- unauthorized
- disabled
- partial data

Do not render only the successful state.

---

## 17. Permissions and Authorization

Do not scatter raw role checks throughout JSX.

Avoid:

```tsx
{user.role === "admin" && <DeleteButton />}
```

Prefer a permission abstraction when one exists:

```tsx
{can(Permission.UserDelete) && <DeleteButton />}
```

Frontend permission checks improve UX only.

Security-sensitive authorization must also be enforced by the backend.

---

## 18. Security Rules

Never place secrets in frontend code.

Do not expose:

- private API keys
- passwords
- private tokens
- credentials
- private encryption keys

Treat all browser-delivered code and configuration as visible to users.

Avoid unsafe HTML rendering.

Use `dangerouslySetInnerHTML` only when necessary and only with trusted or properly sanitized content.

Never log sensitive data.

---

## 19. Localization Rules

When the application supports localization, do not hard-code user-facing text in components.

Bad:

```tsx
<Button>Save Changes</Button>
```

Prefer the project's localization system:

```tsx
<Button>{t("settings.saveChanges")}</Button>
```

Keep translation keys organized and reusable.

When adding new user-facing text, add the required localization entries for all languages supported by the project.

---

## 20. Accessibility Rules

Use semantic HTML whenever possible.

Bad:

```tsx
<div onClick={handleSave}>Save</div>
```

Good:

```tsx
<button onClick={handleSave}>Save</button>
```

Consider:

- keyboard navigation
- labels for form fields
- focus management
- screen reader support
- accessible modal behavior
- error announcement
- color contrast
- table semantics
- ARIA only where semantic HTML is insufficient

Accessibility is part of implementation quality, not an optional cleanup step.

---

## 21. Performance Rules

Do not optimize prematurely.

Watch for real issues such as:

- unnecessary rerenders
- excessive API requests
- large bundles
- huge lists
- expensive calculations
- duplicated requests
- unnecessary dependencies

Possible solutions include:

- lazy loading
- route-level code splitting
- pagination
- virtualization
- caching
- memoization

Do not use `useMemo`, `useCallback`, or `React.memo` everywhere automatically.

Use them when they solve a measurable or clearly understood problem.

---

## 22. List Rendering

Use stable identifiers as React keys.

Avoid array indexes as keys for dynamic lists that can be reordered, inserted, or removed.

Bad:

```tsx
users.map((user, index) => (
  <UserCard key={index} user={user} />
));
```

Good:

```tsx
users.map(user => (
  <UserCard key={user.id} user={user} />
));
```

---

## 23. Conditional Rendering

Avoid deeply nested ternaries and large conditional JSX trees.

Prefer guard clauses, extracted variables, or dedicated components.

---

## 24. Event Handler Rules

Avoid large inline event handlers inside JSX.

Prefer named handlers:

```tsx
const handleSave = async () => {
  await saveSettings();
};
```

Then:

```tsx
<Button onClick={handleSave}>Save</Button>
```

Use `handleX` for local handlers and `onX` for callback props.

---

## 25. Design System Rules

Reuse existing project design-system components before creating new UI primitives.

Common reusable primitives may include:

- Button
- Input
- Select
- SearchableSelect
- Checkbox
- Radio
- Modal
- Dialog
- Toast
- Table
- Pagination
- Tabs
- Tooltip
- DatePicker
- FormField
- Loader
- EmptyState

Do not create one-off styling when an existing design-system component or token already solves the problem.

Follow existing typography, spacing, color, radius, breakpoint, and interaction tokens.

---

## 25.1 Responsive Component and Page Rules

Build every new or modified page and component to work across mobile, tablet, laptop, and desktop viewports unless the product explicitly targets a narrower device class.

### Follow the existing responsive system

- Inspect the project's SCSS tokens, breakpoint mixins, layout utilities, and nearby responsive components before adding styles.
- Reuse existing breakpoint names and mixins. Do not introduce isolated media-query values when an equivalent project breakpoint exists.
- Keep responsive styles in the relevant SCSS module or established shared stylesheet. Do not add a new styling framework or runtime viewport library for layout that CSS can handle.
- Preserve the application's established visual identity, spacing rhythm, typography scale, and component behavior at every breakpoint.

### Use fluid, content-driven layouts

- Start with the smallest supported viewport and progressively enhance the layout at existing breakpoints.
- Prefer normal document flow, Flexbox, and Grid over absolute positioning for primary page and component layout.
- Use fluid constraints such as `width: 100%`, `max-width`, `minmax()`, `clamp()`, and `aspect-ratio` where appropriate.
- Avoid fixed widths and heights for content containers when content or viewport size can vary. Fixed dimensions are acceptable only for intentionally stable UI elements such as icons or compact controls.
- Add `min-width: 0` to grid or flex children when necessary so long content can shrink instead of forcing horizontal overflow.
- Ensure text, tables, media, form controls, and action groups wrap, scroll locally, stack, or resize intentionally on narrow screens.
- Do not allow page-level horizontal scrolling at supported viewport sizes. Fix the element causing overflow instead of hiding layout defects globally.
- Use `100dvh` or `100svh` with a suitable fallback when a full-viewport layout is required, so mobile browser chrome does not obscure content.

### Adapt components intentionally

- Keep components usable in narrow parent containers, not only at full-page viewport widths.
- Stack columns and action groups when their minimum usable widths no longer fit. Do not merely shrink controls or text until they become difficult to use.
- Keep forms visually balanced with a reasonable `max-width` on large screens and full available width with safe inline padding on small screens.
- Allow labels, helper text, validation messages, links, and localized strings to wrap without clipping or overlapping adjacent content.
- Keep images and media responsive with bounded dimensions and an intentional `object-fit` behavior.
- Preserve a clear content hierarchy on small screens; do not hide required content solely to make the layout fit.
- For dense data views, choose an explicit small-screen pattern such as controlled horizontal scrolling, responsive columns, or a stacked representation that preserves meaning and accessibility.

### Maintain responsive accessibility

- Keep body and form text readable without requiring zoom. Avoid input font sizes below `16px` on mobile where browser zoom may be triggered.
- Provide touch targets of at least `44px` by `44px` for primary interactive controls where practical, with enough spacing to prevent accidental activation.
- Preserve logical DOM order and keyboard navigation when the visual layout changes across breakpoints.
- Keep visible focus states, labels, errors, and instructions available at every viewport size.
- Do not rely on hover-only interactions for functionality that must work on touch devices.
- Respect browser zoom, text scaling, reduced motion, safe-area insets, and user font-size preferences where relevant.

### Verify responsive behavior

- Test representative mobile, tablet, laptop, and desktop widths using the project's existing browser or end-to-end tooling.
- Check both portrait and landscape orientations where the layout materially changes.
- Verify the page at narrow width, short viewport height, long content, validation-error states, and increased browser zoom or text size.
- Confirm there is no unintended horizontal overflow, clipped content, overlap, layout shift, or unreachable control.
- Prefer visual verification with browser screenshots for user-facing layout changes when the available tooling supports it.

---

## 26. Testing Rules

Test user-visible behavior and business outcomes rather than internal implementation details.

Prefer tests that answer questions such as:

- Can the user submit the form?
- Is invalid input rejected?
- Does the correct error appear?
- Does the updated data appear after save?
- Is permission-sensitive UI hidden or shown correctly?

Use unit tests for:

- pure utilities
- calculations
- validators
- mappers
- permission logic
- business rules

Use integration/component tests for important flows.

Follow the testing tools already used in the project.

---

## 27. Logging Rules

Use the existing project logging abstraction.

Prefer structured logging.

Use appropriate levels:

- debug
- info
- warn
- error

Do not leave temporary `console.log` statements in production code.

Do not log sensitive data.

---

## 28. Configuration Rules

Centralize environment/configuration access.

Avoid reading `process.env` or `import.meta.env` throughout many files.

Prefer a validated config module.

Validate required environment values at application startup where practical.

---

## 29. Dependency Rules

Before adding a new npm package:

- check whether the project already has a suitable dependency
- determine whether the need can be safely solved with existing code
- check maintenance status
- check bundle impact
- check license compatibility
- check known security concerns

Do not add dependencies for trivial helpers without a good reason.

---

## 30. Dead Code and Cleanup

Remove:

- unused imports
- unused functions
- unused components
- obsolete feature flags
- commented-out code
- abandoned helpers
- temporary debugging code

Do not keep code “just in case.” Version control already preserves history.

---

## 31. Code Review and PR Quality

Keep pull requests focused and reviewable.

Avoid combining unrelated work such as:

- a new feature
- a large refactor
- dependency upgrades
- formatting cleanup
- unrelated bug fixes

Before considering work complete, confirm:

- the project builds
- TypeScript passes
- lint passes
- tests pass where applicable
- unused code is removed
- temporary logging is removed
- loading/error/empty states are handled
- localization is updated
- accessibility is considered
- security is considered
- existing architecture is respected

---

## 32. Refactoring Guidance

Do not refactor unrelated code unless necessary for the requested change.

When refactoring is required:

- preserve behavior unless the task explicitly changes it
- keep changes small and understandable
- avoid unnecessary file movement
- avoid introducing new patterns without need
- add or update tests for affected behavior when appropriate

---

## 33. AI Coding Agent Behavior

When using this skill as an AI coding agent:

1. Inspect the existing project structure before writing code.
2. Follow existing naming, architecture, state management, styling, testing, and localization patterns.
3. Search for existing reusable components, hooks, utilities, services, types, and constants before creating new ones.
4. Do not duplicate functionality that already exists.
5. Do not introduce a new library when the project already has a suitable solution.
6. Do not rewrite unrelated code.
7. Keep changes scoped to the task.
8. Preserve backward compatibility unless the request explicitly allows breaking changes.
9. Prefer modifying an existing reusable component over creating a duplicate.
10. When a new reusable abstraction is justified, keep its API small and strongly typed.
11. Respect file/function size guidelines and refactor only when cohesion improves.
12. Keep business logic out of presentational components.
13. Keep API calls out of low-level UI components.
14. Add localization entries for new user-facing text.
15. Handle loading, error, empty, and permission states where relevant.
16. Consider accessibility for all interactive UI.
17. Avoid unnecessary `useEffect`, global state, memoization, and abstraction.
18. Explain major architectural deviations if one is truly required.

---

## 34. Final Implementation Checklist

Before finishing any change, verify:

- [ ] Existing reusable code was checked first.
- [ ] No unnecessary duplicate component or utility was created.
- [ ] Types are strong and `any` is avoided.
- [ ] Naming is clear and consistent.
- [ ] Magic strings/numbers are minimized.
- [ ] Components and functions have focused responsibilities.
- [ ] File/function size remains reasonable.
- [ ] State is kept as local as practical.
- [ ] Derived state is not unnecessarily stored.
- [ ] `useEffect` is used only where appropriate.
- [ ] Effects clean up resources when required.
- [ ] React state is not mutated directly.
- [ ] API logic is separated from presentational UI.
- [ ] Business rules are not duplicated across components.
- [ ] External data is validated where appropriate.
- [ ] Errors are handled intentionally.
- [ ] Loading/error/empty states are handled.
- [ ] Authorization-sensitive behavior is respected.
- [ ] User-facing text uses localization where required.
- [ ] Accessibility is considered.
- [ ] Modified pages and components are usable on mobile, tablet, laptop, and desktop widths.
- [ ] Portrait and landscape layouts do not clip, overlap, or introduce page-level horizontal scrolling.
- [ ] Responsive styles reuse existing SCSS tokens, utilities, and breakpoint mixins.
- [ ] Forms and interactive controls remain readable, keyboard accessible, and touch friendly at narrow widths.
- [ ] No sensitive data is exposed or logged.
- [ ] Imports and dependency direction remain clean.
- [ ] Circular dependencies are avoided.
- [ ] Dead code and temporary logs are removed.
- [ ] Tests are added or updated where appropriate.
- [ ] The implementation follows existing project conventions.
- [ ] Another developer can understand the solution quickly.

---

## Final Principle

Write code for the next developer, not only for the compiler.

The preferred solution is the one that is easiest to understand, safest to change, and most consistent with the existing application.
