import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/lib/db'
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Don't await — fire-and-forget, same pattern as email verification.
      void sendResetPasswordEmail({
        toName: user.name,
        toEmail: user.email,
        resetUrl: url,
      }).catch((error: unknown) => {
        console.error('[reset-password] Failed to send reset password email', {
          userId: user.id,
          email: user.email,
          error,
        })
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Don't await — avoids timing attacks. Fire-and-forget.
      void sendVerificationEmail({
        toName: user.name,
        toEmail: user.email,
        verificationUrl: url,
      }).catch((error: unknown) => {
        console.error(
          '[email-verification] Failed to send verification email',
          {
            userId: user.id,
            email: user.email,
            error,
          },
        )
      })
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
