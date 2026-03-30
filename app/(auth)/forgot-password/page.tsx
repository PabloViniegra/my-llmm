'use client'

import { Mail, SendHorizonal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/glass/card'
import { Input } from '@/components/ui/glass/input'
import { Label } from '@/components/ui/glass/label'
import { authClient } from '@/lib/auth-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })
    if (error) {
      setError(error.message ?? 'Could not send email')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-sm" variant="glass" animated>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">
          Reset password
        </CardTitle>
        <CardDescription>
          {sent
            ? 'Check your email for instructions'
            : 'We\'ll send you a link to reset your password'}
        </CardDescription>
      </CardHeader>

      {!sent && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                icon={<Mail className="size-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              <SendHorizonal className="size-4" />
              {loading ? 'Sending…' : 'Send link'}
            </Button>
          </form>
        </CardContent>
      )}

      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
