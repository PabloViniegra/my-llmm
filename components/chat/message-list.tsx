'use client'

import type { UIMessage } from 'ai'
import { isTextUIPart } from 'ai'
import { AnimatePresence, m } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MessageBubble } from './message-bubble'
import { ThinkingIndicator } from './thinking-indicator'

const MotionButton = m.create(Button)

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
  onSuggestion?: (text: string) => void
}

const suggestions = [
  'Explain how neural networks learn',
  'Write me a function in Python',
  'Generate ideas for a product',
]

export function MessageList({ messages, isLoading, onSuggestion }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(raf)
  }, [messages.length, isLoading])

  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant',
  )

  return (
    <AnimatePresence mode="popLayout">
      {visibleMessages.length === 0 && !isLoading ? (
        <m.div
          key="empty-state"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 items-center justify-center px-4"
        >
          <div className="text-center max-w-sm space-y-5">
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 22,
                delay: 0.06,
              }}
              className="flex items-center justify-center"
            >
              <div
                className="size-14 rounded-full flex items-center justify-center brand-gradient"
                style={{
                  boxShadow: '0 4px 24px var(--shadow-brand)',
                }}
              >
                <Sparkles
                  className="size-7 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                How can I help you?
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Powered by open-source models via OpenRouter.
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {suggestions.map((suggestion, i) => (
                <MotionButton
                  key={suggestion}
                  variant="ghost"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.055,
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSuggestion?.(suggestion)}
                  disabled={isLoading}
                  className="rounded-full h-auto px-3.5 py-1.5 text-[12px] font-medium glass text-foreground/65 tracking-tight hover:text-foreground hover:bg-transparent disabled:opacity-40"
                >
                  {suggestion}
                </MotionButton>
              ))}
            </m.div>
          </div>
        </m.div>
      ) : (
        <div
          key="message-list"
          className="flex-1 overflow-y-scroll px-4"
        >
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="flex flex-col gap-4 py-6 max-w-2xl mx-auto"
          >
            <AnimatePresence initial={false}>
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
            </AnimatePresence>
            <AnimatePresence>
              {isLoading && <ThinkingIndicator key="thinking" />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
