import type { NavIconName } from '@/shared/components/navigation/icons'

export interface NavigationItem {
  id: string
  label: string
  path?: string
  icon: NavIconName
  badge?: number | string
  children?: NavigationItem[]
  disabled?: boolean
}

export interface NavbarSelectorOption {
  label: string
  value: string
}

export interface NavbarSelectorConfig {
  id: string
  ariaLabel: string
  value: string
  icon: NavIconName
  options: NavbarSelectorOption[]
}

export type EnvironmentStatus = 'production' | 'staging' | 'development'

export interface NavbarUser {
  name: string
  role: string
  initials: string
}

export const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', path: '/dashboard', icon: 'activity' },
  { id: 'fleet', label: 'Fleet', path: '/fleet', icon: 'fleet' },
  {
    id: 'gateways',
    label: 'Gateways',
    path: '/gateways',
    icon: 'gateway',
    children: [
      { id: 'gateway-inventory', label: 'Inventory', path: '/gateways', icon: 'gateway' },
      { id: 'gateway-health', label: 'Health', path: '/diagnostics', icon: 'activity' },
    ],
  },
  { id: 'sensors', label: 'Sensors', path: '/sensors', icon: 'chip' },
  { id: 'topology', label: 'Topology', path: '/topology', icon: 'topology' },
  { id: 'alerts', label: 'Alerts', path: '/alerts', icon: 'alert', badge: 23 },
  { id: 'organizations', label: 'Organizations', path: '/organizations', icon: 'organization' },
  { id: 'diagnostics', label: 'Diagnostics', path: '/diagnostics', icon: 'network' },
  { id: 'firmware', label: 'Firmware', path: '/firmware', icon: 'chip' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'analytics' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'settings' },
]

export const navbarSelectors: NavbarSelectorConfig[] = [
  {
    id: 'organization',
    ariaLabel: 'Select operations group',
    value: 'Global Operations',
    icon: 'globe',
    options: [
      { label: 'Global Operations', value: 'global-operations' },
      { label: 'North America', value: 'north-america' },
      { label: 'Field Services', value: 'field-services' },
    ],
  },
  {
    id: 'site',
    ariaLabel: 'Select location',
    value: 'All Sites',
    icon: 'building',
    options: [
      { label: 'All Sites', value: 'all-sites' },
      { label: 'Factory Floor', value: 'factory-floor' },
      { label: 'Distribution Yard', value: 'distribution-yard' },
    ],
  },
]

export const environmentStatus: EnvironmentStatus = 'production'

export const notificationCount = 1

export const navbarUser: NavbarUser = {
  name: 'Jessica Davis',
  role: 'Super Admin',
  initials: 'JD',
}

export const dashboardPaths = new Set(
  navigationItems.flatMap((item) => [
    item.path,
    ...(item.children?.map((child) => child.path) ?? []),
  ]).filter((path): path is string => Boolean(path)),
)
