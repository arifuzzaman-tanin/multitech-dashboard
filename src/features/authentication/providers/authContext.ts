import { createContext } from 'react'
import type { AuthSessionResponse, AuthUser, LoginRequest, RegisterRequest } from '../api/rest/auth.types'

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

export interface AuthState {
  accessToken: string | null
  accessTokenExpiresAtUtc: string | null
  status: AuthStatus
  user: AuthUser | null
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  login: (request: LoginRequest) => Promise<AuthUser>
  logout: () => Promise<void>
  register: (request: RegisterRequest) => Promise<AuthUser>
}

export const initialAuthState: AuthState = {
  accessToken: null,
  accessTokenExpiresAtUtc: null,
  status: 'loading',
  user: null,
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export let refreshPromise: Promise<AuthSessionResponse> | null = null

export function setRefreshPromise(promise: Promise<AuthSessionResponse> | null) {
  refreshPromise = promise
}
