import type { NavigationItem } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import styles from './Sidebar.module.scss'

interface SidebarNavItemProps {
  item: NavigationItem
  currentPath: string
  onNavigate?: () => void
}

export function SidebarNavItem({
  currentPath,
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

  return (
    <li>
      {item.path && !item.disabled ? (
        <a
          aria-current={isActive ? 'page' : undefined}
          className={itemClasses}
          href={item.path}
          onClick={onNavigate}
        >
          {content}
        </a>
      ) : (
        <span className={itemClasses} aria-disabled={item.disabled || undefined}>
          {content}
        </span>
      )}
    </li>
  )
}
