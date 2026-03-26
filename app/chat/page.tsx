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

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      {error && (
        <div
          role="alert"
          className="mx-auto max-w-3xl w-full px-4 py-2 text-sm text-destructive"
        >
          Something went wrong. Please try again.
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
