import { SidebarNav } from '@/components/chat/sidebar-nav'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-dvh w-full">
        <SidebarNav />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  )
}
