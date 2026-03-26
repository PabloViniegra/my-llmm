import { createGateway } from '@ai-sdk/gateway'
import type { ModelMessage } from 'ai'
import { streamText } from 'ai'
import { z } from 'zod'

const openrouter = createGateway({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export const runtime = 'edge'

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.union([z.string().max(32_000), z.array(z.unknown())]),
      }),
    )
    .max(100),
})

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 })
  }

  try {
    const result = streamText({
      model: openrouter('meta-llama/llama-3.1-8b-instruct:free'),
      system: 'You are a helpful AI assistant. Be concise and clear.',
      messages: parsed.data.messages as ModelMessage[],
    })
    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error('[/api/chat]', err)
    return new Response('Internal server error', { status: 500 })
  }
}
