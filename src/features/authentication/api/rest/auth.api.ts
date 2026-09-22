import { apiRequest } from '@/shared/api/apiClient'
import type { AuthSessionResponse, AuthUser, LoginRequest, RegisterRequest, RegisterResponse } from './auth.types'

const authBasePath = '/api/v1/auth'

export function registerAccount(request: RegisterRequest) {
  return apiRequest<RegisterResponse>(`${authBasePath}/register`, {
    body: request,
    isAuthRequest: true,
    method: 'POST',
    retryOnUnauthorized: false,
  })
}

export function login(request: LoginRequest) {
  return apiRequest<AuthSessionResponse>(`${authBasePath}/login`, {
    body: request,
    isAuthRequest: true,
    method: 'POST',
    retryOnUnauthorized: false,
  })
}

export function refreshSession() {
  return apiRequest<AuthSessionResponse>(`${authBasePath}/refresh`, {
    isAuthRequest: true,
    method: 'POST',
    retryOnUnauthorized: false,
  })
}

export function logout() {
  return apiRequest<void>(`${authBasePath}/logout`, {
    isAuthRequest: true,
    method: 'POST',
    retryOnUnauthorized: false,
  })
}

export function getCurrentUser() {
  return apiRequest<AuthUser>(`${authBasePath}/me`)
}
