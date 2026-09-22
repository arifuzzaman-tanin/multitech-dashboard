import { StrictMode, type ReactNode } from 'react'
import { AuthProvider } from '@/features/authentication'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <AuthProvider>{children}</AuthProvider>
    </StrictMode>
  )
}
