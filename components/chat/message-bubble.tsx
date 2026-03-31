'use client'

import { memo } from 'react'
import { m } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export const MessageBubble = memo(function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <m.div
      role="article"
      aria-label={isUser ? 'Your message' : 'Assistant response'}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className={cn('flex gap-3 items-end', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* AI avatar */}
      {!isUser && (
        <m.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22, delay: 0.04 }}
          className="size-7 shrink-0 mb-0.5 rounded-full brand-gradient flex items-center justify-center shadow-[0_2px_10px_var(--shadow-brand-sm)]"
        >
          <Sparkles className="size-3.5 text-white" strokeWidth={1.75} />
        </m.div>
      )}

      {/* Bubble */}
      <m.div
        initial={{ opacity: 0, x: isUser ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30, delay: 0.03 }}
        className={cn(
          'max-w-[80%] px-4 py-3',
          isUser
            ? [
                'rounded-[20px] rounded-br-[6px]',
                'brand-gradient text-white',
                '[box-shadow:0_4px_20px_var(--shadow-brand),inset_0_1px_0_rgba(255,255,255,0.2)]',
              ]
            : [
                'rounded-[20px] rounded-bl-[6px]',
                'glass',
                'text-foreground',
              ],
        )}
      >
        {isUser ? (
          <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        ) : (
          <div className="text-[14.5px] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                pre: ({ children }) => (
                  <pre className="rounded-xl overflow-x-auto my-3 bg-foreground/5 border border-border/30 p-0">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => {
                  const isBlock = !!className
                  if (isBlock) {
                    return (
                      <code className={cn('block p-3.5 text-[13px] font-mono leading-relaxed', className)}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded-md text-[13px] font-mono bg-foreground/8 border border-border/30">
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
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-brand/40 pl-3 my-3 text-foreground/60 italic">
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
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                hr: () => <hr className="my-4 border-border/30" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </m.div>
    </m.div>
  )
})
