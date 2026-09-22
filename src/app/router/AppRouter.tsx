import { useCallback, useEffect, useState } from 'react'
import { LoginPage, RegistrationPage, useAuth } from '@/features/authentication'
import { DashboardUnavailablePage } from '@/features/dashboard'
import { OverviewPage } from '@/features/overview'
import { appConfig } from '@/app/config/appConfig'
import { dashboardPaths, navigationItems } from '@/app/config/navigation'
import { AppShell } from '@/app/layout/AppShell'
import { AppLoadingScreen } from '@/shared/components/feedback/AppLoadingScreen'

const overviewPath = '/dashboard'
const loginPath = '/'
const registerPath = '/register'

interface CurrentLocation {
  path: string
  search: string
}

export function AppRouter() {
  const { isAuthenticated, logout, status } = useAuth()
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(() => getCurrentLocation())
  const { path, search } = currentLocation

  useEffect(() => {
    const handlePopState = () => {
      setCurrentLocation(getCurrentLocation())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    document.title = getPageTitle(path)
  }, [path])

  const navigate = useCallback((nextPath: string, options: { replace?: boolean } = {}) => {
    const nextUrl = new URL(nextPath, window.location.origin)
    const normalizedPath = `${nextUrl.pathname}${nextUrl.search}`
    const currentUrl = `${path}${search}`

    if (normalizedPath === currentUrl) {
      return
    }

    if (options.replace) {
      window.history.replaceState(null, '', normalizedPath)
    } else {
      window.history.pushState(null, '', normalizedPath)
    }

    setCurrentLocation(getCurrentLocation())
  }, [path, search])

  const handleLogout = async () => {
    await logout()
    navigate(loginPath, { replace: true })
  }

  if (status === 'loading') {
    return <AppLoadingScreen />
  }

  if (dashboardPaths.has(path)) {
    if (!isAuthenticated) {
      return (
        <Redirect
          onNavigate={navigate}
          path={`${loginPath}?redirect=${encodeURIComponent(path)}`}
        />
      )
    }

    const activeItem = navigationItems.find((item) => item.path === path)
    const isOverviewPath = path === overviewPath

    return (
      <AppShell currentPath={path} onLogout={handleLogout} onNavigate={navigate}>
        {isOverviewPath ? (
          <OverviewPage />
        ) : (
          <DashboardUnavailablePage
            sectionLabel={activeItem?.label ?? 'Dashboard'}
            onVisitOverview={() => navigate(overviewPath)}
          />
        )}
      </AppShell>
    )
  }

  if (path === registerPath) {
    if (isAuthenticated) {
      return <Redirect onNavigate={navigate} path={overviewPath} />
    }

    return (
      <RegistrationPage
        onRegistrationSuccess={(email) => {
          navigate(`${loginPath}?registered=1&email=${encodeURIComponent(email)}`, { replace: true })
        }}
      />
    )
  }

  if (isAuthenticated) {
    return <Redirect onNavigate={navigate} path={overviewPath} />
  }

  return (
    <LoginPage
      onLoginSuccess={() => {
        const redirectPath = getSafeRedirectPath(search)
        navigate(redirectPath, { replace: true })
      }}
    />
  )
}

function getCurrentLocation(): CurrentLocation {
  return {
    path: window.location.pathname,
    search: window.location.search,
  }
}

function getSafeRedirectPath(search: string) {
  const redirectPath = new URLSearchParams(search).get('redirect')

  if (redirectPath && dashboardPaths.has(redirectPath)) {
    return redirectPath
  }

  return overviewPath
}

function getPageTitle(path: string) {
  const titlePrefix = getPageTitlePrefix(path)

  return titlePrefix ? `${titlePrefix} | ${appConfig.appName}` : appConfig.appName
}

function getPageTitlePrefix(path: string) {
  if (path === loginPath) {
    return 'Sign in'
  }

  if (path === registerPath) {
    return 'Create account'
  }

  return navigationItems.find((item) => item.path === path)?.label ?? null
}

interface RedirectProps {
  onNavigate: (path: string, options?: { replace?: boolean }) => void
  path: string
}

function Redirect({ onNavigate, path }: RedirectProps) {
  useEffect(() => {
    onNavigate(path, { replace: true })
  }, [onNavigate, path])

  return null
}
