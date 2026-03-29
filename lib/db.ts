import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/client'
import { env } from '@/lib/env'

const createClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

// Singleton pattern — reuse in dev (HMR) and prod
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createClient()

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
