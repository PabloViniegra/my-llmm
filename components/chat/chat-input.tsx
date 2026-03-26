'use client'

import { ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

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

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 rounded-2xl px-4 py-3 bg-muted/50 border border-border/50 ring-1 ring-foreground/5">
          <Textarea
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value)
              // Auto-resize to fit content
              e.currentTarget.style.height = 'auto'
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
            rows={1}
            className="flex-1 resize-none border-none bg-transparent shadow-none text-[15px] focus-visible:ring-0 min-h-[24px] max-h-[200px] leading-relaxed p-0"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={onSubmit}
            disabled={!input.trim() || isLoading}
            className="size-8 shrink-0 rounded-full"
            aria-label="Send message"
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
