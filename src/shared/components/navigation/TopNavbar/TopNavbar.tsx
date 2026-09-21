import {
  environmentStatus,
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

const environmentLabels = {
  production: 'Production',
  staging: 'Staging',
  development: 'Development',
} as const

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.mobileBrand}>
        <button
          aria-label="Open navigation"
          className={styles.menuButton}
          onClick={onMenuClick}
          type="button"
        >
          <NavIcon name="menu" />
        </button>
        <a className={styles.mobileLogoLink} href="/dashboard">
          <img className={styles.mobileLogo} src={multitechLogoUrl} alt="MultiTech" />
        </a>
      </div>

      <div className={styles.contextControls}>
        {navbarSelectors.map((selector) => (
          <NavbarSelector key={selector.id} selector={selector} />
        ))}
        <span
          aria-label={`Environment status: ${environmentLabels[environmentStatus]}`}
          className={styles.environment}
          role="status"
        >
          <span className={styles.statusDot} aria-hidden="true" />
          {environmentLabels[environmentStatus]}
        </span>
      </div>

      <div className={styles.actions}>
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
          aria-label="Help"
          className={styles.iconButton}
          title="Help"
          type="button"
        >
          <NavIcon name="help" />
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
          <NavIcon name="chevronDown" size={16} />
        </button>
      </div>
    </header>
  )
}
