'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function createConversation(): Promise<never> {
  const session = await requireSession()
  const conversation = await db.conversation.create({
    data: { userId: session.user.id, title: 'New Chat' },
  })
  redirect(`/chat/${conversation.id}`)
}

export async function deleteConversation(id: string): Promise<void> {
  const session = await requireSession()
  const conversation = await db.conversation.findUnique({ where: { id } })
  if (!conversation || conversation.userId !== session.user.id) throw new Error('Not found')
  await db.conversation.delete({ where: { id } })
  revalidatePath('/chat')
}

export async function renameConversation(id: string, title: string): Promise<void> {
  const session = await requireSession()
  const trimmed = title.trim()
  if (!trimmed) throw new Error('Title cannot be empty')
  const conversation = await db.conversation.findUnique({ where: { id } })
  if (!conversation || conversation.userId !== session.user.id) throw new Error('Not found')
  await db.conversation.update({ where: { id }, data: { title: trimmed } })
  revalidatePath('/chat')
  revalidatePath(`/chat/${id}`)
}
