import { LoginPage } from '@/features/authentication'
import { DashboardPage } from '@/features/dashboard'

export function AppRouter() {
  const path = window.location.pathname

  if (path === '/dashboard') {
    return <DashboardPage />
  }

  return <LoginPage />
}
