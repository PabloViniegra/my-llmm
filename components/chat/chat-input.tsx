'use client'

import { AnimatePresence, m } from 'framer-motion'
import { ArrowUp, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const MotionButton = m.create(Button)

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ChatInput({ input, onInputChange, onSubmit, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) onSubmit()
    }
  }

  const canSubmit = Boolean(input.trim()) && !isLoading

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative px-4 pb-5 pt-2 max-w-2xl mx-auto w-full"
    >
      {/* Loading aura */}
      <AnimatePresence>
        {isLoading && (
          <m.div
            key="aura"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-x-4 inset-y-0 rounded-full aura-pulse"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, var(--shadow-brand-aura) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          'relative flex items-center gap-2 rounded-full px-5 py-3 glass-lg',
          isLoading && 'ring-1 ring-[var(--shadow-brand-sm)]',
        )}
      >
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta lo que quieras…"
          rows={1}
          className="flex-1 resize-none border-none bg-transparent dark:bg-transparent shadow-none text-[14.5px] leading-relaxed min-h-[24px] max-h-[160px] p-0 placeholder:text-foreground/30 font-[inherit] focus-visible:ring-0 focus-visible:border-transparent"
          disabled={isLoading}
          aria-label="Chat input"
        />

        <MotionButton
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: canSubmit || isLoading ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={onSubmit}
          disabled={!canSubmit && !isLoading}
          aria-label={isLoading ? 'Stop generation' : 'Send message'}
          className={cn(
            'size-11 shrink-0 rounded-full transition-all duration-200',
            canSubmit
              ? 'brand-gradient text-white shadow-[0_3px_14px_var(--shadow-brand)] hover:opacity-90'
              : isLoading
                ? 'bg-foreground/10 text-foreground hover:bg-foreground/15'
                : 'bg-foreground/8 text-foreground/30 hover:bg-foreground/8',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <m.span
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Square className="size-3 fill-current" />
              </m.span>
            ) : (
              <m.span
                key="send"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <ArrowUp className="size-4" />
              </m.span>
            )}
          </AnimatePresence>
        </MotionButton>
      </div>

      <p className="text-center text-[10.5px] text-foreground/45 mt-2 tracking-wide">
        Enter para enviar · Shift+Enter nueva línea
      </p>
    </m.div>
  )
}
