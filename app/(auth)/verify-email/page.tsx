'use client'

import { ArrowLeft, MailCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/glass/card'
import { sendVerificationEmail } from '@/lib/auth-client'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    if (!email) return
    setResending(true)
    setError(null)
    setResent(false)

    const { error: resendError } = await sendVerificationEmail({
      email,
      callbackURL: '/chat',
    })

    if (resendError) {
      setError(
        resendError.message ??
          'Could not resend email. Please try again.',
      )
    } else {
      setResent(true)
    }
    setResending(false)
  }

  return (
    <Card className="w-full max-w-sm text-center" variant="glass">
      <CardHeader>
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="size-7 text-primary" />
        </div>
        <CardTitle className="font-heading text-2xl">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a verification link to{' '}
          {email ? (
            <strong className="text-foreground">{email}</strong>
          ) : (
            'your email address'
          )}
          . Click the link to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {resent && (
          <output className="block text-sm text-emerald-600 dark:text-emerald-400">
            Email resent successfully.
          </output>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending || !email}
        >
          <RefreshCw className={`size-4 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Resending...' : 'Resend verification email'}
        </Button>

        <p className="text-xs text-muted-foreground">
          If you can't find the email, check your spam folder.
        </p>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
