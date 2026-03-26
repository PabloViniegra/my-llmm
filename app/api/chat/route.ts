import { OpenRouter } from '@openrouter/sdk'
import type { Message } from '@openrouter/sdk/models'
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { z } from 'zod'

export const runtime = 'edge'

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// UIMessage shape sent by DefaultChatTransport from @ai-sdk/react
// Parts carry the text; other fields are stripped/ignored
const uiMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    parts: z
      .array(
        z
          .object({
            type: z.string(),
            text: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    // Some transports still include a top-level content string — support both
    content: z.string().optional(),
  })
  .passthrough()

const bodySchema = z
  .object({
    messages: z.array(uiMessageSchema).max(100),
  })
  .passthrough()

/** Extract the text content from a UIMessage (parts or fallback content string) */
function extractText(msg: z.infer<typeof uiMessageSchema>): string {
  if (msg.parts && msg.parts.length > 0) {
    return msg.parts
      .filter((p) => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text as string)
      .join('')
  }
  return msg.content ?? ''
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 })
  }

  // Convert UIMessages → OpenRouter messages (role + content string)
  const orMessages: Message[] = parsed.data.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: extractText(m),
    }))
    .filter((m) => m.content.trim().length > 0) as Message[]

  if (orMessages.length === 0) {
    return new Response('No messages', { status: 400 })
  }

  const textId = 'text-0'

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const openRouterStream = await openrouter.chat.send({
        chatGenerationParams: {
          model: 'openrouter/free',
          messages: orMessages,
          stream: true,
        },
      })

      writer.write({ type: 'text-start', id: textId })

      for await (const chunk of openRouterStream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          writer.write({ type: 'text-delta', id: textId, delta })
        }
      }

      writer.write({ type: 'text-end', id: textId })
    },
    onError: (err) => {
      console.error('[/api/chat]', err)
      return 'Something went wrong. Please try again.'
    },
  })

  return createUIMessageStreamResponse({ stream })
}
