'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ChatPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-white h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light bg-[#fafcf8] dark:bg-background-dark px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-4 text-text-dark dark:text-white">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center text-primary">
              {/* Logo Icon */}
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-text-dark dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Konsensi Workspace</h2>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-6">
          <div className="hidden md:flex items-center gap-4 bg-white dark:bg-[#25331a] border border-border-light rounded-lg px-3 py-2 w-64">
            <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
            <input 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 focus:ring-0 p-0 text-text-dark dark:text-white" 
              placeholder="Search workspace..." 
              type="text"
            />
          </div>
          <Link href="/notifications" className="relative text-text-dark dark:text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 size-2.5 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
          </Link>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgZ0BDycrrJX4HtwZ6TnN1ezcaGix6iZK0DH24S1zpgwJwE8fZYnjeQA_jjB1sggT6LzOmxlrO45sGRFSPowBR_mB1s6rruUvkoAfpTB_SH-8VhrejlnJvsjYhGNp5c0WSXrlbglTg7d8hPcyyAqoRSTLaN34mJtbC2-RMhwb5ebloOrCPVgyDX8E_0llwf5oYmtr_JwcHpo1pkia48PgrRZ6wvg17DXnFbpW5h_bVcHb65u-jqOCQ3aUQ2tGr_xZUcpQNs69kNkNF")' }}
          ></div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[240px] flex flex-col bg-[#fafcf8] dark:bg-background-dark border-r border-border-light shrink-0">
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Section: Navigation */}
              <div className="flex flex-col gap-2">
                <div className="px-2 mb-1 flex items-center justify-between group cursor-pointer">
                  <h3 className="text-text-dark dark:text-white text-sm font-bold uppercase tracking-wider opacity-70">Channels</h3>
                  <button className="material-symbols-outlined text-gray-400 hover:text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">add</button>
                </div>
                {/* Active Item */}
                <Link 
                  href="/chat?channel=marketing"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ecf3e7] dark:bg-[#25331a] cursor-pointer group transition-colors"
                >
                  <span className="material-symbols-outlined text-text-dark dark:text-white text-[20px] icon-filled">tag</span>
                  <p className="text-text-dark dark:text-white text-sm font-bold flex-1 truncate">marketing</p>
                </Link>
                {/* Inactive Items */}
                <Link 
                  href="/chat?channel=general"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-[20px]">tag</span>
                  <p className="text-sm font-medium flex-1 truncate">general</p>
                </Link>
                <Link 
                  href="/chat?channel=development"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-[20px]">tag</span>
                  <p className="text-sm font-medium flex-1 truncate">development</p>
                </Link>
                <Link 
                  href="/chat?channel=management"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <p className="text-sm font-medium flex-1 truncate">management</p>
                </Link>
              </div>

              {/* Section: Direct Messages */}
              <div className="flex flex-col gap-2">
                <div className="px-2 mb-1 flex items-center justify-between group cursor-pointer">
                  <h3 className="text-text-dark dark:text-white text-sm font-bold uppercase tracking-wider opacity-70">Direct Messages</h3>
                  <button className="material-symbols-outlined text-gray-400 hover:text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">add</button>
                </div>
                <Link href="/chat?dm=alice" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-6"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQabE2ulW1HYFyYhdC7VMohuzwSm0umOGJrDsUpDNisMYRYCrCiYSI0X4tDEZ9bO-WtlZ97MHux1u_J_uoh1HugtMHiAT8S4AfznqRLoxt1rLoIg0GN_1Wvd4eIFcqQ7Z2Z8t0SIPtsqHumIIEtwVG57LVKab1gZsyma3Fs9CeOCDdGM2fElgaIuLMnKnq2FM4gtp0qFEiE0JZPyrxWj0vqX87zkArQk7iXndUbmUM4UogTk5hgfIb4i2_1zY0u_3r--x0tRzJUT0n")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-text-dark dark:text-white text-sm font-medium flex-1 truncate">Alice Smith</p>
                </Link>
                <Link href="/chat?dm=bob" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-6"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtv2xsHjYPycLgk-wU5UuXVMCAclJLBTXnDQ9_7X7zT869EmejAAMInKBXxSPkNCSxbE8KSRiETlEjldnChjCECBV7wQb_DZIqVIy7Q8uSVEUsaiIJNdOBRya-E29sgRmpNWs2-fdNarsaugJ7NXYUOk0IKFZekGAecxesiftw13nqtZ3vuu2krTBdGWt9moxFNQv2A_pSgsDSYLZFfg5w7Xg3MhBTzY_U1ouMVDrgRaGPEnilZtTiNUp1RWUMXdoP_sLp05DL1Tcn")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-gray-300 border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-text-dark dark:text-white text-sm font-medium flex-1 truncate opacity-70">Bob Johnson</p>
                </Link>
                <Link href="/chat?dm=sarah" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#25331a] cursor-pointer transition-colors">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-6"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBi_GI8dgnRAI22OdKDPQJap2SOtMcQAM6JKZYaHfNJ0aLhd3uZIRVVXg-WnCmOvYcNddfVEf5MrTxgacAroN10fvdSVXQ0MV_bvmbUG415HZvQasmMCMplanSqPdXws0AMbK0Jv-_EziRZXVkqXLMwQXJm0nyxX2xp0CU5UtlKiAErjkjKnEzQF--AORu6y0h5zz2wBl1AoGR2lEX3eUxB_ylG6GXBXpoXi4wUmOM84hJ5sIRMcCC5-UvVrusIA_Yvtha0AsaQIlwJ")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-text-dark dark:text-white text-sm font-medium flex-1 truncate">Sarah Davis</p>
                  <div className="size-2 rounded-full bg-primary ml-auto"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* User Status Footer */}
          <div className="mt-auto p-4 border-t border-border-light bg-gray-50 dark:bg-[#1a2412]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbywvUebQjobSlNMjbSt-RDs36agsf5sW7X95k7qwsGuGC-d5MDRd2r9CRQ9jaTKcGkUcOovYFre0lAkftFFXp7SeFtqP-Qm-9DWntplhsAVNswNF7XUWE0OErXp1YzH6EFbKHKYdOPUQzHCIqBi2svF_RiD9qR1kfaUaCIiCOYJo9789QRJp-16TDH7EjFyaCuehLGD89y327Q5Wd2n-49FP4zGOVhSpDPgRSfyq7VV6mWldW05l2VKswK2tAzeoguBGs1Imlu8WZ")' }}
                ></div>
                <div className="absolute bottom-0 right-0 size-2.5 bg-primary border-2 border-white dark:border-background-dark rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none text-text-dark dark:text-white">You</span>
                <span className="text-xs text-text-secondary">Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-[#1e2a15] relative min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-white dark:bg-[#1e2a15] sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-xl icon-filled">tag</span>
                <h1 className="text-lg font-bold text-text-dark dark:text-white">marketing</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">Discussion about Q3 campaign assets and launch strategy.</p>
            </div>
            <div className="flex items-center -space-x-2">
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-8 border-2 border-white dark:border-background-dark"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWgp-23meuvkj-qDJkU-ZPvR-1EssozEF2SuCI1U3ZpX5ydyBJOn3Mgni4rKejQG-Mub_EeWjaji591jrapwITDj4lzBPaiGTEQjD-BPlr8SGJ7J5Wa3Wm33Yi4KsrTvzr17aOg2NI1i-VCuRhrKMj8grCi0P5f0PylWXybKGBQOF8h4EYo026yXsJ8EWhHHFXe9DD31kTT8-8UAe-kJEDVzI6DUe1veSOAvKwBQb4egEnRm3Z7MwsxzG2xpk8PV15s8l29xEyHucx")' }}
              ></div>
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-8 border-2 border-white dark:border-background-dark"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4culaNwyr4b1-Iz8EkSB6lSSDqmlDbjLOMUMQCkK9gjiLPJ2FYU6qC1HVxSS_C0idn5lAe3J5HZWwt4wrlT1WPIY0fSpiI4gsKLtuXa-Or2ld56cHNC-_enBAPBcT535Y3XyNYRzbYBbiOn7xYx0ypUfR33rQmYsGd5dYWNauMizACYVjp6VqICwDcZT-irOqTauQ9-tA8bhKkJG_BuSX6ZzIkIZd0DJvtleEr19mUVjDzcBGwXjnwtjaEDKFVTSvjEyWrCDd-H16")' }}
              ></div>
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-8 border-2 border-white dark:border-background-dark"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDEuKAs_WrPcumm6gvnGSjG6V-V0A-pjkS7ShPuj__u5W7WJ5DRHlxnUB9W7EQjl46cMzguAqNaG-fygVBjs_HzA1qio3013aNvWEb5lnbesOtQttexFmLK3bDEYlXght7Bl9u1QT5FiGWEmmUA4_i_qgkQdU-OsqEHShohgYbb4z5QxASqey_J1HnJyUx--TD8Qpcs5DURqG64ltOa0gaIOD6U8VZfs_XuzhoaGA8VKwrZnN1DC7PzkHmZeb71XOWS10DPUVh206Kh")' }}
              ></div>
              <div className="flex items-center justify-center size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">+2</div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Date Separator */}
            <div className="flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light"></div>
              </div>
              <span className="relative bg-white dark:bg-[#1e2a15] px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Today</span>
            </div>

            {/* Message: Other (Alice) */}
            <div className="flex gap-4 group">
              <div className="shrink-0 flex flex-col gap-1 items-center">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmpPxeGRPSqTvKjZxOVJYN92vOHlweEUAbSO4PP_GHF0PowSt5v3qU8NMrAVX_0adEUgJ5A3w5jTRUDhA92_T-xQI1_l_HwZCuUkgOqkOmUdhOkzLEOaYlni-4hOBE_kt63mfNfBiQLAykBUM3dWQkT75wk41wUbZwcXNgE1mCkALz5qKK4oVH9Mu2lGiOC5SUvsPBBhGyZ4qSWg4j62C2APCEG2UZK6JO4j6JVqqCOadvXDQq6_BTA4u0-e2c99nVabJSck1KFwkR")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-text-dark dark:text-white">Alice Smith</span>
                  <span className="text-xs text-gray-400">10:23 AM</span>
                </div>
                <div className="bg-white dark:bg-[#25331a] border border-gray-100 dark:border-transparent p-3 lg:p-4 rounded-r-2xl rounded-bl-2xl shadow-sm text-text-dark dark:text-gray-100 text-[15px] leading-relaxed">
                  <p>Here are the initial drafts for the Q3 campaign assets. I focused on the vibrant green palette we discussed last week.</p>
                </div>
                {/* Attachment */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#25331a]/50 border border-border-light rounded-xl w-fit mt-1 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-dark dark:text-white">Q3_Campaign_Drafts.pdf</span>
                    <span className="text-xs text-gray-500">2.4 MB</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 ml-2">download</span>
                </div>
              </div>
            </div>

            {/* Message: Other (Sarah) */}
            <div className="flex gap-4 group">
              <div className="shrink-0 flex flex-col gap-1 items-center">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCG_8O2ln-keLxZT2ISAhPpk6aO6yTfuscOXew6mWvKcrtg2v2kGlWK3RhIBn3KMGndmp_wQZdvHZvASOUFECFNos01tvRyF_R6F8fhypkAwyxI7JfYSCr6FRaHQa9JyIsAx5uvk1EqOk60ihVpaZF8h5x8sQgHFRHCov_rc8O5VrtRKI27L2HVYbTXEZWOViumqTrv6EYBJmEfbfAqZoj-Y5s0vT4mazU-EWlqIQBTNFTxQ_29xA1_9sHGJJUWXEEjO7LDZHmtgs0B")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-text-dark dark:text-white">Sarah Davis</span>
                  <span className="text-xs text-gray-400">10:25 AM</span>
                </div>
                <div className="bg-white dark:bg-[#25331a] border border-gray-100 dark:border-transparent p-3 lg:p-4 rounded-r-2xl rounded-bl-2xl shadow-sm text-text-dark dark:text-gray-100 text-[15px] leading-relaxed">
                  <p>Looks great Alice! I really like the second option with the bolder typography.</p>
                </div>
              </div>
            </div>

            {/* Message: Own */}
            <div className="flex gap-4 flex-row-reverse group">
              <div className="shrink-0 flex flex-col gap-1 items-center">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfo5UTupFi7boJW25iNi_bDFcslvpjTQ_-Fj0AhRKtJ9sinSkAN1qXFD3Y6P1dgwkyunWqt-E0xO2VuTb06ZMsQ68kBJCruxFMkFn9zlihDPfwWirW23Nmlnc9QxGJkW836TBhLt1mW-wvXMEpOnFtrTCK7FfT_WzsOL-Jv4Z7npwJJUQ3kEVDTQNKpEnJckqu7e_49jsaHp6QL7CPhHpkzilPsNsD6Qk3Ne5gxzfFch568bzK3Gxc0-xiGzupKbZ3XLBowAmYhngO")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-1 max-w-[70%] items-end">
                <div className="flex items-baseline gap-2 flex-row-reverse">
                  <span className="font-bold text-text-dark dark:text-white">You</span>
                  <span className="text-xs text-gray-400">10:42 AM</span>
                </div>
                {/* Own message bubble: Light green tint from primary */}
                <div className="bg-[#f0f9e8] dark:bg-[#344e1f] border border-[#dffcbd] dark:border-transparent p-3 lg:p-4 rounded-l-2xl rounded-br-2xl text-text-dark dark:text-white text-[15px] leading-relaxed shadow-sm">
                  <p>Agreed. Let&apos;s move forward with option 2. When can we have the high-res versions ready?</p>
                </div>
                <span className="text-xs text-gray-400 font-medium mr-1">Seen by everyone</span>
              </div>
            </div>

            {/* Message: Other (Bob) */}
            <div className="flex gap-4 group">
              <div className="shrink-0 flex flex-col gap-1 items-center">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_y1o3ufh88-7m0nJ0MIOsvWt-YFa-2yFiZjLH5-HYKMwPJpEFNm4JLDIWXZqHbf_hyspN1YYR8aOGrDYJ1A8fvCAlUePftGrl10FC7RyFb0kNH6IGkZfNPLcA2OKPnBaYP62djhn9dij8SnTSJWKsyEmH9qeJNfuieoBCt1Hk02cPSksqafSXraWRKPI1mWoKviCPJguvDVM4NpjQDWx58hNCl2Bf6qrkSXinZlcnxPvzlC41eKcH7ULG1_cY1T9Wrl1a2jE15Gjc")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-text-dark dark:text-white">Bob Johnson</span>
                  <span className="text-xs text-gray-400">10:45 AM</span>
                </div>
                <div className="bg-white dark:bg-[#25331a] border border-gray-100 dark:border-transparent p-3 lg:p-4 rounded-r-2xl rounded-bl-2xl shadow-sm text-text-dark dark:text-gray-100 text-[15px] leading-relaxed">
                  <p>I can have them ready by EOD tomorrow. 👍</p>
                </div>
                <div className="flex gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#25331a] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-white cursor-pointer transition-colors">
                    <span className="text-sm">🔥</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white dark:bg-[#1e2a15] mt-auto">
            <div className="flex flex-col bg-[#f7f8f6] dark:bg-[#25331a] border border-border-light rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-200 dark:border-gray-700/50">
                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Bold">
                  <span className="material-symbols-outlined text-[20px]">format_bold</span>
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Italic">
                  <span className="material-symbols-outlined text-[20px]">format_italic</span>
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Link">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="List">
                  <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
              </div>
              {/* Text Area */}
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 p-3 text-text-dark dark:text-white placeholder-gray-400 resize-none min-h-[60px]" 
                placeholder="Message #marketing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              {/* Actions Footer */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[22px]">add_circle</span>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[22px]">alternate_email</span>
                  </button>
                </div>
                <button className="bg-primary hover:bg-[#62d10f] text-text-dark font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-[11px] text-gray-400"><strong>Shift + Enter</strong> to add a new line</p>
            </div>
          </div>
        </main>

        {/* Right Sidebar (Context) */}
        <aside className="w-[280px] hidden lg:flex flex-col bg-[#fafcf8] dark:bg-background-dark border-l border-border-light shrink-0 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-border-light flex items-center justify-between">
            <h3 className="font-bold text-text-dark dark:text-white">Channel Info</h3>
            <button className="text-gray-400 hover:text-text-dark dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            {/* About */}
            <div className="p-4 border-b border-border-light">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-16 rounded-xl bg-[#ecf3e7] dark:bg-[#25331a] flex items-center justify-center text-text-dark dark:text-white mx-auto">
                    <span className="material-symbols-outlined text-[32px]">tag</span>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-text-dark dark:text-white">#marketing</h2>
                  <p className="text-sm text-text-secondary">Created on Oct 24th</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
                  This channel is for all marketing related discussions, assets, and campaign planning.
                </div>
              </div>
            </div>

            {/* Members Accordion */}
            <div className="border-b border-border-light">
              <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-[#1a2412] transition-colors">
                <span className="font-bold text-sm text-text-dark dark:text-white">Members</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">5</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                </div>
              </button>
              {/* Expanded List */}
              <div className="px-4 pb-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANB6Q9sErxYppf97zGiNE9u2vg_BgQdChcOcMk5WHBrLM5MNF95b0O3q7t-VHmctqk1HfuALaAR5SktHIzogBgIMTooMDjpsfL3rTP00QCFU7sBLN7M0gQrXkC3uLAOtS3Eb3bJdtxaTzN3hpkyGma8qDtHwieT6bWp_heRs2teh5YEQaxGY75e97AoaAdfsdfnT71QPxpyINob3JXZ0pPLPJqXxRXzd2vYkcfOf1Aj_Rx5um17RIEzci5BwJLeYcOmRcDqfLFeGp_")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-text-dark dark:text-white truncate">Alice Smith</p>
                  <span className="text-xs text-primary ml-auto font-medium">Admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCciCUFiAUM8vg9OiWIck4JIOJd55G3648Meldlq1_Pj_zyt21L5L08iSa83C1eNQNjHCtB45IpzR1NnV-iH8b4nLxhPHRrIQdo3G0dr7XqVnEj8sLlRbAkMgzw33zYpIO0aPuRXNopKz6FWv4ZUcUzuXPufb2-Z2ATMUfPEOP-iXl-pgpkC2UfuTvW2aPFbTePphw8H3LzUwZR8cVGtdgAYn6_281-v_7BWDFwguDUcNvFiZDw2mruGjO4lCkWCrCqZFzehYvPnGb-")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-text-dark dark:text-white truncate">You</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAS6RIOTlk9EWeXLQem6A7jdLR9sWGmzvRMi7YKprV0rOukuAGLqWWuArPKprBUx7iIzceKgcV8Cr6aScIckuZ0W3yMXeYOPNI4xzdNChjoDwPTs-vu_NmS_Mg0qNvY9-j5xAORPI8LWsQxrjYRV1ymVJhgEXTCrEZF9j_RDR7Vsf0hNTAUVg_2BZcGFJUsVMzCGQNUszaLNecZemuAcQTZfj4m9rGM9bwaOSps6AY2FHwEWFFgdIGrsX16b-wJ1RMLL5gWP83YIyqk")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-text-dark dark:text-white truncate">Sarah Davis</p>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full size-8 grayscale"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeLtgC5j8uuWkG4t80-8R00LcVOExbgHO-M8ghlZo3E1kZLSZORUTMhJPQxIu_93UVG1C2HqQq5pTBp_hZyqWLt0GRIp6HlKGAp-OlNElhBreUY2pQZ_4J3Z91WzXsk84EyF0aTt0dEAfo3Hm-RJ5uvZUtt9E4k_WTcUBfttvWCDCvfIxx9d2x6pA7fLs8yyVBpdT2qltdDfiiV8y9dfnYAkT0b7XcL9k2wNfbCqz6OyxkaF1ywCuCrnrR9zRmQk--_6G4jLPPDCAQ")' }}
                    ></div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-gray-300 border-2 border-[#fafcf8] dark:border-background-dark rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-text-dark dark:text-white truncate">Bob Johnson</p>
                </div>
                <button className="mt-2 text-xs font-bold text-text-secondary hover:underline text-left">+ Add people</button>
              </div>
            </div>

            {/* Shared Files Accordion */}
            <div className="border-b border-border-light">
              <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-[#1a2412] transition-colors">
                <span className="font-bold text-sm text-text-dark dark:text-white">Shared Files</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                </div>
              </button>
              <div className="px-4 pb-4 flex flex-col gap-3">
                <div className="flex items-start gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#25331a] rounded-lg cursor-pointer transition-colors group">
                  <div className="size-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-medium text-text-dark dark:text-white truncate">Brand_Guidelines_v2.pdf</p>
                    <span className="text-xs text-gray-400">Alice • 2d ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#25331a] rounded-lg cursor-pointer transition-colors group">
                  <div className="size-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">image</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-medium text-text-dark dark:text-white truncate">Logo_Pack_Final.zip</p>
                    <span className="text-xs text-gray-400">Sarah • 5h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Items */}
            <div>
              <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-[#1a2412] transition-colors">
                <span className="font-bold text-sm text-text-dark dark:text-white">Pinned Messages</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">1</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                </div>
              </button>
              <div className="px-4 pb-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-yellow-600 text-[14px] icon-filled">push_pin</span>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">Pinned by Alice</span>
                  </div>
                  <p className="text-text-dark dark:text-white opacity-80 italic">&quot;Please make sure to review the brand guidelines before creating any new assets.&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
