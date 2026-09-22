import { useEffect, useRef, useState } from 'react'
import {
  navbarSelectors,
  notificationCount,
} from '@/app/config/navigation'
import multitechLogoUrl from '@/assets/images/multitech-logo.svg'
import { NavIcon } from '@/shared/components/navigation/icons'
import { NavbarSelector } from './NavbarSelector'
import styles from './TopNavbar.module.scss'

interface NavbarUser {
  name: string
  company: string
}

interface TopNavbarProps {
  onLogout: () => void
  onMenuClick: () => void
  user: NavbarUser | null
}

export function TopNavbar({ onLogout, onMenuClick, user }: TopNavbarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const displayName = user?.name ?? 'Account'
  const company = user?.company ?? 'Signed in'
  const initials = getInitials(displayName)

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown)
    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [isProfileMenuOpen])

  const handleFilterClick = () => {
    setIsMobileFilterOpen((currentValue) => !currentValue)
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen((currentValue) => !currentValue)
  }

  const handleLogoutClick = () => {
    setIsProfileMenuOpen(false)
    onLogout()
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
        <div className={styles.profileMenu} ref={profileMenuRef}>
          <button
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            aria-label={`Open profile menu for ${displayName}`}
            className={styles.profileButton}
            onClick={handleProfileClick}
            type="button"
          >
            <span className={styles.avatar} aria-hidden="true">
              {initials}
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className={styles.profileDropdown} role="menu">
              <div className={styles.profileSummary}>
                <span className={styles.dropdownAvatar} aria-hidden="true">
                  {initials}
                </span>
                <span className={styles.profileText}>
                  <span className={styles.profileName}>{displayName}</span>
                  <span className={styles.profileRole}>{company}</span>
                </span>
              </div>

              <button
                className={styles.logoutButton}
                onClick={handleLogoutClick}
                role="menuitem"
                type="button"
              >
                <NavIcon name="logout" size={18} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'MT'
}
