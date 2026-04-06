import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'

const createClient = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
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
