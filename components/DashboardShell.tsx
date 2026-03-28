'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { PUBLIC_PAGE_PREFIXES } from '@/lib/public-paths'

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_PAGE_PREFIXES.slice(1).some(p => pathname === p || pathname.startsWith(p + '/'))
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (isPublicPath(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="dashboard-shell flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-56 min-h-screen flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
