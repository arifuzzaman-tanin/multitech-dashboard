import { useEffect, useState, type ReactNode } from 'react'
import { Sidebar } from '@/shared/components/navigation/Sidebar'
import { TopNavbar } from '@/shared/components/navigation/TopNavbar'
import styles from './AppShell.module.scss'

interface AppShellProps {
  children: ReactNode
  currentPath: string
}

export function AppShell({ children, currentPath }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((currentValue) => !currentValue)
  }

  const workspaceClasses = [
    styles.workspace,
    isSidebarCollapsed ? styles.workspaceCollapsed : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.shell}>
      <Sidebar
        currentPath={currentPath}
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onCollapsedChange={toggleSidebarCollapsed}
        onNavigate={closeSidebar}
      />
      <div className={workspaceClasses}>
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
