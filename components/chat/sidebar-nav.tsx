'use client'

import { BotMessageSquare, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export function SidebarNav() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-3 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden min-w-0">
          <div className="size-7 rounded-lg flex items-center justify-center shrink-0 bg-brand">
            <BotMessageSquare
              className="size-4 text-white"
              strokeWidth={1.75}
            />
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-foreground truncate">
            LLM Chat
          </span>
        </div>

        {/* Icon-only mode */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          <div className="size-7 rounded-lg flex items-center justify-center bg-brand">
            <BotMessageSquare
              className="size-4 text-white"
              strokeWidth={1.75}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="New conversation"
          className="shrink-0 size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent group-data-[collapsible=icon]:hidden"
        >
          <Plus className="size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New conversation"
              className="rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Plus className="size-4 shrink-0" />
              <span>New conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-center justify-between gap-1.5 px-3 py-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings className="size-4" />
        </Button>
        <ModeToggle />
        <SidebarTrigger className="ml-auto size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent" />
      </SidebarFooter>
    </Sidebar>
  )
}
