import type { UIMessage } from '@ai-sdk/react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { ChatView } from '@/components/chat/chat-view'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  // Check owner access first
  const ownedConversation = await db.conversation.findUnique({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })

  if (ownedConversation) {
    const initialMessages: UIMessage[] = ownedConversation.messages.map(
      (m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: m.content }],
      }),
    )

    const canShare = ownedConversation.messages.some(
      (m) => m.role === 'assistant',
    )

    return (
      <ChatView
        key={id}
        conversationId={id}
        initialMessages={initialMessages}
        mode={{ kind: 'owner', canShare }}
      />
    )
  }

  // Check shared access
  const share = await db.conversationShare.findUnique({
    where: {
      conversationId_sharedWithUserId: {
        conversationId: id,
        sharedWithUserId: session.user.id,
      },
    },
    include: {
      conversation: {
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      },
      sharedBy: { select: { name: true } },
    },
  })

  if (!share) notFound()

  const initialMessages: UIMessage[] = share.conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: m.content }],
  }))

  return (
    <ChatView
      key={id}
      conversationId={id}
      initialMessages={initialMessages}
      mode={{ kind: 'viewer', ownerName: share.sharedBy.name ?? '' }}
    />
  )
}
