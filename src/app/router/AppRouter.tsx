import { useEffect, useState } from 'react'
import { LoginPage, RegistrationPage } from '@/features/authentication'
import { DashboardUnavailablePage } from '@/features/dashboard'
import { OverviewPage } from '@/features/overview'
import { dashboardPaths, navigationItems } from '@/app/config/navigation'
import { AppShell } from '@/app/layout/AppShell'

const overviewPath = '/dashboard'

export function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (nextPath: string) => {
    if (nextPath === path) {
      return
    }

    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  if (dashboardPaths.has(path)) {
    const activeItem = navigationItems.find((item) => item.path === path)
    const isOverviewPath = path === overviewPath

    return (
      <AppShell currentPath={path} onNavigate={navigate}>
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

  if (path === '/register') {
    return <RegistrationPage />
  }

  return <LoginPage />
}
