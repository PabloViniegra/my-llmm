'use client'

import type { UIMessage } from 'ai'
import { isTextUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './message-bubble'
import { ThinkingIndicator } from './thinking-indicator'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reference deps so React Compiler tracks them; scroll to bottom on change
    void messages.length
    void isLoading
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant',
  )

  if (visibleMessages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground text-[15px]">
          Start a conversation
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="flex flex-col gap-4 py-6 max-w-3xl mx-auto">
        {visibleMessages.map((message) => {
          const textContent = message.parts
            .filter(isTextUIPart)
            .map((p) => p.text)
            .join('')
          if (!textContent) return null
          return (
            <MessageBubble
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={textContent}
            />
          )
        })}
        {isLoading && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
