'use client'

import { MessageSquareIcon, PlusIcon, SettingsIcon } from 'lucide-react'
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
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 p-4">
        <span className="text-base font-semibold truncate group-data-[collapsible=icon]:hidden">
          AI Chat
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="New conversation"
          className="shrink-0"
        >
          <PlusIcon />
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New conversation">
              <MessageSquareIcon />
              <span>New conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-center justify-between gap-2 p-4">
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <ModeToggle />
        <SidebarTrigger className="ml-auto" />
      </SidebarFooter>
    </Sidebar>
  )
}
