import { LoginPage, RegistrationPage } from '@/features/authentication'
import { DashboardPage } from '@/features/dashboard'
import { dashboardPaths } from '@/app/config/navigation'
import { AppShell } from '@/app/layout/AppShell'

export function AppRouter() {
  const path = window.location.pathname

  if (dashboardPaths.has(path)) {
    return (
      <AppShell currentPath={path}>
        <DashboardPage />
      </AppShell>
    )
  }

  if (path === '/register') {
    return <RegistrationPage />
  }

  return <LoginPage />
}
