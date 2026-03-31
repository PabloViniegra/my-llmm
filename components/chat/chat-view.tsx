'use client'

import type { UIMessage } from '@ai-sdk/react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { MessageList } from '@/components/chat/message-list'
import { ReadOnlyBanner } from '@/components/chat/read-only-banner'

/**
 * Discriminated union representing the user's access level for the conversation.
 *
 * - `owner`:  current user owns the conversation; canShare controls the share button.
 * - `viewer`: current user has read-only access via a share link.
 */
export type ChatMode =
  | { kind: 'owner'; canShare: boolean }
  | { kind: 'viewer'; ownerName: string }

interface ChatViewProps {
  conversationId: string
  initialMessages?: UIMessage[]
  mode: ChatMode
}

export function ChatView({
  conversationId,
  initialMessages,
  mode,
}: ChatViewProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const lastInputRef = useRef('')
  const prevIsLoadingRef = useRef(false)

  const isReadOnly = mode.kind === 'viewer'

  const transport = useMemo(
    () =>
      new DefaultChatTransport({ api: '/api/chat', body: { conversationId } }),
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
      <ChatHeader
        conversationId={conversationId}
        canShare={mode.kind === 'owner' && mode.canShare}
      />
      {mode.kind === 'viewer' && <ReadOnlyBanner ownerName={mode.ownerName} />}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSuggestion={handleSuggestion}
      />
      {error && (
        <div role="alert" className="mx-auto max-w-2xl w-full px-4 py-2">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl glass text-sm text-destructive">
            <span>Something went wrong. Please try again.</span>
            <button
              onClick={handleRetry}
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
        disabled={isReadOnly}
      />
    </div>
  )
}
