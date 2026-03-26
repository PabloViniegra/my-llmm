import { BotMessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 items-end message-animate',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="size-7 rounded-lg shrink-0 flex items-center justify-center bg-brand mb-0.5">
          <BotMessageSquare
            className="size-3.5 text-white"
            strokeWidth={1.75}
          />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-2.5',
          isUser
            ? [
                'rounded-br-sm',
                'bg-brand text-white',
                'shadow-[0_2px_8px_oklch(0.6_0.22_285_/_0.3)]',
                'dark:shadow-[0_2px_12px_oklch(0.68_0.24_285_/_0.35)]',
              ]
            : [
                'rounded-bl-sm',
                'bg-card border border-border/50',
                'shadow-[0_1px_6px_rgba(0,0,0,0.06)]',
                'dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)]',
                'text-foreground',
              ],
        )}
      >
        <p
          className={cn(
            'text-[14.5px] leading-relaxed whitespace-pre-wrap break-words',
            isUser ? 'text-white' : 'text-foreground',
          )}
        >
          {content}
        </p>
      </div>
    </div>
  )
}
