'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/glass/card'
import { Input } from '@/components/ui/glass/input'
import { Label } from '@/components/ui/glass/label'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const { error } = await authClient.resetPassword({ newPassword: password, token })
    if (error) {
      setError(error.message ?? 'No se pudo restablecer la contraseña')
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/sign-in'), 2000)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle className="size-10 text-primary" />
        <p className="text-sm text-muted-foreground">
          Contraseña actualizada. Redirigiendo…
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          icon={<Lock className="size-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirmar contraseña</Label>
        <Input
          id="confirm"
          type="password"
          placeholder="Repite la contraseña"
          icon={<Lock className="size-4" />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Guardando…' : 'Restablecer contraseña'}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-sm" variant="glass" animated>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Nueva contraseña</CardTitle>
        <CardDescription>Elige una contraseña segura</CardDescription>
      </CardHeader>

      <CardContent>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      </CardFooter>
    </Card>
  )
}
