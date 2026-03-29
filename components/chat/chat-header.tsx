'use client'

import { m } from 'framer-motion'
import { Clock, Moon, Plus, Sun, Share2 } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from '@/components/ui/sidebar'
import { ShareConversationModal } from '@/components/chat/share-conversation-modal'

const UserMenu = dynamic(() => import('@/components/chat/user-menu').then(m => m.UserMenu), { ssr: false })

interface ChatHeaderProps {
  conversationId?: string
  isOwner?: boolean
}

export function ChatHeader({ conversationId, isOwner = false }: ChatHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === 'dark'

  return (
    <TooltipProvider>
      <m.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-10 px-4 pt-4 pb-2 flex items-center justify-between max-w-2xl mx-auto w-full"
      >
        {/* Left: history */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Conversation history"
                onClick={toggleSidebar}
                className="rounded-full glass hover:bg-transparent hover:opacity-70 active:scale-95 size-9"
              >
                <Clock className="size-3.5 text-foreground/55" strokeWidth={1.8} />
              </Button>
            }
          />
          <TooltipContent>Historial</TooltipContent>
        </Tooltip>

        {/* Center: title pill */}
        <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
          <div className="size-4.5 rounded-[5px] overflow-hidden shrink-0">
            <Image src="/icon-llm-chat.png" alt="" width={18} height={18} className="size-full object-cover" aria-hidden="true" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-foreground/75 select-none font-heading">
            LLM Chat
          </span>
        </div>

        {/* Right: share + theme + new */}
        <div className="flex items-center gap-2">
          {isOwner && conversationId && (
            <>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Share conversation"
                      onClick={() => setShareOpen(true)}
                      className="rounded-full glass hover:bg-transparent hover:opacity-70 active:scale-95 size-9"
                    >
                      <Share2 className="size-3.5 text-foreground/55" strokeWidth={1.8} />
                    </Button>
                  }
                />
                <TooltipContent>Compartir</TooltipContent>
              </Tooltip>
              <ShareConversationModal
                conversationId={conversationId}
                open={shareOpen}
                onOpenChange={setShareOpen}
              />
            </>
          )}

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                  className="rounded-full glass hover:bg-transparent hover:opacity-70 active:scale-95 size-9"
                >
                  {mounted && (isDark
                    ? <Sun className="size-3.5 text-foreground/55" strokeWidth={1.8} />
                    : <Moon className="size-3.5 text-foreground/55" strokeWidth={1.8} />
                  )}
                </Button>
              }
            />
            <TooltipContent>{isDark ? 'Modo claro' : 'Modo oscuro'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="New conversation"
                  onClick={() => router.push('/chat')}
                  className="rounded-full glass hover:bg-transparent hover:opacity-70 active:scale-95 size-9"
                >
                  <Plus className="size-3.5 text-foreground/55" strokeWidth={2} />
                </Button>
              }
            />
            <TooltipContent>Nueva conversación</TooltipContent>
          </Tooltip>

          <UserMenu />
        </div>
      </m.header>
    </TooltipProvider>
  )
}
