import type { ReactElement, SVGProps } from 'react'
import type { OverviewIconName } from '../types/overview.types'

interface OverviewIconProps extends SVGProps<SVGSVGElement> {
  name: OverviewIconName
  size?: number
}

const paths: Record<OverviewIconName, ReactElement> = {
  air: <path d="M4 8h9a3 3 0 1 0-3-3M4 13h13a3 3 0 1 1-3 3M4 18h6" />,
  alert: <path d="M12 4 3.5 19h17L12 4ZM12 9v4M12 16h.01" />,
  bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />,
  cellular: <path d="M12 20h.01M7.8 16.2a6 6 0 0 1 8.4 0M5 12.9a10 10 0 0 1 14 0M2.5 9.4a14 14 0 0 1 19 0" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 12.2 3 3 0 0 0 7 18Z" />,
  database: <path d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3Zm0 0v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />,
  device: <path d="M7 3h10v18H7zM10 6h4M10 18h4M3 8h4M3 16h4M17 8h4M17 16h4" />,
  door: <path d="M7 21V4a1 1 0 0 1 1-1h9v18M7 21h12M11 12h.01" />,
  droplets: <path d="M7 14a4 4 0 0 0 8 0c0-3-4-8-4-8s-4 5-4 8ZM16 16a3 3 0 0 0 6 0c0-2.2-3-6-3-6s-3 3.8-3 6Z" />,
  ethernet: <path d="M7 16v-4h10v4M12 12V8M9 4h6v4H9zM4 16h6v4H4zM14 16h6v4h-6z" />,
  factory: <path d="M3 21V9l5 3V9l5 3V5h8v16H3ZM7 17h.01M11 17h.01M15 17h.01" />,
  flow: <path d="M4 7h9a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h11M17 4l3 3-3 3M7 16l-3 3 3 3" />,
  gauge: <path d="M4 14a8 8 0 1 1 16 0M5 18h14M12 14l4-4M8 14h.01M16 14h.01" />,
  gateway: <path d="M5 10h14v8H5zM8 14h.01M12 14h4M9 10V6h6v4M7 6h10" />,
  level: <path d="M5 20V4M19 20V4M8 17h8M8 12h8M8 7h8" />,
  location: <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  lora: <path d="M12 19V9M8.5 12.5a5 5 0 0 1 7 0M6 15a8 8 0 0 1 12 0M3.5 17.5a12 12 0 0 1 17 0M12 5h.01" />,
  organization: <path d="M4 21V7l8-4 8 4v14M8 21v-6h8v6M8 10h.01M12 10h.01M16 10h.01" />,
  occupancy: <path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a3 3 0 0 0-2-2.8M18 4a3 3 0 0 1 0 5.8" />,
  sensor: <path d="M12 5v4M12 15v4M5 12h4M15 12h4M8 8l2.8 2.8M13.2 13.2 16 16M16 8l-2.8 2.8M10.8 13.2 8 16" />,
  signal: <path d="M5 19v-4M9 19v-7M13 19V9M17 19V5M21 19V3" />,
  thermometer: <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0ZM12 8v7" />,
  vibration: <path d="M10 8h4v8h-4zM4 10v4M7 7v10M17 7v10M20 10v4" />,
  wifi: <path d="M5 10a11 11 0 0 1 14 0M8.5 13.5a6 6 0 0 1 7 0M12 18h.01" />,
}

export function OverviewIcon({
  name,
  size = 24,
  strokeWidth = 1.9,
  ...svgProps
}: OverviewIconProps) {
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
      {paths[name]}
    </svg>
  )
}
