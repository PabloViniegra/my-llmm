'use client'

import { m } from 'framer-motion'
import { BotMessageSquare } from 'lucide-react'

const dotVariants = {
  idle: { y: 0, opacity: 0.5 },
  bounce: { y: -5, opacity: 1 },
}

export function ThinkingIndicator() {
  return (
    <m.output
      aria-live="polite"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="flex gap-3 items-end"
    >
      {/* Avatar */}
      <m.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
          delay: 0.05,
        }}
        className="size-7 rounded-full shrink-0 flex items-center justify-center brand-gradient mb-0.5 shadow-[0_2px_10px_var(--shadow-brand-sm)]"
      >
        <BotMessageSquare className="size-3.5 text-brand-foreground" strokeWidth={1.75} />
      </m.div>

      {/* Animated dots bubble */}
      <m.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          delay: 0.06,
        }}
        className="rounded-2xl rounded-bl-sm bg-card border border-border/50 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] px-4 py-3.5"
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <m.span
              key={i}
              className="size-2 rounded-full"
              style={{ background: 'var(--thinking-dot-color)' }}
              variants={dotVariants}
              initial="idle"
              animate="bounce"
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.5,
                ease: 'easeInOut',
                delay: i * 0.14,
              }}
            />
          ))}
        </div>
        <span className="sr-only">AI is thinking</span>
      </m.div>
    </m.output>
  )
}
