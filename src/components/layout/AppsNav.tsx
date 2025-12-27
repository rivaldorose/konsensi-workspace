'use client'

import Link from 'next/link'

export function AppsNav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-dark-nav border-b border-[#2a3820] px-4 md:px-10 py-3">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">grid_view</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Konsensi Workspace</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-center gap-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium leading-normal">
            Dashboard
          </Link>
          <Link href="/apps" className="text-primary text-sm font-bold leading-normal">
            Apps
          </Link>
          <Link href="/partners" className="text-gray-400 hover:text-white transition-colors text-sm font-medium leading-normal">
            People
          </Link>
          <Link href="/settings" className="text-gray-400 hover:text-white transition-colors text-sm font-medium leading-normal">
            Settings
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-dark-nav"></span>
          </button>
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-primary/30"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDU862omrpCt3TCyXoBtXgtGcZE4nJKZDn0u0t8sEvnDfIJh5W8Ia8v21LY85UUiw8KQ7PVo9ikjtGLWgdZzbc1-xI93aZmxJLhHn6OzuPnQkl49cgqoCOXNx_GUawAEt_9zaktpB_qW66VXxlA-_9goiMKIYyF8bz33kF3UMZZUzGHs0T8g-mgNL-XziCltM84PnibtU5Qg23z5eJvrwSs0aN3bkCbRCwfCFPv1FAWRnEVIzooiH0f9ujsB0cdH9VxeFzRvezUnze5")' }}
          ></div>
        </div>
      </div>
    </nav>
  )
}

