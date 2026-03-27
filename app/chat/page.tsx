'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useState } from 'react'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { MessageList } from '@/components/chat/message-list'

const transport = new DefaultChatTransport({ api: '/api/chat' })

export default function ChatPage() {
  const [input, setInput] = useState('')
  const lastInputRef = useRef('')
  const { messages, sendMessage, status, error } = useChat({ transport })
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    lastInputRef.current = input
    sendMessage({ text: input })
    setInput('')
  }

  const handleRetry = () => {
    if (!lastInputRef.current || isLoading) return
    sendMessage({ text: lastInputRef.current })
  }

  const handleSuggestion = (text: string) => {
    if (isLoading) return
    lastInputRef.current = text
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSuggestion={handleSuggestion}
      />
      {error && (
        <div role="alert" className="mx-auto max-w-2xl w-full px-4 py-2">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl glass text-sm text-destructive">
            <span>Algo salió mal. Por favor, inténtalo de nuevo.</span>
            <button
              onClick={handleRetry}
              className="shrink-0 text-xs font-medium underline underline-offset-2 hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
            >
              Reintentar
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
