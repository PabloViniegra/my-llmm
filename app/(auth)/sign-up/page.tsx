'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/glass/card'
import { Input } from '@/components/ui/glass/input'
import { Label } from '@/components/ui/glass/label'
import { Button } from '@/components/ui/button'
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
      setError('Las contraseñas no coinciden. Revísalas e inténtalo de nuevo.')
      return
    }
    setLoading(true)
    const { error } = await signUp.email({ name, email, password, callbackURL: '/chat' })
    if (error) {
      setError(error.message ?? 'No se pudo crear la cuenta. Inténtalo de nuevo.')
      setLoading(false)
    } else {
      router.push('/chat')
    }
  }

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )

  return (
    <Card className="w-full max-w-sm" variant="glass">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Crear cuenta</CardTitle>
        <CardDescription>Únete y empieza a chatear gratis</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" type="text" placeholder="Tu nombre" icon={<User className="size-4" />}
              value={name} onChange={e => setName(e.target.value)} required autoComplete="name"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com" icon={<Mail className="size-4" />}
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                icon={<Lock className="size-4" />} value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} autoComplete="new-password" className="pr-10"
                aria-describedby="password-hint" />
              {eyeBtn(showPw, () => setShowPw(v => !v))}
            </div>
            <p id="password-hint" className="text-xs text-muted-foreground">Usa al menos 8 caracteres</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <div className="relative">
              <Input id="confirm" type={showCf ? 'text' : 'password'} placeholder="Repite tu contraseña"
                icon={<Lock className="size-4" />} value={confirm} onChange={e => setConfirm(e.target.value)}
                required autoComplete="new-password" className="pr-10" />
              {eyeBtn(showCf, () => setShowCf(v => !v))}
            </div>
          </div>

          {error && (
            <p id="signup-error" role="alert" className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus className="size-4" />
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?&nbsp;
        <Link href="/sign-in" className="text-primary hover:underline">Inicia sesión</Link>
      </CardFooter>
    </Card>
  )
}
