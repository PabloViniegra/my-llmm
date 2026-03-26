'use client'

import { m } from 'framer-motion'
import { Clock, Moon, Plus, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ChatHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <m.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-10 px-4 pt-4 pb-2 flex items-center justify-between max-w-2xl mx-auto w-full"
    >
      {/* Left: history */}
      <button
        aria-label="Conversation history"
        className={cn(
          'size-8 rounded-full flex items-center justify-center glass',
          'transition-opacity duration-150 hover:opacity-70 active:scale-95',
        )}
      >
        <Clock className="size-3.5 text-foreground/55" strokeWidth={1.8} />
      </button>

      {/* Center: title pill */}
      <div className="glass rounded-full px-4 py-1.5">
        <span className="text-[13px] font-semibold tracking-tight text-foreground/75 select-none">
          LLM Chat
        </span>
      </div>

      {/* Right: theme + new */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className={cn(
            'size-8 rounded-full flex items-center justify-center glass',
            'transition-opacity duration-150 hover:opacity-70 active:scale-95',
          )}
        >
          {isDark
            ? <Sun className="size-3.5 text-foreground/55" strokeWidth={1.8} />
            : <Moon className="size-3.5 text-foreground/55" strokeWidth={1.8} />
          }
        </button>
        <button
          aria-label="New conversation"
          className={cn(
            'size-8 rounded-full flex items-center justify-center glass',
            'transition-opacity duration-150 hover:opacity-70 active:scale-95',
          )}
        >
          <Plus className="size-3.5 text-foreground/55" strokeWidth={2} />
        </button>
      </div>
    </m.header>
  )
}
