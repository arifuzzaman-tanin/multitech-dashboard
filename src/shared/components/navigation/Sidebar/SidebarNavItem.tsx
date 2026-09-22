import type { MouseEvent } from 'react'
import type { NavigationItem } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import styles from './Sidebar.module.scss'

interface SidebarNavItemProps {
  item: NavigationItem
  currentPath: string
  isCollapsed?: boolean
  onNavigate?: (path: string) => void
}

export function SidebarNavItem({
  currentPath,
  isCollapsed = false,
  item,
  onNavigate,
}: SidebarNavItemProps) {
  const isActive = item.path === currentPath
  const itemClasses = [
    styles.navItem,
    isActive ? styles.active : '',
    item.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span className={styles.navIcon}>
        <NavIcon name={item.icon} />
      </span>
      <span className={styles.navLabel}>{item.label}</span>
      {item.badge && <span className={styles.badge}>{item.badge}</span>}
    </>
  )

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!item.path) {
      return
    }

    event.preventDefault()
    onNavigate?.(item.path)
  }

  return (
    <li>
      {item.path && !item.disabled ? (
        <a
          aria-label={isCollapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
          className={itemClasses}
          href={item.path}
          onClick={handleClick}
          title={isCollapsed ? item.label : undefined}
        >
          {content}
        </a>
      ) : (
        <span
          aria-disabled={item.disabled || undefined}
          aria-label={isCollapsed ? item.label : undefined}
          className={itemClasses}
          title={isCollapsed ? item.label : undefined}
        >
          {content}
        </span>
      )}
    </li>
  )
}
