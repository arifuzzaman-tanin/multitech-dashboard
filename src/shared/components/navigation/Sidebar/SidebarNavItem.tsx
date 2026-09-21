import { useState } from 'react'
import type { NavigationItem } from '@/app/config/navigation'
import { NavIcon } from '@/shared/components/navigation/icons'
import styles from './Sidebar.module.scss'

interface SidebarNavItemProps {
  item: NavigationItem
  currentPath: string
  isChild?: boolean
  onNavigate?: () => void
}

function isItemActive(item: NavigationItem, currentPath: string): boolean {
  if (item.path === currentPath) {
    return true
  }

  return item.children?.some((child) => child.path === currentPath) ?? false
}

export function SidebarNavItem({
  currentPath,
  isChild = false,
  item,
  onNavigate,
}: SidebarNavItemProps) {
  const hasChildren = Boolean(item.children?.length)
  const isActive = isItemActive(item, currentPath)
  const [isExpanded, setIsExpanded] = useState(isActive)
  const itemClasses = [
    styles.navItem,
    isChild ? styles.childItem : '',
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

  const handleExpand = () => {
    setIsExpanded((expanded) => !expanded)
  }

  return (
    <li>
      <div className={styles.itemRow}>
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

        {hasChildren && (
          <button
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
            className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
            onClick={handleExpand}
            type="button"
          >
            <NavIcon name="chevronDown" size={16} />
          </button>
        )}
      </div>

      {hasChildren && (
        <ul className={`${styles.children} ${isExpanded ? styles.childrenOpen : ''}`}>
          {item.children?.map((child) => (
            <SidebarNavItem
              currentPath={currentPath}
              isChild
              item={child}
              key={child.id}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
