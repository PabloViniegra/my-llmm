'use client'

import { m } from 'framer-motion'
import { BotMessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <m.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className={cn(
        'flex gap-3 items-end',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <m.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22, delay: 0.04 }}
          className="size-7 rounded-lg shrink-0 flex items-center justify-center bg-brand mb-0.5"
        >
          <BotMessageSquare className="size-3.5 text-brand-foreground" strokeWidth={1.75} />
        </m.div>
      )}

      {/* Bubble */}
      <m.div
        initial={{ opacity: 0, x: isUser ? 8 : -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30, delay: 0.03 }}
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? [
                'rounded-br-sm',
                'bg-brand text-brand-foreground',
                'shadow-[0_2px_10px_oklch(from_var(--color-brand)_l_c_h_/_0.3)]',
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
        {isUser ? (
          <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        ) : (
          <div className="prose-chat text-[14.5px] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                pre: ({ children }) => (
                  <pre className="rounded-xl overflow-x-auto my-3 bg-muted/60 border border-border/40 p-0">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => {
                  const isBlock = !!className
                  if (isBlock) {
                    return (
                      <code className={cn(
                        'block p-3.5 text-[13px] font-mono leading-relaxed',
                        className,
                      )}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded-md text-[13px] font-mono bg-muted/70 border border-border/30 text-foreground">
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="text-[18px] font-bold tracking-tight mt-4 mb-2 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[16px] font-semibold tracking-tight mt-4 mb-2 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[15px] font-semibold mt-3 mb-1.5 first:mt-0">{children}</h3>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 space-y-1 list-disc list-inside">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-2 space-y-1 list-decimal list-inside">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-brand/40 pl-3 my-3 text-muted-foreground italic">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand transition-colors"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                hr: () => (
                  <hr className="my-4 border-border/40" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </m.div>
    </m.div>
  )
}
