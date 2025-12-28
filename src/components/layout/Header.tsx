'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-secondary text-white w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Konsensi</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-semibold text-primary hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/apps" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/partners" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              CRM
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="h-8 w-[1px] bg-white/20 mx-1"></div>
            <div className="flex items-center gap-3 pl-1 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Alex M.</p>
                <p className="text-xs text-gray-400 mt-1">Admin</p>
              </div>
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary/50 group-hover:border-primary transition-colors"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfzZ8ZOf13GBMUa-JZSTy45cz5cpwR7PvLNBpAzlwMHyfknwo27Xp9vhsgs0dRBZ5lOjkSGkRuVXVZD6JInoADJpq_cUiv9h6ZgzaMJYGaMQe4LyS-Lbda18M2irZTLXkFK_G_sYnth8H3KIpDkwovZOkeUSd08pae7ut0WTYZIR4OFVHblbWSNL2_TwTpacSHyroZgNUidUK1iuKXiNbwkO995ALR21QwPm--uv2QHDy6w7BGDOFfaycEfdrqxtb8JpYsdq-HOc4G")' }}
                ></div>
                <div className="absolute bottom-0 right-0 size-3 bg-primary border-2 border-secondary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

