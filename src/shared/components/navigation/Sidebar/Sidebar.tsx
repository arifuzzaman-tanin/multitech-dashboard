import { navigationItems } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import { SidebarNavItem } from './SidebarNavItem'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  currentPath: string
  isCollapsed?: boolean
  isOpen?: boolean
  onCollapsedChange?: () => void
  onClose?: () => void
  onNavigate?: (path: string) => void
}

export function Sidebar({
  currentPath,
  isCollapsed = false,
  isOpen = false,
  onCollapsedChange,
  onClose,
  onNavigate,
}: SidebarProps) {
  const sidebarClasses = [
    styles.sidebar,
    isCollapsed ? styles.collapsed : '',
    isOpen ? styles.open : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div
        aria-hidden="true"
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      <aside aria-label="Primary navigation" className={sidebarClasses}>
        <div className={styles.header}>
          <button
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-pressed={isCollapsed}
            className={styles.collapseButton}
            onClick={onCollapsedChange}
            type="button"
          >
            <NavIcon name={isCollapsed ? 'sidebarExpand' : 'sidebarCollapse'} size={20} />
          </button>
          <button
            aria-label="Close navigation"
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <NavIcon name="x" size={20} />
          </button>
        </div>

        <nav aria-label="Main menu" className={styles.nav}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <SidebarNavItem
                currentPath={currentPath}
                isCollapsed={isCollapsed}
                item={item}
                key={item.id}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
