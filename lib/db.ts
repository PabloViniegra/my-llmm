import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/client'

const createClient = () => {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  })
  return new PrismaClient({ adapter })
}

// Singleton pattern — reuse in dev (HMR) and prod
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
