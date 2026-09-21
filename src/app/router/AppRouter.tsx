import { LoginPage, RegistrationPage } from '@/features/authentication'
import { OverviewPage } from '@/features/overview'
import { dashboardPaths } from '@/app/config/navigation'
import { AppShell } from '@/app/layout/AppShell'

export function AppRouter() {
  const path = window.location.pathname

  if (dashboardPaths.has(path)) {
    return (
      <AppShell currentPath={path}>
        <OverviewPage />
      </AppShell>
    )
  }

  if (path === '/register') {
    return <RegistrationPage />
  }

  return <LoginPage />
}
