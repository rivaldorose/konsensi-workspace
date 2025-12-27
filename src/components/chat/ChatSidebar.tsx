'use client'

import { useState } from 'react'
import type { Channel } from '@/hooks/useChat'

interface ChatSidebarProps {
  channels: Channel[]
  selectedChannelId?: string
  onSelectChannel: (channelId: string) => void
}

export function ChatSidebar({
  channels,
  selectedChannelId,
  onSelectChannel
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter channels by search
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Hardcoded DMs for now (should come from API later)
  const directMessages = [
    { id: 'dm-alice', name: 'Alice Smith', online: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQabE2ulW1HYFyYhdC7VMohuzwSm0umOGJrDsUpDNisMYRYCrCiYSI0X4tDEZ9bO-WtlZ97MHux1u_J_uoh1HugtMHiAT8S4AfznqRLoxt1rLoIg0GN_1Wvd4eIFcqQ7Z2Z8t0SIPtsqHumIIEtwVG57LVKab1gZsyma3Fs9CeOCDdGM2fElgaIuLMnKnq2FM4gtp0qFEiE0JZPyrxWj0vqX87zkArQk7iXndUbmUM4UogTk5hgfIb4i2_1zY0u_3r--x0tRzJUT0n' },
    { id: 'dm-bob', name: 'Bob Johnson', online: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtv2xsHjYPycLgk-wU5UuXVMCAclJLBTXnDQ9_7X7zT869EmejAAMInKBXxSPkNCSxbE8KSRiETlEjldnChjCECBV7wQb_DZIqVIy7Q8uSVEUsaiIJNdOBRya-E29sgRmpNWs2-fdNarsaugJ7NXYUOk0IKFZekGAecxesiftw13nqtZ3vuu2krTBdGWt9moxFNQv2A_pSgsDSYLZFfg5w7Xg3MhBTzY_U1ouMVDrgRaGPEnilZtTiNUp1RWUMXdoP_sLp05DL1Tcn' },
    { id: 'dm-sarah', name: 'Sarah Davis', online: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi_GI8dgnRAI22OdKDPQJap2SOtMcQAM6JKZYaHfNJ0aLhd3uZIRVVXg-WnCmOvYcNddfVEf5MrTxgacAroN10fvdSVXQ0MV_bvmbUG415HZvQasmMCMplanSqPdXws0AMbK0Jv-_EziRZXVkqXLMwQXJm0nyxX2xp0CU5UtlKiAErjkjKnEzQF--AORu6y0h5zz2wBl1AoGR2lEX3eUxB_ylG6GXBXpoXi4wUmOM84hJ5sIRMcCC5-UvVrusIA_Yvtha0AsaQIlwJ' }
  ]

  return (
    <aside className="w-[240px] flex flex-col bg-[#fafcf8] dark:bg-background-dark border-r border-border-light shrink-0 h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Search */}
        <div className="p-4 border-b border-border-light">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#25331a] text-text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="px-2 mb-2 flex items-center justify-between group">
              <h3 className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider opacity-70">Channels</h3>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400 hover:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedChannelId === channel.id
                      ? 'bg-[#ecf3e7] dark:bg-[#25331a] text-text-dark dark:text-white font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-[#25331a] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" />
                  </svg>
                  <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
                </button>
              ))}
              {filteredChannels.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-2">No channels found</p>
              )}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="px-2 mb-2 flex items-center justify-between group">
              <h3 className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider opacity-70">Direct Messages</h3>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400 hover:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => onSelectChannel(dm.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedChannelId === dm.id
                      ? 'bg-[#ecf3e7] dark:bg-[#25331a]'
                      : 'hover:bg-gray-100 dark:hover:bg-[#25331a]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-6 h-6 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${dm.avatar}")` }}
                    />
                    {dm.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary border-2 border-[#fafcf8] dark:border-background-dark rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm flex-1 text-left truncate ${
                    selectedChannelId === dm.id
                      ? 'text-text-dark dark:text-white font-bold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {dm.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Status Footer */}
        <div className="mt-auto p-4 border-t border-border-light bg-gray-50 dark:bg-[#1a2412]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbywvUebQjobSlNMjbSt-RDs36agsf5sW7X95k7qwsGuGC-d5MDRd2r9CRQ9jaTKcGkUcOovYFre0lAkftFFXp7SeFtqP-Qm-9DWntplhsAVNswNF7XUWE0OErXp1YzH6EFbKHKYdOPUQzHCIqBi2svF_RiD9qR1kfaUaCIiCOYJo9789QRJp-16TDH7EjFyaCuehLGD89y327Q5Wd2n-49FP4zGOVhSpDPgRSfyq7VV6mWldW05l2VKswK2tAzeoguBGs1Imlu8WZ")' }}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-white dark:border-background-dark rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-text-dark dark:text-white">You</span>
              <span className="text-xs text-text-secondary">Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

