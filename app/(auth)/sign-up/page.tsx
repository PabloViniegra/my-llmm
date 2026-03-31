'use client'

import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react'
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
import { signUp } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match. Please check and try again.')
      return
    }
    setLoading(true)
    const { error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: '/chat',
    })
    if (error) {
      setError(
        error.message ?? 'Could not create account. Please try again.',
      )
      setLoading(false)
    } else {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }
  }

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )

  return (
    <Card className="w-full max-w-sm" variant="glass">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Create account</CardTitle>
        <CardDescription>Join and start chatting for free</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              icon={<User className="size-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="At least 8 characters"
                icon={<Lock className="size-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="pr-10"
                aria-describedby="password-hint"
              />
              {eyeBtn(showPw, () => setShowPw((v) => !v))}
            </div>
            <p id="password-hint" className="text-xs text-muted-foreground">
              Use at least 8 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showCf ? 'text' : 'password'}
                placeholder="Repeat your password"
                icon={<Lock className="size-4" />}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              {eyeBtn(showCf, () => setShowCf((v) => !v))}
            </div>
          </div>

          {error && (
            <p
              id="signup-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus className="size-4" />
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
