'use client'

import Link from 'next/link'

export function PartnersNav() {
  return (
    <header className="bg-nav-bg text-white px-6 py-4 border-b border-[#2a3820] flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Konsensi</h2>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/apps" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Projects
          </Link>
          <Link href="/partners" className="text-primary font-bold text-sm leading-normal border-b-2 border-primary py-1">
            Partners
          </Link>
          <Link href="/analytics" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Finance
          </Link>
          <Link href="/settings/team" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Team
          </Link>
        </nav>
        <button className="lg:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <div className="hidden md:flex items-center gap-6 w-full md:w-auto justify-end">
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-none">Alex K.</span>
            <span className="text-xs text-primary/80 leading-none mt-1">Admin</span>
          </div>
          <div 
            className="h-9 w-9 rounded-full bg-cover bg-center border-2 border-primary/50"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIZoo0LGjByzmom4j4ZyvbU5n4uMPPGhuD0nOoFmOJLjD2baT7YjSJqvAfL_ALsdizJAiUeIVzU-ZHenuPTVILNyqFumlUjTCOrzrpCyvfOaAKXLVry94e4UOFMMvNI26vjQqvHSyuXYYSJ6jgce8NCH2SXW2CWMsgyC3GYGNfOA_Pf907cnu5_mlwtSbFFyOZZ5QGEp24DTURd2eJkUlMsiLBalLOKd1rdZGWgN5bb-dB0bexy3Nv16PoakikzwVTUnyOgOLXTegw")' }}
          ></div>
        </div>
      </div>
    </header>
  )
}

