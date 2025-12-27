'use client'

import { useState, KeyboardEvent, useRef } from 'react'
import { useSendMessage } from '@/hooks/useChat'

interface MessageInputProps {
  channelId: string
}

export function MessageInput({ channelId }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [showFormatToolbar, setShowFormatToolbar] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendMessage = useSendMessage()

  const handleSend = async () => {
    if (!message.trim() || sendMessage.isPending) return

    try {
      await sendMessage.mutateAsync({
        channel_id: channelId,
        content: message.trim()
      })
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-[#1e2a15] mt-auto">
      <div className="flex flex-col bg-[#f7f8f6] dark:bg-[#25331a] border border-border-light rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
        {/* Format Toolbar */}
        {showFormatToolbar && (
          <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-200 dark:border-gray-700/50">
            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Bold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 000 2h3a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 100 2h10a5 5 0 005-5V9a5 5 0 00-5-5H6a1 1 0 00-1 1v1zm8 5a3 3 0 013 3v4a3 3 0 01-3 3H9V9h4z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Italic">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a1 1 0 000 2h2l-2 8H6a1 1 0 100 2h8a1 1 0 100-2h-2l2-8h2a1 1 0 100-2H8z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="List">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent border-none focus:ring-0 p-3 text-text-dark dark:text-white placeholder-gray-400 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
          placeholder={`Message #${channelId}...`}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowFormatToolbar(true)}
          rows={1}
        />

        {/* Actions Footer */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Attach file"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Emoji"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Mention"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-primary hover:bg-[#62d10f] disabled:opacity-50 disabled:cursor-not-allowed text-text-dark font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-[11px] text-gray-400">
          <strong>Shift + Enter</strong> to add a new line
        </p>
      </div>
    </div>
  )
}

