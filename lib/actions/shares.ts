'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')
  return session
}

async function requireOwner(conversationId: string, userId: string) {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    select: { userId: true },
  })
  if (!conversation) throw new Error('Conversation not found')
  if (conversation.userId !== userId) throw new Error('Forbidden')
  return conversation
}

export async function shareConversation(
  conversationId: string,
  identifier: string,
): Promise<{ error?: string }> {
  const session = await requireSession()
  await requireOwner(conversationId, session.user.id)

  const targetUser = await db.user.findFirst({
    where: {
      OR: [{ email: identifier }, { name: identifier }],
    },
    select: { id: true, name: true, email: true },
  })

  if (!targetUser) return { error: 'Usuario no encontrado' }
  if (targetUser.id === session.user.id) return { error: 'No puedes compartir contigo mismo' }

  const existing = await db.conversationShare.findUnique({
    where: {
      conversationId_sharedWithUserId: {
        conversationId,
        sharedWithUserId: targetUser.id,
      },
    },
  })
  if (existing) return { error: 'Ya tiene acceso a esta conversación' }

  await db.conversationShare.create({
    data: {
      conversationId,
      sharedByUserId: session.user.id,
      sharedWithUserId: targetUser.id,
    },
  })

  revalidatePath(`/chat/${conversationId}`)
  return {}
}

export async function revokeShare(
  conversationId: string,
  sharedWithUserId: string,
): Promise<void> {
  const session = await requireSession()
  await requireOwner(conversationId, session.user.id)

  await db.conversationShare.deleteMany({
    where: { conversationId, sharedWithUserId },
  })

  revalidatePath(`/chat/${conversationId}`)
}

export async function getConversationShares(conversationId: string) {
  const session = await requireSession()
  await requireOwner(conversationId, session.user.id)

  return db.conversationShare.findMany({
    where: { conversationId },
    include: {
      sharedWith: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
