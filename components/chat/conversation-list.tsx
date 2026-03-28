import { headers } from 'next/headers'
import { MessageSquare } from 'lucide-react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ConversationGroup } from '@/components/chat/conversation-group'
import { ConversationItem } from '@/components/chat/conversation-item'

const GROUP_ORDER = ['Hoy', 'Ayer', 'Esta semana', 'Más antiguo'] as const
type GroupLabel = (typeof GROUP_ORDER)[number]

function getDateGroup(date: Date): GroupLabel {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86_400_000)
  const weekAgo = new Date(today.getTime() - 7 * 86_400_000)
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (d.getTime() === today.getTime()) return 'Hoy'
  if (d.getTime() === yesterday.getTime()) return 'Ayer'
  if (d.getTime() > weekAgo.getTime()) return 'Esta semana'
  return 'Más antiguo'
}

export async function ConversationList() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: { id: true, title: true, updatedAt: true },
  })

  if (conversations.length === 0) {
    return (
      <div className="px-2 py-8 flex flex-col items-center gap-2 text-center">
        <MessageSquare className="size-5 text-muted-foreground/30" strokeWidth={1.5} />
        <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
          Inicia una nueva conversación
        </p>
      </div>
    )
  }

  const grouped = new Map<GroupLabel, typeof conversations>()
  for (const conv of conversations) {
    const group = getDateGroup(conv.updatedAt)
    if (!grouped.has(group)) grouped.set(group, [])
    grouped.get(group)!.push(conv)
  }

  return (
    <div className="flex flex-col gap-1">
      {GROUP_ORDER.filter((g) => grouped.has(g)).map((group) => (
        <ConversationGroup key={group} label={group}>
          {grouped.get(group)!.map((conv) => (
            <ConversationItem
              key={conv.id}
              id={conv.id}
              title={conv.title}
              updatedAt={conv.updatedAt}
            />
          ))}
        </ConversationGroup>
      ))}
    </div>
  )
}
