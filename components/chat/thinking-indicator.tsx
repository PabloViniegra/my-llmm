import { BotMessageSquare } from 'lucide-react'

export function ThinkingIndicator() {
  return (
    <output aria-live="polite" className="flex gap-3 items-end message-animate">
      {/* Avatar matches message-bubble */}
      <div className="size-7 rounded-lg shrink-0 flex items-center justify-center bg-brand mb-0.5">
        <BotMessageSquare className="size-3.5 text-white" strokeWidth={1.75} />
      </div>

      {/* Animated dots bubble */}
      <div className="rounded-2xl rounded-bl-sm bg-card border border-border/50 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] px-4 py-3.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span
            className="thinking-dot size-2 rounded-full"
            style={{ background: 'oklch(0.6 0.22 285 / 0.7)' }}
          />
          <span
            className="thinking-dot size-2 rounded-full"
            style={{ background: 'oklch(0.6 0.22 285 / 0.7)' }}
          />
          <span
            className="thinking-dot size-2 rounded-full"
            style={{ background: 'oklch(0.6 0.22 285 / 0.7)' }}
          />
        </div>
        <span className="sr-only">AI is thinking</span>
      </div>
    </output>
  )
}
