'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, SendHorizonal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/glass/card'
import { Input } from '@/components/ui/glass/input'
import { Label } from '@/components/ui/glass/label'
import { Button } from '@/components/ui/button'
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
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: '/reset-password',
    })
    if (error) {
      setError(error.message ?? 'No se pudo enviar el correo')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-sm" variant="glass" animated>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Recuperar contraseña</CardTitle>
        <CardDescription>
          {sent
            ? 'Revisa tu correo con las instrucciones'
            : 'Te enviaremos un enlace para restablecer tu contraseña'}
        </CardDescription>
      </CardHeader>

      {!sent && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="size-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <SendHorizonal className="size-4" />
              {loading ? 'Enviando…' : 'Enviar enlace'}
            </Button>
          </form>
        </CardContent>
      )}

      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      </CardFooter>
    </Card>
  )
}
