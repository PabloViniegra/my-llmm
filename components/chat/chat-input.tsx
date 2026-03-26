'use client'

import { ArrowUp, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) onSubmit()
    }
  }

  const canSubmit = Boolean(input.trim()) && !isLoading

  return (
    <div className="relative px-4 pb-5 pt-3">
      {/* Ambient glow behind the input when loading */}
      {isLoading && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 inset-y-0 rounded-2xl aura-pulse"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, oklch(0.6 0.22 285 / 0.18) 0%, transparent 70%)',
          }}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl px-4 py-3',
            'bg-card border border-border/60',
            'shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]',
            'dark:shadow-[0_2px_16px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2)]',
            'transition-shadow duration-200',
            isLoading && 'brand-glow',
          )}
        >
          <Textarea
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value)
              e.currentTarget.style.height = 'auto'
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything…"
            rows={1}
            className="flex-1 resize-none border-none bg-transparent shadow-none text-[14.5px] leading-relaxed focus-visible:ring-0 min-h-[24px] max-h-[200px] p-0 placeholder:text-muted-foreground/50 font-[inherit]"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={onSubmit}
            disabled={!canSubmit && !isLoading}
            aria-label={isLoading ? 'Stop generation' : 'Send message'}
            className={cn(
              'size-8 shrink-0 rounded-xl transition-all duration-200',
              canSubmit
                ? 'bg-brand hover:bg-brand/90 text-white shadow-[0_2px_8px_oklch(0.6_0.22_285_/_0.35)]'
                : isLoading
                  ? 'bg-foreground/10 hover:bg-foreground/15 text-foreground'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {isLoading ? (
              <Square className="size-3.5 fill-current" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-2 tracking-wide">
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
