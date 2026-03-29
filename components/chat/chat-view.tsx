'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { MessageList } from '@/components/chat/message-list'
import { ReadOnlyBanner } from '@/components/chat/read-only-banner'

interface ChatViewProps {
  conversationId: string
  initialMessages?: UIMessage[]
  isReadOnly?: boolean
  isOwner?: boolean
  ownerName?: string
}

export function ChatView({
  conversationId,
  initialMessages,
  isReadOnly = false,
  isOwner = false,
  ownerName,
}: ChatViewProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const lastInputRef = useRef('')
  const prevIsLoadingRef = useRef(false)

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { conversationId } }),
    [conversationId],
  )

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
  })
  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading && messages.length > 0) {
      router.refresh()
    }
    prevIsLoadingRef.current = isLoading
  }, [isLoading, messages.length, router])

  const handleSubmit = () => {
    if (!input.trim() || isLoading || isReadOnly) return
    lastInputRef.current = input
    sendMessage({ text: input })
    setInput('')
  }

  const handleRetry = () => {
    if (!lastInputRef.current || isLoading || isReadOnly) return
    sendMessage({ text: lastInputRef.current })
  }

  const handleSuggestion = (text: string) => {
    if (isLoading || isReadOnly) return
    lastInputRef.current = text
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader conversationId={conversationId} isOwner={isOwner} />
      {isReadOnly && ownerName && <ReadOnlyBanner ownerName={ownerName} />}
      <MessageList messages={messages} isLoading={isLoading} onSuggestion={handleSuggestion} />
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
        disabled={isReadOnly}
      />
    </div>
  )
}
