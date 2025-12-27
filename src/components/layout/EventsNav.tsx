'use client'

import Link from 'next/link'

export function EventsNav() {
  return (
    <header className="bg-konsensi-green text-white px-6 py-3 shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-[#182210]">
              <span className="material-symbols-outlined">grid_view</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Konsensi Workspace</h2>
          </div>
          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/events" className="text-white text-sm font-bold border-b-2 border-primary py-1">
              Events &amp; Projects
            </Link>
            <Link href="/calendar" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">
              Calendar
            </Link>
            <Link href="/settings/team" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">
              Team
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">
              Resources
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-[#2a3620] rounded-lg h-9 w-64 px-3 border border-[#3b4a2e] focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
            <input 
              className="bg-transparent border-none text-sm text-white placeholder-gray-400 focus:ring-0 w-full h-full ml-2" 
              placeholder="Search projects..." 
              type="text"
            />
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center size-9 rounded-full hover:bg-[#2a3620] text-gray-300 transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <Link href="/settings" className="flex items-center justify-center size-9 rounded-full hover:bg-[#2a3620] text-gray-300 transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </Link>
          </div>
          {/* Profile */}
          <div 
            className="size-9 rounded-full bg-cover bg-center border-2 border-[#3b4a2e]"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwURW5hLMUcJYJfLygw9jXjdxc_zgE_9WcMNfWINcGlvCTe8MRjAunk3xF5FhVJH3s9CT8T3hNU03s4_FpanzFdb9BZNX3vpTyFksqWqWSp4YD6W7YcRX0vf5Nh3sTjqLHDfyoywdyHHjpozmwaeK-Khe9yRq6X7_GBkooDEyL6dughtCKTXRoPWjTwejZphXEOD_uzkO0Px-gFJO3-dfPx8e3HN2MAyCcL08ZkQbBz4SXco-yVf0OUrj8Gys6RDHERgvbtMwqBXae")' }}
          ></div>
        </div>
      </div>
    </header>
  )
}

