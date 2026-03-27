'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/glass/card'
import { Input } from '@/components/ui/glass/input'
import { Label } from '@/components/ui/glass/label'
import { Button } from '@/components/ui/button'
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
    const { error } = await signIn.email({ email, password, callbackURL: '/chat' })
    if (error) {
      setError(error.message ?? 'Correo o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push('/chat')
    }
  }

  return (
    <Card className="w-full max-w-sm" variant="glass">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Bienvenido de nuevo</CardTitle>
        <CardDescription>Ingresa tu correo y contraseña para continuar</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              icon={<Mail className="size-4" />}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              aria-describedby={error ? 'signin-error' : undefined}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="size-4" />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p id="signin-error" role="alert" className="text-sm text-destructive">
              {error}{' '}
              <Link href="/forgot-password" className="underline hover:no-underline">
                Recuperar contraseña
              </Link>
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="size-4" />
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        ¿No tienes cuenta?&nbsp;
        <Link href="/sign-up" className="text-primary hover:underline">Regístrate</Link>
      </CardFooter>
    </Card>
  )
}
