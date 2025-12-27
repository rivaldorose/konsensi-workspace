'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Apps', href: '/apps' },
  { label: 'Partners', href: '/partners' },
  { label: 'Events', href: '/events' },
  { label: 'Docs', href: '/docs' },
  { label: 'Roadmap', href: '/roadmap' },
]

const moreNavItems = [
  { label: 'Chat', href: '/chat' },
  { label: 'Marketing', href: '/marketing' },
  { label: 'Contracts', href: '/contracts' },
  { label: 'Analytics', href: '/analytics' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const unreadNotifications = 2 // TODO: Get from state/API
  const user = { full_name: 'Alex', email: 'alex@konsensi.com' } // TODO: Get from auth

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMoreDropdownOpen(false)
      setProfileDropdownOpen(false)
    }

    if (moreDropdownOpen || profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [moreDropdownOpen, profileDropdownOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle keyboard shortcuts (Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-secondary-500 shadow-sm z-50">
        <div className="h-full px-4 md:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
          
          {/* LEFT: Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <span className="material-symbols-outlined text-[24px]">close</span>
              ) : (
                <span className="material-symbols-outlined text-[24px]">menu</span>
              )}
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center" style={{ gap: '12px' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#B2FF78' }}>
                <span className="material-symbols-outlined text-secondary-900 text-xl">grid_view</span>
              </div>
              <span className="font-montserrat font-bold text-white text-lg hidden sm:block">
                Konsensi Workspace
              </span>
              <span className="font-montserrat font-bold text-white text-lg sm:hidden">
                Konsensi
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative text-sm font-lato transition-all duration-200
                    ${isActive 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-[24px] left-0 right-0 h-0.5" style={{ backgroundColor: '#B2FF78' }}></div>
                  )}
                </Link>
              )
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMoreDropdownOpen(!moreDropdownOpen)
                }}
                className={`
                  flex items-center gap-1 text-sm font-lato transition-all duration-200
                  ${moreDropdownOpen ? 'text-white' : 'text-white/70 hover:text-white'}
                `}
              >
                More
                <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: moreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-grey-200 py-2 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {moreNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-2 text-sm transition-colors
                          ${isActive 
                            ? 'bg-grey-50 text-secondary-900 font-medium' 
                            : 'text-grey-700 hover:bg-grey-50'
                          }
                        `}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            {/* Search */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Notifications */}
            <Link 
              href="/notifications"
              className="relative text-white/70 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></div>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileDropdownOpen(!profileDropdownOpen)
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-montserrat font-bold text-secondary-900 text-sm hover:ring-2 hover:ring-white/20 transition-all"
                style={{ backgroundColor: '#B2FF78' }}
                aria-label="Profile menu"
              >
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-grey-200 py-2 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b border-grey-200">
                    <p className="font-semibold text-sm text-grey-900">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-grey-600">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>

                  <Link
                    href="/settings/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 transition-colors"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      // TODO: Implement signOut
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-grey-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-secondary-500 border-t border-white/10 shadow-lg z-40">
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {[...mainNavItems, ...moreNavItems].map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <span className="font-lato text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal - TODO: Implement full search modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-[20vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-grey-500">search</span>
              <input
                type="text"
                placeholder="Search workspace..."
                className="flex-1 border-none outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-grey-500 hover:text-grey-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-grey-500">Search functionality coming soon...</p>
          </div>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {(moreDropdownOpen || profileDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setMoreDropdownOpen(false)
            setProfileDropdownOpen(false)
          }}
        ></div>
      )}
    </>
  )
}
