import type { ReactElement, SVGProps } from 'react'

export type NavIconName =
  | 'activity'
  | 'alert'
  | 'analytics'
  | 'bell'
  | 'building'
  | 'chevronDown'
  | 'chip'
  | 'filter'
  | 'fleet'
  | 'gateway'
  | 'globe'
  | 'help'
  | 'menu'
  | 'network'
  | 'organization'
  | 'search'
  | 'settings'
  | 'sidebarCollapse'
  | 'sidebarExpand'
  | 'topology'
  | 'x'

interface NavIconProps extends SVGProps<SVGSVGElement> {
  name: NavIconName
  size?: number
}

const iconPaths: Record<NavIconName, ReactElement> = {
  activity: <path d="M4 13h4l2-7 4 12 2-5h4" />,
  alert: <path d="M12 4 3.5 19h17L12 4ZM12 9v4M12 16h.01" />,
  analytics: <path d="M4 19V5M8 19v-7M12 19V8M16 19v-4M20 19V9" />,
  bell: <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
  building: <path d="M4 20h16M6 20V5a1 1 0 0 1 1-1h7v16M14 9h3a1 1 0 0 1 1 1v10M9 8h2M9 12h2M9 16h2" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chip: <path d="M8 3v3M12 3v3M16 3v3M8 18v3M12 18v3M16 18v3M3 8h3M3 12h3M3 16h3M18 8h3M18 12h3M18 16h3" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  fleet: <path d="M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M3 17h2M9 17h6M19 17h2M5 13V7a2 2 0 0 1 2-2h5v8M12 8h4l3 4v1h-7" />,
  gateway: <path d="M5 9h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9ZM8 13h.01M12 13h4M9 9V5h6v4M7 5h10" />,
  globe: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9" />,
  help: <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.3-1.8 2.8M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  network: <path d="M12 5v5M12 14v5M5 19h14M5 5h14M8 10h8v4H8zM6 5v14M18 5v14" />,
  organization: <path d="M8 20v-6h8v6M5 20V8l7-4 7 4v12M9 10h.01M12 10h.01M15 10h.01" />,
  search: <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />,
  settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 5 15a1.7 1.7 0 0 0-1.6-1H3v-3h.4A1.7 1.7 0 0 0 5 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h3v.7a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19 10a1.7 1.7 0 0 0 1.6 1h.4v3h-.4a1.7 1.7 0 0 0-1.2 1Z" />,
  sidebarCollapse: <path d="M4 5h16v14H4zM9 5v14M15 9l-3 3 3 3" />,
  sidebarExpand: <path d="M4 5h16v14H4zM9 5v14M12 9l3 3-3 3" />,
  topology: <path d="M12 5a3 3 0 1 0 0 .01M6 19a3 3 0 1 0 0 .01M18 19a3 3 0 1 0 0 .01M10.2 7.4 7.8 16.1M13.8 7.4l2.4 8.7M8.8 19h6.4" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
}

export function NavIcon({
  name,
  size = 20,
  strokeWidth = 1.9,
  ...svgProps
}: NavIconProps) {
  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  )
}
