import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { configureApiAuth } from '@/shared/api/apiClient'
import { login, logout, refreshSession, registerAccount } from '../api/rest/auth.api'
import type { AuthSessionResponse, LoginRequest, RegisterRequest } from '../api/rest/auth.types'
import { AuthContext, initialAuthState, refreshPromise, setRefreshPromise, type AuthContextValue, type AuthState } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState)
  const authStateRef = useRef(authState)

  useEffect(() => {
    authStateRef.current = authState
  }, [authState])

  const applySession = useCallback((session: AuthSessionResponse) => {
    setAuthState({
      accessToken: session.accessToken,
      accessTokenExpiresAtUtc: session.accessTokenExpiresAtUtc,
      status: 'authenticated',
      user: session.user,
    })
  }, [])

  const clearSession = useCallback(() => {
    setAuthState({
      accessToken: null,
      accessTokenExpiresAtUtc: null,
      status: 'guest',
      user: null,
    })
  }, [])

  const refreshAuthSession = useCallback(async () => {
    const activeRefreshPromise = refreshPromise ?? refreshSession().finally(() => {
      setRefreshPromise(null)
    })

    setRefreshPromise(activeRefreshPromise)
    const session = await activeRefreshPromise
    applySession(session)

    return session
  }, [applySession])

  useEffect(() => {
    configureApiAuth({
      getAccessToken: () => authStateRef.current.accessToken,
      onUnauthorized: async () => {
        try {
          const session = await refreshAuthSession()

          return session.accessToken
        } catch {
          clearSession()

          return null
        }
      },
    })

    return () => {
      configureApiAuth(null)
    }
  }, [clearSession, refreshAuthSession])

  useEffect(() => {
    let isActive = true

    const restoreSession = async () => {
      try {
        const session = await refreshAuthSession()

        if (!isActive) {
          return
        }

        applySession(session)
      } catch {
        if (!isActive) {
          return
        }

        clearSession()
      }
    }

    void restoreSession()

    return () => {
      isActive = false
    }
  }, [applySession, clearSession, refreshAuthSession])

  const handleLogin = useCallback(async (request: LoginRequest) => {
    const session = await login({
      email: request.email.trim(),
      password: request.password,
    })

    applySession(session)

    return session.user
  }, [applySession])

  const handleRegister = useCallback(async (request: RegisterRequest) => {
    return registerAccount({
      company: request.company.trim(),
      email: request.email.trim(),
      name: request.name.trim(),
      password: request.password,
    })
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } catch {
      // Local auth state is still cleared because logout may fail after the server has already expired the session.
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(() => ({
    ...authState,
    isAuthenticated: authState.status === 'authenticated',
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  }), [authState, handleLogin, handleLogout, handleRegister])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
