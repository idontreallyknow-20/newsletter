'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

const ADMIN_PATHS = ['/dashboard', '/compose', '/subscribers', '/history', '/settings']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (!isAdminPath(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="dashboard-shell flex min-h-screen">
      <Sidebar />
      <main id="main-content" className="flex-1 lg:ml-56 min-h-screen flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
