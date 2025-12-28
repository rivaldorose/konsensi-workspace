'use client'

import { useState, useEffect } from 'react'
import { useChannels, useMessages } from '@/hooks/useChat'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { MessageInput } from '@/components/chat/MessageInput'
import { ChatInfo } from '@/components/chat/ChatInfo'

export default function ChatPage() {
  const { data: channels = [], isLoading: channelsLoading } = useChannels()
  const [selectedChannelId, setSelectedChannelId] = useState<string>()
  const [showInfo, setShowInfo] = useState(false)

  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedChannelId)

  const selectedChannel = channels.find(c => c.id === selectedChannelId)

  // Select first channel by default
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  if (channelsLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading channels...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-[#1e2a15] overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={setSelectedChannelId}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChannel ? (
          <>
            <ChatHeader
              channel={selectedChannel}
              onToggleInfo={() => setShowInfo(!showInfo)}
            />

            <MessageFeed
              messages={messages}
              loading={messagesLoading}
              channelId={selectedChannelId!}
            />

            <MessageInput channelId={selectedChannelId!} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a channel to start messaging</p>
              <p className="text-sm text-gray-400">
                {channels.length === 0 ? 'No channels available' : 'Choose a channel from the sidebar'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Sidebar */}
      {showInfo && selectedChannel && (
        <ChatInfo
          channel={selectedChannel}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  )
}
