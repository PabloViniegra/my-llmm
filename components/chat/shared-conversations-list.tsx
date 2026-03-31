import { headers } from 'next/headers'
import { Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { SharedConversationItem } from '@/components/chat/shared-conversation-item'

export async function SharedConversationsList() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const shares = await db.conversationShare.findMany({
    where: { sharedWithUserId: session.user.id },
    include: {
      conversation: {
        select: { id: true, title: true, updatedAt: true },
      },
      sharedBy: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  if (shares.length === 0) return null

  return (
    <div className="mt-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 px-2 py-1">
        <Users className="size-3 text-muted-foreground/50" strokeWidth={1.8} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
          Shared with me
        </span>
      </div>
      {shares.map((share) => (
        <SharedConversationItem
          key={share.id}
          id={share.conversation.id}
          title={share.conversation.title}
          updatedAt={share.conversation.updatedAt}
          ownerName={share.sharedBy.name}
          ownerImage={share.sharedBy.image}
        />
      ))}
    </div>
  )
}
