import multitechLogoUrl from '@/assets/images/multitech-logo.svg'
import { navigationItems } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import { SidebarNavItem } from './SidebarNavItem'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  currentPath: string
  isOpen?: boolean
  onClose?: () => void
  onNavigate?: () => void
}

export function Sidebar({
  currentPath,
  isOpen = false,
  onClose,
  onNavigate,
}: SidebarProps) {
  const sidebarClasses = [
    styles.sidebar,
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
          <a className={styles.logoLink} href="/dashboard" onClick={onNavigate}>
            <img className={styles.logo} src={multitechLogoUrl} alt="MultiTech" />
          </a>
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
