import type { LoginRequest, LoginResponse } from './login.types'

export type LoginOperation = (request: LoginRequest) => Promise<LoginResponse>

// TODO: Implement LoginOperation with the shared REST client once the API contract exists.
