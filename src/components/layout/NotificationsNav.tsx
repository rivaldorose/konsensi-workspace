'use client'

import Link from 'next/link'

export function NotificationsNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#131c0d] text-white border-b border-white/10 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="size-8 text-primary flex items-center justify-center bg-white/10 rounded-lg">
              <span className="material-symbols-outlined">dataset</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden md:block">Konsensi Workspace</h1>
          </div>
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              Dashboard
            </Link>
            <Link href="/apps" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              Projects
            </Link>
            <Link href="/partners" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              CRM
            </Link>
            <Link href="/notifications" className="px-3 py-2 rounded-lg text-sm font-bold text-primary bg-primary/10 transition-colors">
              Notifications
            </Link>
            <Link href="/settings/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              Profile
            </Link>
          </nav>
          {/* Right Actions */}
          <div className="flex items-center gap-3 justify-end flex-1 md:flex-none">
            {/* Search */}
            <div className="relative hidden sm:block max-w-[240px] w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-1.5 border-none rounded-lg leading-5 bg-white/10 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:ring-0 sm:text-sm transition-colors" 
                placeholder="Search..." 
                type="text"
              />
            </div>
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#131c0d]"></span>
            </button>
            {/* Profile Avatar */}
            <button className="size-9 rounded-full bg-gradient-to-tr from-primary to-emerald-600 border border-white/20 overflow-hidden">
              {/* Placeholder for user avatar */}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

