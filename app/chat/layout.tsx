import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { MeshBackground } from '@/components/chat/mesh-background'
import { SidebarNav } from '@/components/chat/sidebar-nav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ConversationList } from '@/components/chat/conversation-list'
import { ConversationListSkeleton } from '@/components/chat/conversation-list-skeleton'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative flex min-h-dvh w-full">
        <MeshBackground />
        <SidebarNav>
          <Suspense fallback={<ConversationListSkeleton />}>
            <ConversationList />
          </Suspense>
        </SidebarNav>
        <main className="relative z-0 flex flex-1 flex-col min-w-0">{children}</main>
      </div>
    </SidebarProvider>
  )
}
