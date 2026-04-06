import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/lib/db'
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        toName: user.name,
        toEmail: user.email,
        resetUrl: url,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log('[auth] sendVerificationEmail callback triggered for:', user.email)
      try {
        await sendVerificationEmail({
          toName: user.name,
          toEmail: user.email,
          verificationUrl: url,
        })
        console.log('[auth] sendVerificationEmail completed OK')
      } catch (err) {
        console.error('[auth] sendVerificationEmail FAILED:', err)
        throw err
      }
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
