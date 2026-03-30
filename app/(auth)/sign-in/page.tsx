'use client'

import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { signIn } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn.email({
      email,
      password,
      callbackURL: '/chat',
    })
    if (error) {
      // 403 = email not verified yet
      if (error.status === 403) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }
      setError(error.message ?? 'Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/chat')
    }
  }

  return (
    <Card className="w-full max-w-sm" variant="glass">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your email and password to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              aria-describedby={error ? 'signin-error' : undefined}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="size-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              id="signin-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {error}{' '}
              <Link
                href="/forgot-password"
                className="underline hover:no-underline"
              >
                Reset password
              </Link>
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="size-4" />
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?&nbsp;
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  )
}
