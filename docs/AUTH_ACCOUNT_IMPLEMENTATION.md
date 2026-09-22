# MultiTech.Platform React Authentication and Account Creation Implementation Guide

> Use this file as the implementation prompt/specification for the AI coding agent.
>
> Scope: existing React application only. Follow the React application's current architecture, folder structure, state management, routing, API client, styling system, form patterns, validation approach, and test conventions.

## 1. Objective

Implement user authentication and account creation in the existing React application.

The feature must support:

- Account creation.
- Login.
- Logout.
- Session restore on app load.
- Access-token refresh.
- Current-user loading.
- Authenticated route protection.
- Guest-only route protection for login and account creation pages.

Do not redesign the React application. Add the feature using the patterns already present in the codebase.

## 2. Required First Step for the AI Agent

Before changing code:

1. Inspect the existing React application structure.
2. Identify the framework in use, such as Vite, Next.js, CRA, Remix, or another setup.
3. Identify the language in use, such as TypeScript or JavaScript.
4. Identify existing routing, layouts, API client, query/cache layer, state management, forms, validation, design system, notification/toast handling, and test setup.
5. Reuse existing shared components, hooks, services, constants, utilities, error handling, and environment configuration.
6. Do not add duplicate API clients, duplicate auth stores, duplicate route guards, or duplicate validation helpers if equivalents already exist.
7. Do not introduce a new state management, form, validation, UI, or request library unless the application already uses it or there is no existing suitable pattern.
8. Run existing tests before implementation when possible.

If the current workspace does not contain the React app, stop and ask for the React application path before implementing code.

## 3. Backend API Contract

Use the existing `MultiTech.Platform` authentication API.

Base route:

```text
/api/v1/auth
```

Endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

The API uses:

- A JWT access token returned in the JSON body.
- An HttpOnly refresh-token cookie named `__Host-multitech-refresh`.
- A secure refresh cookie scoped to `/api/v1/auth`.

The frontend must not read, store, or manually manage the refresh token. The browser manages the refresh cookie.

## 4. Request and Response Shapes

### Register

Request:

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "company": "Acme Manufacturing",
  "password": "StrongPassword123!"
}
```

Successful response: `201 Created`

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "company": "Acme Manufacturing"
}
```

### Login

Request:

```json
{
  "email": "john.smith@example.com",
  "password": "StrongPassword123!"
}
```

Successful response: `200 OK`

```json
{
  "accessToken": "jwt-access-token",
  "accessTokenExpiresAtUtc": "2026-09-22T12:00:00+00:00",
  "user": {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "company": "Acme Manufacturing"
  }
}
```

### Refresh

Request:

```text
POST /api/v1/auth/refresh
```

No request body is required. The browser must include credentials so the HttpOnly refresh cookie is sent.

Successful response: `200 OK`

```json
{
  "accessToken": "new-jwt-access-token",
  "accessTokenExpiresAtUtc": "2026-09-22T12:15:00+00:00",
  "user": {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "company": "Acme Manufacturing"
  }
}
```

### Logout

Request:

```text
POST /api/v1/auth/logout
```

Successful response: `204 No Content`

Clear local authentication state after this call, even if the server returns an expected unauthenticated response.

### Current User

Request:

```text
GET /api/v1/auth/me
```

Successful response: `200 OK`

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "company": "Acme Manufacturing"
}
```

## 5. Auth State Requirements

Store only the minimum auth state needed by the UI:

- `accessToken`
- `accessTokenExpiresAtUtc`
- `user`
- loading/session restoration status
- authentication status

Do not store:

- refresh tokens
- passwords
- password hashes
- raw authorization headers
- secrets

Prefer in-memory access-token storage unless the existing application already has a deliberate secure token-storage pattern. If persistent storage is used by existing architecture, follow that pattern and document the tradeoff in code comments only where needed.

## 6. API Client Requirements

Integrate with the existing API client.

The implementation must:

- Send `Authorization: Bearer {accessToken}` for authenticated requests.
- Send credentials for auth requests that rely on cookies.
- Use `credentials: "include"` for `fetch`, or `withCredentials: true` for Axios, where refresh-cookie behavior is required.
- Centralize token attachment in the existing request layer.
- Centralize handling of `401 Unauthorized`.
- Attempt one refresh after an access-token expiration or a single `401`.
- Retry the original request once after a successful refresh.
- Avoid infinite refresh loops.
- Clear auth state and redirect to login when refresh fails.
- Preserve existing API error parsing and notification patterns.

Do not scatter token logic across individual components.

## 7. Routes and Screens

Add or connect routes according to the existing router conventions.

Expected screens:

- Login.
- Create account.
- Account/profile summary or an existing dashboard entry point after successful login.

Expected route behavior:

- Authenticated users should not remain on login or account creation pages.
- Unauthenticated users should not access protected application pages.
- After login, redirect to the originally requested protected route when available.
- After account creation, either send the user to login or automatically log in only if the product requirements and backend contract support that flow. The current register endpoint returns user details, not an access token, so the default behavior should be redirecting to login with a success message.
- After logout, redirect to login or the application's public landing route.

Use existing route names and URL conventions. If the app already has route constants, add to those constants instead of hard-coding paths throughout the code.

## 8. Form Requirements

### Create Account Form

Fields:

- `name`
- `email`
- `company`
- `password`
- optional `confirmPassword` for client-side confirmation only

Validation:

- `name` is required.
- `email` is required and must look like an email address.
- `company` is required.
- `password` is required.
- `password` must be at least 8 characters.
- `password` must not exceed 128 characters.
- `confirmPassword`, if present, must match `password`.

Do not send `confirmPassword` to the API.

### Login Form

Fields:

- `email`
- `password`

Validation:

- `email` is required and must look like an email address.
- `password` is required.

Use the application's existing validation library and form components.

## 9. User Experience Requirements

The implementation must:

- Show loading state during submit.
- Prevent duplicate submissions.
- Show field-level validation errors.
- Show server validation and authentication errors using the existing error display pattern.
- Preserve entered email on login failure.
- Clear password fields after failed submit when appropriate.
- Provide accessible labels, error text, focus states, and keyboard submission.
- Avoid leaking whether an email exists beyond the server's returned message.
- Keep UI styling consistent with the existing app.

Do not create a marketing-style auth page unless the existing app already uses that style.

## 10. Error Handling

Respect the backend's problem-details style responses if present.

Map common outcomes:

- `400` or validation problem: show validation messages.
- `401`: show invalid credentials or restore session through refresh if this happened on an authenticated request.
- `409`: show account already exists or equivalent server message.
- `429`: show a rate-limit message and avoid automatic rapid retries.
- network failure: show a retry-friendly generic message.

Do not show raw stack traces, exception details, tokens, or sensitive server internals.

## 11. Environment Configuration

Use the existing environment configuration pattern for the API base URL.

Examples:

```text
VITE_API_BASE_URL
NEXT_PUBLIC_API_BASE_URL
REACT_APP_API_BASE_URL
```

Pick the variable convention already used by the app. Do not hard-code localhost URLs in production code.

If local development uses HTTPS for the backend, preserve that requirement because the refresh cookie is marked `Secure`.

## 12. Security Requirements

The frontend must:

- Never store the refresh token.
- Never log access tokens, passwords, refresh-cookie values, or authentication headers.
- Never send passwords through query strings.
- Never keep password values in global state.
- Never expose protected pages based only on hidden UI controls.
- Treat server authorization as authoritative.
- Use the existing CSRF strategy if the app already has one.

The frontend cannot replace backend authorization. Route guards are user-experience helpers, not security boundaries.

## 13. Testing Requirements

Add or update tests according to the existing test setup.

Cover the highest-value behavior:

- Login submits the expected payload.
- Register submits `name`, `email`, `company`, and `password` only.
- `confirmPassword` is validated locally and is not sent.
- Successful login stores auth state and redirects.
- Logout clears auth state.
- Protected routes redirect unauthenticated users.
- Guest-only routes redirect authenticated users.
- A `401` can trigger a single refresh and retry.
- Failed refresh clears auth state.

Use existing test helpers, mock server setup, fixtures, and render utilities.

## 14. Implementation Checklist

Before finishing:

1. The React app builds successfully.
2. Existing tests pass.
3. New auth tests pass.
4. Linting and formatting pass.
5. No tokens, passwords, cookies, or secrets are logged.
6. No duplicate auth/API architecture was introduced.
7. Refresh-token handling relies on the HttpOnly cookie.
8. Route protection follows existing router conventions.
9. UI follows existing components and styling.
10. The implementation works after a browser refresh by restoring the session through `/api/v1/auth/refresh` or `/api/v1/auth/me`, depending on the app's established auth flow.

## 15. Out of Scope

Do not implement these unless explicitly requested:

- Password reset.
- Email verification.
- Social login.
- Multi-factor authentication.
- Organization invitations.
- Role and permission management UI.
- Tenant or workspace management.
- Backend changes.
- Database changes.

