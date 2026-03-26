'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import { ChatInput } from '@/components/chat/chat-input'
import { MessageList } from '@/components/chat/message-list'

const transport = new DefaultChatTransport({ api: '/api/chat' })

export default function ChatPage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error } = useChat({ transport })
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleSuggestion = (text: string) => {
    if (isLoading) return
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSuggestion={handleSuggestion}
      />
      {error && (
        <div
          role="alert"
          className="mx-auto max-w-3xl w-full px-4 py-2"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20 text-sm text-destructive">
            <span>Something went wrong. Please try again.</span>
            <button
              onClick={handleSubmit}
              className="shrink-0 text-xs font-medium underline underline-offset-2 hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
