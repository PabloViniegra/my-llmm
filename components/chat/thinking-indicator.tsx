'use client'

import { m } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function ThinkingIndicator() {
  return (
    <m.output
      aria-live="polite"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
      className="flex gap-3 items-end"
    >
      {/* Avatar with breathing glow */}
      <div className="relative shrink-0 mb-0.5">
        <m.div
          className="absolute rounded-full brand-gradient"
          style={{ inset: '-30%', filter: 'blur(6px)' }}
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <div className="relative size-7 rounded-full flex items-center justify-center brand-gradient shadow-sm">
          <Sparkles className="size-3.5 text-white" strokeWidth={1.75} />
        </div>
      </div>

      {/* Dots bubble */}
      <m.div
        initial={{ opacity: 0, x: -6, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
        className="rounded-2xl rounded-bl-sm bg-card border border-border/50 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] px-4 py-3.5"
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <m.span
              key={i}
              className="size-[7px] rounded-full bg-foreground/25"
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 0.85, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <span className="sr-only">La IA está pensando</span>
      </m.div>
    </m.output>
  )
}
