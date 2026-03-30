'use client'

import { m } from 'framer-motion'
import { Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { ConversationListSkeleton } from '@/components/chat/conversation-list-skeleton'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const MotionButton = m.create(Button)

interface SidebarNavProps {
  children?: React.ReactNode
  sharedChildren?: React.ReactNode
}

export function SidebarNav({ children, sharedChildren }: SidebarNavProps) {
  const router = useRouter()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-3 py-3 border-b border-sidebar-border">
        {/* Expanded: brand wordmark */}
        <m.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden min-w-0"
        >
          <div className="size-7 rounded-lg overflow-hidden shrink-0">
            <Image
              src="/icon-llm-chat.png"
              alt="LLM Chat"
              width={28}
              height={28}
              loading="eager"
              className="size-full h-auto w-auto object-cover"
            />
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-foreground truncate font-mono">
            LLM
            <span className="text-muted-foreground font-sans font-medium">
              {' '}
              Chat
            </span>
          </span>
        </m.div>

        {/* Collapsed: icon only */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          <div className="size-7 rounded-lg overflow-hidden">
            <Image
              src="/icon-llm-chat.png"
              alt="LLM Chat"
              width={28}
              height={28}
              className="size-full h-auto w-auto object-cover"
            />
          </div>
        </div>

        {/* New conversation */}
        <MotionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          variant="ghost"
          size="icon"
          aria-label="New conversation"
          onClick={() => {
            router.push('/chat')
            router.refresh()
          }}
          className="shrink-0 size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent group-data-[collapsible=icon]:hidden"
        >
          <Plus className="size-4" />
        </MotionButton>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 group-data-[collapsible=icon]:hidden overflow-y-auto">
        <Suspense fallback={<ConversationListSkeleton />}>{children}</Suspense>
        {sharedChildren}
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-center justify-between gap-1.5 px-3 py-3 border-t border-sidebar-border">
        <m.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row items-center justify-between w-full gap-1.5"
        >
          <SidebarTrigger className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent" />
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden ml-auto">
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              variant="ghost"
              size="icon"
              aria-label="Settings"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Settings className="size-4" />
            </MotionButton>
            <ModeToggle />
          </div>
        </m.div>
      </SidebarFooter>
    </Sidebar>
  )
}
