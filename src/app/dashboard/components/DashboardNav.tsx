'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu
} from 'lucide-react'
import { signout } from '@/app/auth/actions'

export function DashboardNav({ 
  profile, 
  children 
}: { 
  profile: any
  children: React.ReactNode 
}) {
  const pathname = usePathname()

  const navItems = [
    { name: '團體管理', href: '/dashboard', icon: LayoutDashboard },
    { name: '資源庫', href: '/dashboard/resources', icon: Package },
    { name: '帳本', href: '/dashboard/ledger', icon: Wallet }, // Placeholder
    { name: '個人設定', href: '/dashboard/settings', icon: Settings }, // Placeholder
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true
    if (path !== '/dashboard' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200 z-50">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
          <span className="text-xl font-bold text-primary">TourMaster</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${active 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{profile?.full_name || 'Admin'}</p>
              <form action={signout}>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1">
                  <LogOut className="mr-1 h-3 w-3" /> 登出
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <span className="text-lg font-bold text-primary">TourMaster</span>
        <div className="flex items-center gap-2">
             <span className="text-sm text-gray-600 truncate max-w-[100px]">{profile?.full_name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
             const active = isActive(item.href)
             return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <item.icon
                  className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-400'}`}
                />
                <span className={`text-[10px] mt-1 ${active ? 'text-primary' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
