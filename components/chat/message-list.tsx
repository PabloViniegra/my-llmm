'use client'

import type { UIMessage } from 'ai'
import { isTextUIPart } from 'ai'
import { BotMessageSquare, Sparkles } from 'lucide-react'
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
    void messages.length
    void isLoading
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant',
  )

  if (visibleMessages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center max-w-sm space-y-4">
          <div className="flex items-center justify-center">
            <div
              className="size-14 rounded-2xl flex items-center justify-center relative"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.6 0.22 285), oklch(0.65 0.2 230))',
                boxShadow: '0 4px 24px oklch(0.6 0.22 285 / 0.3)',
              }}
            >
              <BotMessageSquare
                className="size-7 text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How can I help you?
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Ask me anything — I&apos;m powered by the best open-source models.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-1">
            {[
              'Explain something complex',
              'Write some code',
              'Brainstorm ideas',
            ].map((suggestion) => (
              <span
                key={suggestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-brand-muted text-brand border border-brand/15 tracking-tight"
              >
                <Sparkles className="size-3" />
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="flex flex-col gap-3 py-6 max-w-3xl mx-auto">
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
