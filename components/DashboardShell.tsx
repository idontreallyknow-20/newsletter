'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { ThemeProvider, useTheme } from './ThemeContext'

const ADMIN_PATHS = ['/dashboard', '/compose', '/subscribers', '/schedule', '/history', '/settings']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <div className={`dashboard-shell theme-${theme} flex min-h-screen`}>
      <Sidebar />
      <main id="main-content" className="flex-1 lg:ml-56 min-h-screen flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (!isAdminPath(pathname)) return <>{children}</>

  return (
    <ThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  )
}
