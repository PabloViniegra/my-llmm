import { OpenRouter } from '@openrouter/sdk'
import type { Message } from '@openrouter/sdk/models'
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { env } from '@/lib/env'

const openrouter = new OpenRouter({ apiKey: env.OPENROUTER_API_KEY })

const uiMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    parts: z
      .array(z.object({ type: z.string(), text: z.string().optional() }).passthrough())
      .optional(),
    content: z.string().optional(),
  })
  .passthrough()

const bodySchema = z
  .object({
    messages: z.array(uiMessageSchema).max(100),
    conversationId: z.string().optional(),
  })
  .passthrough()

function extractText(msg: z.infer<typeof uiMessageSchema>): string {
  if (msg.parts && msg.parts.length > 0) {
    return msg.parts
      .filter((p) => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text as string)
      .join('')
  }
  return msg.content ?? ''
}

async function generateTitleInBackground(
  conversationId: string,
  firstMessage: string,
): Promise<void> {
  try {
    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: `Generate a 4-6 word title in English for this conversation. Just the title, no punctuation or quotes: ${firstMessage}`,
          },
        ],
        stream: true,
      },
    })
    let title = ''
    for await (const chunk of stream) {
      title += chunk.choices[0]?.delta?.content ?? ''
    }
    const trimmed = title.trim().slice(0, 80)
    if (trimmed) {
      await db.conversation.update({ where: { id: conversationId }, data: { title: trimmed } })
      revalidatePath('/chat')
      revalidatePath(`/chat/${conversationId}`)
    }
  } catch (err) {
    console.error('[generateTitle]', err)
  }
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) return new Response('Invalid request', { status: 400 })

  const { messages, conversationId } = parsed.data
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')

  // Persist user message and maybe trigger title generation
  let ownsConversation = false

  if (conversationId && lastUserMsg) {
    const session = await auth.api.getSession({ headers: req.headers })
    if (session) {
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
        include: { _count: { select: { messages: true } } },
      })
      if (conversation) {
        ownsConversation = true
        const userText = extractText(lastUserMsg)
        await db.message.create({
          data: { conversationId, role: 'user', content: userText },
        })
        if (conversation._count.messages === 0 && userText.trim()) {
          generateTitleInBackground(conversationId, userText).catch(console.error)
        }
      }
    }
  }

  const orMessages: Message[] = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: extractText(m) }))
    .filter((m) => m.content.trim().length > 0) as Message[]

  if (orMessages.length === 0) return new Response('No messages', { status: 400 })

  const textId = 'text-0'
  let assistantText = ''

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const openRouterStream = await openrouter.chat.send({
        chatGenerationParams: { model: 'openrouter/free', messages: orMessages, stream: true },
      })

      writer.write({ type: 'text-start', id: textId })

      for await (const chunk of openRouterStream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          assistantText += delta
          writer.write({ type: 'text-delta', id: textId, delta })
        }
      }

      writer.write({ type: 'text-end', id: textId })

      // Persist assistant message after stream completes
      if (conversationId && ownsConversation && assistantText.trim()) {
        await db.message
          .create({ data: { conversationId, role: 'assistant', content: assistantText } })
          .catch(console.error)
      }
    },
    onError: (err) => {
      console.error('[/api/chat]', err)
      return 'Something went wrong. Please try again.'
    },
  })

  return createUIMessageStreamResponse({ stream })
}
