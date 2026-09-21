import { useState } from 'react'
import {
  navbarSelectors,
  navbarUser,
  notificationCount,
} from '@/app/config/navigation'
import multitechLogoUrl from '@/assets/images/multitech-logo.svg'
import { NavIcon } from '@/shared/components/navigation/icons'
import { NavbarSelector } from './NavbarSelector'
import styles from './TopNavbar.module.scss'

interface TopNavbarProps {
  onMenuClick: () => void
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const handleFilterClick = () => {
    setIsMobileFilterOpen((currentValue) => !currentValue)
  }

  return (
    <header className={`${styles.navbar} ${isMobileFilterOpen ? styles.filterOpen : ''}`}>
      <div className={styles.brand}>
        <button
          aria-label="Open navigation"
          className={styles.menuButton}
          onClick={onMenuClick}
          type="button"
        >
          <NavIcon name="menu" />
        </button>
        <a className={styles.logoLink} href="/dashboard">
          <img className={styles.logo} src={multitechLogoUrl} alt="MultiTech" />
        </a>
      </div>

      <div className={styles.contextControls}>
        {navbarSelectors.map((selector) => (
          <NavbarSelector key={selector.id} selector={selector} />
        ))}
      </div>

      <div className={styles.actions}>
        <button
          aria-label={isMobileFilterOpen ? 'Close navbar filters' : 'Open navbar filters'}
          aria-expanded={isMobileFilterOpen}
          className={`${styles.iconButton} ${styles.filterButton}`}
          title={isMobileFilterOpen ? 'Close filters' : 'Filters'}
          type="button"
          onClick={handleFilterClick}
        >
          <NavIcon name={isMobileFilterOpen ? 'x' : 'filter'} />
        </button>
        <button
          aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ''}`}
          className={styles.iconButton}
          title="Notifications"
          type="button"
        >
          <NavIcon name="bell" />
          {notificationCount > 0 && (
            <span className={styles.notificationBadge}>{notificationCount}</span>
          )}
        </button>
        <button
          aria-label={`Open profile menu for ${navbarUser.name}`}
          className={styles.profileButton}
          type="button"
        >
          <span className={styles.avatar} aria-hidden="true">
            {navbarUser.initials}
          </span>
          <span className={styles.profileText}>
            <span className={styles.profileName}>{navbarUser.name}</span>
            <span className={styles.profileRole}>{navbarUser.role}</span>
          </span>
        </button>
      </div>
    </header>
  )
}
