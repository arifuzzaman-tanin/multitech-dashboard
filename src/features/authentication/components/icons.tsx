interface IconProps { size?: number }

const commonProps = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 }

export function MailIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><rect height="16" rx="2" width="20" x="2" y="4" /><path d="m3 6 9 7 9-7" /></svg>
}

export function LockIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><rect height="12" rx="2" width="16" x="4" y="9" /><path d="M8 9V6a4 4 0 0 1 8 0v3M12 14v2" /></svg>
}

export function EyeIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
}

export function EyeOffIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><path d="m3 3 18 18M10.7 6.1A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.1 2.8M6.4 6.4C3.8 8.2 2.5 12 2.5 12s3.5 6 9.5 6a9 9 0 0 0 3-.5M10.2 10.2a2.5 2.5 0 0 0 3.6 3.6" /></svg>
}

export function ArrowRightIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><path d="M5 12h14M14 7l5 5-5 5" /></svg>
}

export function IndustrialSensorIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><rect height="12" rx="2" width="9" x="3" y="6" /><path d="M6 10h3M6 14h3M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" /></svg>
}

export function EdgeDeviceIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><rect height="12" rx="2" width="16" x="4" y="8" /><path d="M8 12h.01M8 16h.01M12 12h4M12 16h4M12 8V4M9 4h6" /></svg>
}

export function DataCloudIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 8.6 4.8 4.8 0 0 0 7 18Z" /><path d="M9 14h6M11 11l-2 3 2 3M13 11l2 3-2 3" /></svg>
}

export function DashboardIcon({ size = 22 }: IconProps) {
  return <svg {...commonProps} aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}><rect height="14" rx="2" width="20" x="2" y="3" /><path d="M8 21h8M12 17v4M6 13l3-3 3 2 4-5 2 2" /></svg>
}
