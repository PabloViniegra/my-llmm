import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/lib/db'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: replace with real email provider
      console.log(`[reset-password] Para ${user.email}: ${url}`)
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
