import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default('file:./prisma/dev.db'),
  OPENROUTER_API_KEY: z.string().default(''),
  NEXT_PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export const env = envSchema.parse(process.env)
