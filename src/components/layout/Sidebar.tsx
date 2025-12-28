'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Grid3x3,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Megaphone,
  FileCheck,
  Route,
  Bell,
  Search,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Apps', href: '/apps', icon: Grid3x3 },
  { name: 'Partners', href: '/partners', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Docs', href: '/docs', icon: FileText },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Contracts', href: '/contracts', icon: FileCheck },
  { name: 'Roadmap', href: '/roadmap', icon: Route },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-grey-200">
      <div className="flex h-16 items-center border-b border-grey-200 px-6">
        <h1 className="text-xl font-bold text-secondary-500">Konsensi</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-500'
                  : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

