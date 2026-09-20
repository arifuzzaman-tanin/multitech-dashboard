# Login Feature Implementation Guide

> **Purpose:** Implement a production-ready login feature in the existing React + TypeScript application, matching the attached MultiTech mCloud login reference as closely as practical while following the application's existing React architecture and SCSS architecture.
>
> **Important:** The backend login API is **not available yet**. Build the UI, validation, feature boundaries, reusable components, routing, accessibility, localization, responsive behavior, and REST integration contract now. Do **not** fake authentication or store dummy tokens. Wire the real REST request only when the API contract is provided.

---

# 1. Implementation Goals

Create a login experience with the same overall composition and visual hierarchy as the supplied reference:

- Large branded/marketing panel on the left.
- Clean white login panel on the right.
- Brand/logo area at the top-left.
- Large `Welcome back` heading.
- Supporting sign-in text.
- Email field with leading email icon.
- Password field with leading lock icon and trailing show/hide-password control.
- `Forgot your password?` link aligned to the right.
- Full-width primary `Sign in` button with a right-arrow icon.
- Horizontal divider with `OR`.
- `Don't have an account? Contact your administrator` message.
- `Forgot your password?` and `Contact your administrator` must remain **hash links only** for now.
- Responsive behavior that preserves a clean login experience on tablet and mobile.
- REST-ready architecture without implementing a real network request yet.
- Reuse the application's existing architecture, tokens, mixins, path aliases, localization, icons, form libraries, and UI primitives whenever they already exist.

Do not rebuild or reorganize unrelated parts of the application.

---

# 2. Reference Image Analysis

The attached login design is a desktop split-screen layout.

## 2.1 Desktop composition

Approximate visual split:

```text
┌──────────────────────────────────────────────────┬───────────────────────────────┐
│                                                  │                               │
│                 BRAND / HERO                     │         LOGIN PANEL           │
│                    ~63%                          │            ~37%               │
│                                                  │                               │
│  Logo                                            │                               │
│  Eyebrow                                         │                               │
│  Large headline                                  │     Welcome back              │
│  Supporting copy                                 │     Supporting copy           │
│                                                  │                               │
│  Sensor → Edge → Cloud → Dashboard               │     Email                     │
│                                                  │     [ input ]                 │
│  Industrial / dashboard visual                   │                               │
│                                                  │     Password                  │
│                                                  │     [ input       eye ]        │
│                                                  │           Forgot password?     │
│                                                  │                               │
│                                                  │     [      Sign in →      ]    │
│                                                  │                               │
│  Small footer / brand message                    │     ─────── OR ───────        │
│                                                  │                               │
│                                                  │     Contact administrator     │
└──────────────────────────────────────────────────┴───────────────────────────────┘
```

The reference is approximately a `60/40` to `63/37` split rather than a strict `50/50` layout.

## 2.2 Left-side visual characteristics

The left panel uses:

- Pale blue / white background.
- Large amount of open space around the copy.
- Dark navy typography.
- Bright blue brand accents.
- A light industrial background image.
- A visual flow showing:
  - industrial sensors
  - edge devices
  - cloud platform
  - centralized dashboard
- Large dashboard/device imagery near the bottom.
- Small uppercase eyebrow text with increased letter spacing.
- Small footer copy near the bottom-left.

The application implementation should preserve this **visual hierarchy**, but it must use assets already available in the repository whenever possible.

Do not copy the screenshot itself into the production page as one giant background image.

Do not invent company assets, logos, product screenshots, or illustrations if equivalent assets are not available. If required assets are missing, keep the structure ready and use the closest approved project asset or a documented temporary placeholder.

## 2.3 Right-side visual characteristics

The right panel is intentionally simple:

- White background.
- Vertically centered form area.
- Form width approximately `430px–470px` on large desktop screens.
- Plenty of horizontal whitespace.
- Dark navy heading.
- Muted secondary description.
- Labels above inputs.
- Inputs are approximately `54px–58px` high.
- Thin neutral border.
- Medium rounded corners.
- Blue focus/active state.
- Primary button is full-width and approximately the same height as the inputs.
- Links use the primary blue.
- Divider uses two thin horizontal lines with centered `OR`.

Avoid excessive shadows, gradients, borders, or card containers on the right panel. The reference form sits directly on the white surface.

---

# 3. Existing Architecture Rules That Must Be Preserved

The implementation must follow the existing feature-first architecture.

Authentication workflow belongs under:

```text
src/features/authentication/
```

Low-level authentication/session concerns belong under:

```text
src/infrastructure/auth/
```

Global REST infrastructure remains under:

```text
src/infrastructure/api/rest/
```

Reusable application-wide UI belongs under:

```text
src/shared/components/
```

Do not place REST calls directly inside React components.

Preferred future REST flow:

```text
LoginPage
   ↓
LoginForm
   ↓
authentication hook / mutation
   ↓
authentication REST operation
   ↓
shared REST client
   ↓
backend
```

For this first implementation, stop before the real backend request because the login API contract has not yet been supplied.

---

# 4. Required Directory Structure

First inspect the existing repository and reuse any equivalent existing files/components.

Only create missing files that are actually required.

Recommended result:

```text
src/
├── app/
│   └── router/
│       └── ...
│
├── features/
│   └── authentication/
│       ├── api/
│       │   └── rest/
│       │       ├── login.api.ts
│       │       └── login.types.ts
│       │
│       ├── components/
│       │   ├── LoginForm/
│       │   │   ├── LoginForm.tsx
│       │   │   └── LoginForm.module.scss
│       │   │
│       │   └── LoginHero/
│       │       ├── LoginHero.tsx
│       │       └── LoginHero.module.scss
│       │
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   └── LoginPage.module.scss
│       │
│       ├── schemas/
│       │   └── login.schema.ts
│       │
│       ├── types/
│       │   └── authentication.types.ts
│       │
│       ├── constants/
│       │   └── authentication.constants.ts
│       │
│       └── tests/
│           ├── LoginForm.test.tsx
│           └── LoginPage.test.tsx
│
├── shared/
│   └── components/
│       ├── actions/
│       │   └── Button/
│       │       ├── Button.tsx
│       │       └── Button.module.scss
│       │
│       └── forms/
│           ├── Input/
│           │   ├── Input.tsx
│           │   └── Input.module.scss
│           │
│           └── FormField/
│               ├── FormField.tsx
│               └── FormField.module.scss
│
├── infrastructure/
│   ├── api/
│   │   └── rest/
│   │       └── ...
│   └── auth/
│       └── ...
│
├── assets/
│   ├── icons/
│   └── images/
│
```

### Important reuse rule

If the application already contains a suitable:

- Button
- Input
- FormField
- icon component
- language selector
- public/auth layout
- REST client
- form validation solution
- loading indicator

then **extend or reuse it** instead of creating another one.

Do not create duplicate design-system primitives.

---

# 5. Reusable Global Components

The login page genuinely needs reusable form primitives, so these can be application-wide components if equivalent components do not already exist.

## 5.1 `Button`

Location:

```text
src/shared/components/actions/Button/
```

Required behavior:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}
```

Requirements:

- Use a native `<button>`.
- Default `type` should not accidentally submit unrelated forms.
- Support `type="submit"`.
- Support disabled state.
- Support loading state.
- Prevent repeated submissions while loading.
- Preserve visible focus state.
- Do not remove keyboard focus outline without an accessible replacement.
- `isLoading` must communicate busy state with `aria-busy`.
- Button label should remain understandable to screen readers.
- Do not hard-code login-specific text inside the shared component.
- The shared component must not import anything from the authentication feature.
- Use existing icons if the project already has an icon system.

For the login page:

```text
variant = primary
fullWidth = true
trailingIcon = arrow-right
```

---

# 6. Reusable `Input` Component

Location:

```text
src/shared/components/forms/Input/
```

Recommended public API:

```ts
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingElement?: React.ReactNode;
  fullWidth?: boolean;
}
```

Required behavior:

- Render a semantic `<input>`.
- Connect label using `htmlFor` and input `id`.
- Forward a ref when the existing code style supports it.
- Support:
  - `type`
  - `name`
  - `value`
  - `defaultValue`
  - `placeholder`
  - `autoComplete`
  - `disabled`
  - `readOnly`
  - `required`
  - `aria-*`
- Support leading icons.
- Support a trailing interactive element, needed for password visibility.
- Expose validation errors accessibly.
- Use `aria-invalid` when invalid.
- Associate error text with `aria-describedby`.
- Never place authentication logic inside the shared Input.
- Never manage the login form's state internally.

The login page needs:

```text
Email:
leading icon = envelope/mail

Password:
leading icon = lock
trailing element = show/hide password button
```

---

# 7. Optional `FormField`

Create `FormField` only if the project does not already have a clean label/error abstraction and the existing Input would otherwise become overloaded.

Potential responsibility:

```text
Label
Control
Helper text
Validation error
```

Do not create both a highly complex `Input` and a redundant `FormField` with the exact same responsibility.

Choose the simplest option that matches the existing repository.

---

# 8. Authentication Feature Components

## 8.1 `LoginPage`

Responsibility:

- Route-level composition only.
- Build the split-screen shell.
- Compose `LoginHero` and `LoginForm`.
- Coordinate responsive layout.
- Do not contain detailed validation logic.
- Do not perform HTTP calls directly.
- Do not contain reusable input/button implementation details.

Conceptually:

```tsx
<LoginPage>
  <LoginHero />
  <LoginForm />
</LoginPage>
```

---

# 9. `LoginHero`

Location:

```text
src/features/authentication/components/LoginHero/
```

This component owns the left-side login marketing visual.

Content should follow the supplied reference hierarchy:

```text
Brand/logo

Eyebrow:
FROM SENSORS TO SMARTER OPERATIONS

Headline:
Real-time data.
Smarter decisions.

Supporting copy:
Your industrial devices send data to mCloud,
giving you complete visibility and control
from a centralized dashboard.

Process:
Industrial Sensors
        ↓
Edge Devices
        ↓
mCloud
        ↓
Centralized Dashboard

Bottom visual:
industrial site + connected devices + dashboard

Footer:
CONNECTING INDUSTRY FOR A SMARTER TOMORROW
```

### Content rule

Use actual project/product copy and assets already approved in the repository.

If the application is not MultiTech-branded, preserve the layout and hierarchy but use the application's existing branding rather than hard-coding `MultiTech` into a generic product.

Do not create a fake logo.

---

# 10. `LoginForm`

Location:

```text
src/features/authentication/components/LoginForm/
```

The form should contain, in this order:

```text
Welcome back
Sign in to your <product name> account

Email address
[ email input ]

Password
[ password input + visibility control ]

Forgot your password?

[ Sign in → ]

────────  OR  ────────

Don't have an account? Contact your administrator
```

Both secondary links are intentionally inactive placeholders:

```tsx
<a href="#">Forgot your password?</a>

<a href="#">Contact your administrator</a>
```

### Hash-link behavior

Because `href="#"` normally jumps to the top of the page, prevent the default navigation for these placeholder links until the features exist.

They must:

- look like links
- be keyboard reachable
- remain hash links
- not open another route
- not call an API
- not show fake success behavior

Example behavior:

```tsx
const handlePlaceholderLink = (
  event: React.MouseEvent<HTMLAnchorElement>
) => {
  event.preventDefault();
};
```

Do not implement forgot-password or administrator-contact functionality in this task.

---

# 11. Form State and Validation

First check which form solution already exists.

Preferred order:

1. Reuse the project's existing form library.
2. If the application already uses React Hook Form, use it.
3. If the application already uses another established solution, stay consistent.
4. Do not add a package before confirming the repository does not already solve the problem.

The existing architecture supports runtime schema validation. If Zod already exists, use it.

Recommended login model:

```ts
interface LoginFormValues {
  email: string;
  password: string;
}
```

Recommended validation:

### Email

- required
- trim surrounding whitespace
- valid email syntax
- sensible maximum length

### Password

For **login**, do not enforce registration-style password composition rules.

Correct:

```text
Password is required.
```

Avoid login-time rules such as:

```text
Must contain uppercase
Must contain symbol
Must contain number
Must be at least 12 characters
```

Those rules can reject an existing legitimate password before it reaches the server.

A reasonable maximum input length may be used defensively, but keep it compatible with the backend contract once supplied.

---

# 12. Email Input Best Practices

Use:

```tsx
type="email"
autoComplete="username"
inputMode="email"
```

Do not:

- auto-capitalize the email
- spellcheck the email
- store the email in global application state unless a real requirement exists

Recommended browser attributes where supported:

```tsx
autoCapitalize="none"
spellCheck={false}
```

Do not aggressively transform the email address while the user is typing.

Trimming should occur safely at validation/submission boundaries.

---

# 13. Password Input Best Practices

Use:

```tsx
type={isPasswordVisible ? 'text' : 'password'}
autoComplete="current-password"
```

The visibility control should:

- be a real `<button type="button">`
- be keyboard accessible
- have an accessible name
- not submit the form
- preserve the current password value
- preserve focus behavior

Accessible label should switch:

```text
Show password
Hide password
```

Do not:

- log the password
- persist the password
- put it in URL/search params
- copy it into localStorage
- copy it into sessionStorage
- send it anywhere before a real login API is provided

---

# 14. Login REST Contract — Prepare Now, Call Later

Authentication uses **REST**, not GraphQL.

Create the authentication REST boundary:

```text
src/features/authentication/api/rest/
```

Suggested types:

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  // Do not invent the final backend contract.
  // Replace when the real API is provided.
}
```

Suggested future operation shape:

```ts
export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  // TODO: Implement when the backend endpoint and response contract are provided.
  throw new Error('Login API is not configured yet.');
}
```

### Important

Do **not** wire the current Sign in button to a function that deliberately throws an error to the user.

For the current UI-only phase:

```text
submit
  ↓
client-side validation
  ↓
valid?
  ├─ no → show validation messages
  └─ yes → stop at integration boundary
```

Use a clearly documented TODO in the submit handler.

Do not:

- call a made-up `/api/login`
- hard-code a base URL
- fake a successful session
- create a fake JWT
- store dummy auth state
- redirect as though login succeeded

When the real API is supplied, change the flow to:

```text
LoginForm
   ↓
useLogin
   ↓
TanStack Query mutation
   ↓
login.api.ts
   ↓
shared REST client
   ↓
backend
```

if TanStack Query is already the application's REST server-state standard.

---

# 15. Future Session Security Model

When the backend is available, prefer secure cookie-based session authentication when supported:

```text
Secure
HttpOnly
SameSite
```

If bearer tokens are required instead:

- centralize token handling
- do not scatter token reads/writes through components
- avoid long-lived sensitive tokens in localStorage when a safer backend-supported model exists
- never put tokens in URLs
- never log tokens
- clear authenticated user-specific caches on logout / identity change

The frontend is not the authorization security boundary.

---

# 16. REST Client Requirements for Future Integration

Reuse the existing global REST client under:

```text
src/infrastructure/api/rest/
```

Do not create an authentication-specific Axios/fetch client unless the architecture genuinely requires one.

The shared REST layer should remain responsible for concerns such as:

- base URL
- default headers
- credentials mode
- request timeout
- cancellation
- correlation/request IDs
- response parsing
- normalized errors
- authentication response handling
- selective retry policy

### Login retry warning

Do not automatically retry failed login requests multiple times by default.

Authentication errors such as `401` should be shown as an authentication failure, not blindly retried.

Network retry behavior should be conservative.

---

# 17. API Error Handling for Later Integration

Normalize backend errors before they reach the UI.

Possible categories:

```text
validation
authentication
authorization
rate-limit
network
timeout
server
unknown
```

The login form should eventually map these to safe messages.

Examples:

```text
authentication:
"Email or password is incorrect."

rate-limit:
"Too many sign-in attempts. Please try again later."

network:
"We couldn't reach the server. Check your connection and try again."

server:
"We couldn't sign you in right now. Please try again."
```

Do not expose:

- backend stack traces
- SQL errors
- internal exception names
- security implementation details

Avoid account-enumeration messages such as:

```text
"No account exists for this email."
```

unless the backend/security requirements explicitly permit that behavior.

---

# 18. Submission Behavior

When the API is connected later:

- Disable the submit button while the request is in progress.
- Prevent duplicate submissions.
- Show a loading state inside the button.
- Preserve the user's entered email after a failed login.
- Keep password handling minimal.
- Move focus to an appropriate error summary/message when useful.
- Do not clear the form on ordinary authentication failure.
- Handle Enter-key submission naturally through the `<form>`.
- Do not manually listen for Enter on each field.
- Do not use `onClick` as the only submit mechanism.

Correct:

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  ...
  <Button type="submit">Sign in</Button>
</form>
```

---

# 19. Route Integration

Use the application's existing router.

Suggested route:

```text
/login
```

or preserve the repository's existing authentication route naming.

Requirements:

- Do not add a second router.
- Do not tightly couple the page to a specific URL if the app already has route constants.
- Lazy-load the route if that is the repository's established route strategy.
- Keep login as a public route.
- If an authenticated-user redirect convention already exists, reuse it.
- Do not invent a redirect destination without checking the existing application.

---

# 20. Styling Rules

The implementation must follow the existing SCSS architecture.

Use:

```text
ComponentName.module.scss
```

for component-specific styles.

Examples:

```text
LoginPage.module.scss
LoginHero.module.scss
LoginForm.module.scss
Button.module.scss
Input.module.scss
```

Do not create:

```text
login.scss
components.scss
auth-global.scss
```

as large global style files.

---

# 21. Design Tokens

Before adding any color, spacing, radius, typography size, breakpoint, transition, or shadow:

1. Check the existing design tokens.
2. Reuse an existing token if one matches.
3. Add a new token only when the value is genuinely part of the shared design language.
4. Keep unique one-off layout measurements local if they are truly specific to this page.

Theme-dependent colors should use CSS custom properties.

Example concept:

```scss
.loginPanel {
  background: var(--color-background);
  color: var(--color-text-primary);
}
```

Do not duplicate hard-coded colors across multiple component files.

---

# 22. Recommended Visual Tokens

Use the project's existing equivalents rather than blindly creating these exact names.

Conceptual palette from the reference:

```text
Primary blue:
bright, saturated blue used for CTA, links, arrows, focus accents

Heading:
deep navy

Body:
muted blue-gray

Border:
light neutral blue-gray

Surface:
white

Hero background:
very pale blue / sky tint
```

The screenshot is a **reference**, not a requirement to bypass the application's design system.

---

# 23. Login Page SCSS Structure

Conceptual example only:

```scss
.page {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(420px, 1fr);
}

.hero {
  min-width: 0;
}

.authPanel {
  min-width: 0;
  background: var(--color-background);
}

.authPanelInner {
  width: min(100%, 460px);
  margin-inline: auto;
}
```

Do not copy these values without checking existing tokens and breakpoints.

Avoid deep nesting.

Maximum preferred SCSS nesting depth:

```text
3 levels
```

Do not use `!important` unless there is a documented third-party override reason.

---

# 24. Desktop Layout

For large screens:

- Login page fills the viewport height.
- Left panel takes approximately `60–63%`.
- Right panel takes approximately `37–40%`.
- Right panel maintains a comfortable minimum width.
- Login form should not stretch to fill the whole right panel.
- Keep form content around `430px–470px` wide.
- Vertically center the login content area while keeping the language switcher independently positioned.
- Preserve generous whitespace.

Avoid centering the form inside a visible card unless the existing application design system requires one.

---

# 25. Tablet Layout

At tablet widths:

Preferred behavior:

```text
Option A:
Hero becomes narrower.
Login panel remains readable.

Option B:
Hide nonessential hero details and preserve brand + headline.

Option C:
Stack hero and login if the project's breakpoints/design require it.
```

Choose the option that best matches the existing app's layout conventions.

Do not allow the login form to become squeezed below usable input widths.

---

# 26. Mobile Layout

On small screens:

- Prioritize the login form.
- It is acceptable to hide the large hero illustration.
- Preserve the brand/logo.
- Keep comfortable page padding.
- Inputs and button should be full-width.
- Do not require horizontal scrolling.
- Keep tap targets comfortably sized.
- Use `100dvh` where appropriate instead of relying only on `100vh`.
- Ensure virtual keyboard behavior does not make the form unusable.

Suggested mobile hierarchy:

```text
Brand
Welcome back
Description
Email
Password
Forgot password
Sign in
OR
Contact administrator
```

---

# 27. Accessibility Requirements

Accessibility is mandatory.

### Form

- Use `<form>`.
- Use real `<label>` elements.
- Associate labels and inputs.
- Use accessible validation messages.
- Use `aria-invalid` when appropriate.
- Use `aria-describedby` for field errors.
- Preserve logical tab order.

### Password control

- Use a real button.
- Add accessible name.
- Keep visible focus.
- Do not make the eye icon the only accessibility information.

### Links

- Use `<a href="#">` because the requirement explicitly asks for hash links.
- Prevent default behavior until implemented.
- Keep normal keyboard behavior.

### Button

- Use native button semantics.
- Show visible focus.
- Communicate loading/disabled state.

### Visual

- Maintain sufficient text/background contrast.
- Do not rely on color alone to show validation errors.
- Support `prefers-reduced-motion`.
- Avoid unnecessary animation.

---

# 28. Localization

Use **English only** for this login feature.

Do not add:

- localization/i18n support
- translation files
- language state
- language selectors
- locale switching

Keep the English UI copy directly in the feature/components or in an existing English-only constants pattern if the repository already uses one.

Recommended copy:

```text
Welcome back
Sign in to your account
Email address
you@company.com
Password
Enter your password
Forgot your password?
Sign in
OR
Don't have an account?
Contact your administrator
Show password
Hide password
```

---

# 29. Language Requirements

This application will use **English only** for the login feature.

Requirements:

- Do not add a language selector.
- Do not add localization/i18n infrastructure.
- Do not add translation files.
- Do not add locale state or locale switching.
- Do not add a globe/language icon.
- Keep all login text in English.
- Follow any existing project convention for English UI constants if one already exists, but do not introduce localization solely for this feature.

---

# 30. Icon Rules

Reuse the project's existing icon solution.

Icons required by the reference:

```text
globe / language
mail
lock
eye
eye-off
arrow-right
```

Do not add another icon package merely for these six icons if the application already has icons.

Decorative icons should not create noisy screen-reader output.

Use `aria-hidden="true"` for decorative SVGs when appropriate.

---

# 31. Hero Image and Asset Handling

Place image assets under the application's existing assets conventions, for example:

```text
src/assets/images/
src/assets/icons/
```

Performance:

- Do not ship unnecessarily huge source images.
- Use an appropriate modern image format if already used by the project.
- Define meaningful dimensions/aspect behavior.
- Prevent layout shift.
- Use `object-fit` intentionally.
- Do not lazy-load an above-the-fold critical hero image if doing so visibly harms first paint.
- Noncritical decorative detail can be deferred where useful.

Provide useful `alt` text only when the image conveys content.

Purely decorative images should use empty alt text:

```tsx
alt=""
```

---

# 32. Security Requirements

The login page is security-sensitive.

Never:

- log email/password pairs
- log password values
- send credentials to analytics
- put credentials in URL parameters
- store password in localStorage/sessionStorage/IndexedDB
- store API secrets in frontend environment variables
- hard-code private keys or client secrets
- inject untrusted HTML
- expose raw backend errors
- create fake authentication tokens
- implement auth purely through route guards

Frontend route guards improve UX only.

The backend must enforce authentication and authorization.

---

# 33. Browser and Password-Manager Compatibility

Do not disable normal password-manager behavior.

Use correct autocomplete:

```text
email → username
password → current-password
```

Avoid:

```text
autocomplete="off"
```

for login credentials unless there is a very specific documented requirement.

Do not block paste into the password field.

Do not intercept browser credential autofill unnecessarily.

---

# 34. Loading, Error, and State Design

Even though the API is not connected yet, structure the feature for these future states:

```text
idle
validating
submitting
authentication error
network error
rate limited
server error
success
```

Do not put all these states in a giant component if the existing form/query libraries already model them.

For now, only client-side validation should visibly operate.

---

# 35. Testing Requirements

Use the project's existing testing stack.

## 35.1 Shared `Input`

Test:

- renders label
- associates label and control
- renders leading icon
- renders trailing control
- displays error
- exposes `aria-invalid`
- forwards normal input props
- keyboard focus works

## 35.2 Shared `Button`

Test:

- renders button text
- supports submit type
- supports disabled state
- supports loading state
- prevents interaction while disabled/loading
- renders optional trailing icon

## 35.3 `LoginForm`

Test visible behavior:

- email field exists
- password field exists
- password is hidden by default
- visibility button toggles type
- empty submit shows validation
- invalid email shows validation
- password-required validation works
- Enter submits the form
- forgot-password link is present with `href="#"`
- contact-administrator link is present with `href="#"`
- clicking placeholder links does not navigate
- button is accessible
- strings come from localization when localization is enabled

## 35.4 `LoginPage`

Test:

- hero and form render on desktop
- expected semantic heading is present
- page does not require API availability to render
- mobile layout does not expose inaccessible duplicated content if hero content is hidden

## 35.5 Later API integration

When the backend is supplied, add integration tests using the repository's network mocking strategy, preferably MSW if already established.

Test:

```text
200 / success
400 / validation
401 / invalid credentials
429 / rate limit
500 / server error
network failure
timeout
duplicate-submit prevention
```

---

# 36. Avoid Overengineering

Do not create:

- Redux/Zustand auth state solely for this form unless the app already needs it.
- GraphQL code for login.
- forgot-password feature.
- registration feature.
- contact-admin feature.
- universal form-builder abstraction.
- custom HTTP library.
- new icon package if one exists.
- new CSS framework.
- login-specific global stylesheet.
- unnecessary context providers.
- a generic `AuthService` class containing unrelated future behavior.
- fake backend/mock login success in production code.

Build only what this login feature currently needs.

---

# 37. File Size and Responsibility Guidelines

Follow the existing project's file-size guidelines.

Targets:

```text
React component file:
prefer <= 200 lines

General TypeScript file:
prefer <= 250 lines

Custom hook:
prefer <= 150 lines

Function:
prefer <= 30–40 lines

React component function:
prefer <= 100–120 lines
```

These are review signals, not arbitrary hard limits.

Split by responsibility, not by line count alone.

---

# 38. Suggested Component Responsibilities

Keep responsibilities clear:

```text
LoginPage
  → page composition / layout

LoginHero
  → left-side branding and marketing presentation

LoginForm
  → login fields, validation, placeholder submit boundary

Input
  → reusable input rendering + accessible states

Button
  → reusable button behavior

login.schema.ts
  → login form validation

login.types.ts
  → REST transport types

login.api.ts
  → future REST operation only
```

Do not put everything inside `LoginPage.tsx`.

---

# 39. Implementation Sequence

Use this sequence.

## Step 1 — Inspect existing application

Before changing code:

- inspect current router
- inspect path aliases
- inspect existing Button/Input components
- inspect existing SCSS tokens/mixins
- inspect existing icon library
- inspect form libraries
- inspect validation libraries
- inspect REST client
- inspect TanStack Query setup
- inspect existing public/auth layout
- inspect existing testing setup

Do not add dependencies until this review is complete.

## Step 2 — Create/reuse global primitives

Only if missing:

```text
Button
Input
FormField (only if actually useful)
```

Implement accessibility and SCSS Modules.

## Step 3 — Create authentication feature structure

Create only required directories/files.

## Step 4 — Build `LoginHero`

Match the reference composition using approved existing assets.

## Step 5 — Build `LoginForm`

Add:

- English labels/text
- email validation
- password-required validation
- password visibility toggle
- placeholder hash links
- submit button
- OR divider

## Step 6 — Build `LoginPage`

Compose hero and form.

## Step 7 — Add responsive SCSS

Desktop → tablet → mobile.

Follow centralized breakpoints.

## Step 8 — Add route

Integrate into the existing router.

## Step 9 — Add tests

Cover reusable primitives and login behavior.

## Step 10 — Run quality checks

Run the repository's existing:

```text
typecheck
lint
tests
build
```

Fix issues without weakening rules.

---

# 40. API Integration Phase — Later

When the real REST API is provided, ask for or derive:

```text
HTTP method
endpoint path
base URL source
request body
success response
error response
authentication mechanism
cookie requirements
CSRF requirements
redirect behavior
user/session payload
MFA behavior if any
rate-limit behavior
```

Then implement:

```text
useLogin
   ↓
REST mutation
   ↓
login.api.ts
   ↓
existing REST client
```

Do not guess this contract now.

---

# 41. Acceptance Criteria

The feature is complete for the current UI-only phase when all of the following are true:

- [ ] Login page closely follows the attached reference layout.
- [ ] Desktop uses a large hero area and narrower white form area.
- [ ] Mobile remains clean and fully usable.
- [ ] Existing application architecture is preserved.
- [ ] Existing SCSS architecture is preserved.
- [ ] Existing reusable components are reused when available.
- [ ] Missing global `Button` and `Input` are created only if actually needed.
- [ ] Shared components contain no authentication business logic.
- [ ] Email field is accessible and correctly configured for autofill.
- [ ] Password field uses `current-password`.
- [ ] Password visibility toggle is keyboard/screen-reader accessible.
- [ ] Client-side validation works.
- [ ] Registration-style password complexity is not incorrectly enforced during login.
- [ ] `Forgot your password?` is an `href="#"` placeholder only.
- [ ] `Contact your administrator` is an `href="#"` placeholder only.
- [ ] Placeholder links do not navigate or execute unfinished behavior.
- [ ] Sign-in form uses a native form submit.
- [ ] No fake authentication is implemented.
- [ ] No fake REST endpoint is called.
- [ ] REST login contract is isolated and ready for later integration.
- [ ] Credentials are never persisted or logged.
- [ ] User-facing strings follow the existing localization system.
- [ ] English/French support remains compatible with the application's architecture.
- [ ] Existing design tokens are reused.
- [ ] SCSS Modules are used for component styles.
- [ ] No giant global login stylesheet is introduced.
- [ ] No arbitrary breakpoint system is introduced.
- [ ] Keyboard focus states are visible.
- [ ] Color contrast is accessible.
- [ ] Tests cover form validation and interactions.
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Production build passes.

---

# 42. AI Coding Agent Prompt

Use the following as the implementation instruction for Codex or another coding agent:

```text
Implement the login feature in this existing React + TypeScript application.

Before changing code, inspect the current project architecture, router, shared components, SCSS architecture, design tokens, mixins, icons, localization, REST client, TanStack Query setup, form/validation libraries, path aliases, and tests. Reuse existing solutions and do not create duplicates.

Match the attached login reference as closely as practical:
- large branded/industrial hero panel on the left
- white login panel on the right
- Welcome back heading and subtitle
- email field with mail icon
- password field with lock icon and accessible show/hide-password button
- Forgot your password? right-aligned below the password field
- full-width blue Sign in button with right arrow
- OR divider
- Don't have an account? Contact your administrator
- preserve generous whitespace and the approximately 60/40 desktop split

Follow the existing feature-first architecture:
- authentication workflow under src/features/authentication
- low-level auth infrastructure under src/infrastructure/auth
- REST infrastructure under src/infrastructure/api/rest
- global reusable UI under src/shared/components

Create global reusable Button and Input components only if suitable equivalents do not already exist. They must be generic, typed, accessible, use SCSS Modules, use existing design tokens, and must not depend on authentication feature code.

Create a FormField only if it provides a real reusable responsibility and is not redundant with Input.

Use REST for login, not GraphQL.

The backend API is NOT available yet.
Do not invent an endpoint.
Do not perform a fake login.
Do not create/store fake tokens.
Do not redirect as if authentication succeeded.
Do not wire the form to a function that throws a visible "not configured" error.

For the current phase:
1. Render the login UI.
2. Implement client-side validation.
3. Add an explicit TODO integration boundary for the later REST API.
4. Create REST request/response type placeholders without inventing the final response contract.

Validation:
- email is required and must be a valid email
- password is required
- do not enforce registration-style password complexity during login

Email input:
- type=email
- autocomplete=username
- inputMode=email
- autoCapitalize=none
- spellCheck=false

Password input:
- autocomplete=current-password
- hidden by default
- accessible show/hide control
- do not block paste
- never log or persist the password

Keep these exact features as nonfunctional hash links:
- Forgot your password?
- Contact your administrator

Use href="#" for both and prevent default navigation. Do not implement their features.

Use the existing localization approach. Do not hard-code user-facing text if localization is already enabled. Keep compatibility with English and French.

Use existing icon infrastructure for globe, email, lock, eye/eye-off, and arrow-right. Do not add another icon package if one already exists.

Styling:
- follow existing SCSS architecture
- use ComponentName.module.scss
- reuse existing spacing/color/typography/radius/breakpoint tokens
- use CSS variables for theme-dependent colors
- no large global login stylesheet
- no !important unless absolutely required and documented
- nesting <= 3 levels
- mobile-first responsive behavior
- keep the login form usable on small screens
- hero imagery/details may be reduced or hidden on mobile

Accessibility:
- semantic form
- real labels
- visible focus
- aria-invalid / aria-describedby for errors
- real button for password visibility
- real submit button
- appropriate accessible names
- sufficient contrast
- reduced-motion support

Security:
- no credentials in logs, URLs, localStorage, sessionStorage, IndexedDB, analytics, or telemetry
- no frontend secrets
- no dangerouslySetInnerHTML
- no fake authorization
- backend will remain the real security boundary

Testing:
- use the repository's existing testing stack
- test email/password validation
- test password visibility
- test native form submission behavior
- test placeholder hash links
- test shared Input/Button accessibility states
- keep the page renderable without a backend

Do not refactor unrelated code.
Do not rewrite the application's architecture.
Do not add dependencies without first checking whether the repository already has an equivalent solution.

After implementation run the existing typecheck, lint, tests, and production build and fix any issues.
```

---

# 43. Final Engineering Rule

The login feature should feel native to the existing application rather than like a separate template pasted into it.

Use the screenshot for:

```text
layout
hierarchy
spacing
interaction placement
visual direction
responsive intent
```

Use the existing repository for:

```text
architecture
components
tokens
styles
icons
routing
REST infrastructure
testing
naming
security conventions
```

When these conflict, preserve the repository's established architecture and design-system conventions while keeping the reference page's overall user experience.
