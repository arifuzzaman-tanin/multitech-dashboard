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

  return (
    <div className={styles.shell}>
      <Sidebar
        currentPath={currentPath}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onNavigate={closeSidebar}
      />
      <div className={styles.workspace}>
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
