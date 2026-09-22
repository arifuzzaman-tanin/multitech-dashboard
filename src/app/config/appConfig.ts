export interface AppConfig {
  appName: string
  appDescription: string
  apiBaseUrl: string
}

export const appConfig: AppConfig = {
  appName: 'MultiTech Dashboard',
  appDescription: 'Operational dashboard for multi-technology system monitoring.',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
}
