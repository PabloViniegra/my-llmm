import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ChatView } from '@/components/chat/chat-view'
import type { UIMessage } from '@ai-sdk/react'

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
    const initialMessages: UIMessage[] = ownedConversation.messages.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      parts: [{ type: 'text' as const, text: m.content }],
    }))

    const canShare = ownedConversation.messages.some((m) => m.role === 'assistant')

    return (
      <ChatView
        key={id}
        conversationId={id}
        initialMessages={initialMessages}
        isReadOnly={false}
        isOwner={true}
        canShare={canShare}
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
      isReadOnly={true}
      isOwner={false}
      ownerName={share.sharedBy.name}
    />
  )
}
