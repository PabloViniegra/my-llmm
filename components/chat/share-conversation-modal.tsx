// components/chat/share-conversation-modal.tsx
'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { UserPlus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { shareConversation, revokeShare, getConversationShares } from '@/lib/actions/shares'

interface SearchUser {
  id: string
  name: string
  email: string
  image: string | null
}

interface ShareEntry {
  id: string
  sharedWith: SearchUser
}

interface ShareConversationModalProps {
  conversationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareConversationModal({
  conversationId,
  open,
  onOpenChange,
}: ShareConversationModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchUser[]>([])
  const [shares, setShares] = useState<ShareEntry[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Load current shares when modal opens
  useEffect(() => {
    if (!open) return
    getConversationShares(conversationId).then((data) => {
      setShares(
        data.map((s) => ({
          id: s.id,
          sharedWith: s.sharedWith as SearchUser,
        })),
      )
    })
  }, [open, conversationId])

  // Debounced user search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const excludeIds = shares.map((s) => s.sharedWith.id).join(',')
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}&exclude=${excludeIds}`,
      )
      const data = await res.json()
      setResults(data.users ?? [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, shares])

  const handleShare = useCallback(
    (user: SearchUser) => {
      setError(null)
      startTransition(async () => {
        const result = await shareConversation(conversationId, user.email)
        if (result.error) { setError(result.error); return }
        setShares((prev) => [
          ...prev,
          { id: crypto.randomUUID(), sharedWith: user },
        ])
        setResults((prev) => prev.filter((u) => u.id !== user.id))
        setQuery('')
      })
    },
    [conversationId],
  )

  const handleRevoke = useCallback(
    (userId: string) => {
      startTransition(async () => {
        await revokeShare(conversationId, userId)
        setShares((prev) => prev.filter((s) => s.sharedWith.id !== userId))
      })
    },
    [conversationId],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Compartir conversación
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Input
              placeholder="Buscar por nombre o email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-8"
            />
            {searching && (
              <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-[12px] text-destructive">{error}</p>
          )}

          {/* Search results */}
          <AnimatePresence>
            {results.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="border border-border rounded-lg overflow-hidden divide-y divide-border"
              >
                {results.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/40 transition-colors"
                  >
                    <UserAvatar user={user} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shrink-0 h-7 text-[12px]"
                      disabled={isPending}
                      onClick={() => handleShare(user)}
                    >
                      Compartir
                    </Button>
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          {/* Current shares */}
          {shares.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Con acceso
              </p>
              <div className="space-y-1">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg"
                  >
                    <UserAvatar user={share.sharedWith} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{share.sharedWith.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{share.sharedWith.email}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={isPending}
                      aria-label={`Revocar acceso de ${share.sharedWith.name}`}
                      onClick={() => handleRevoke(share.sharedWith.id)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shares.length === 0 && query.length < 2 && (
            <p className="text-center text-[12px] text-muted-foreground py-4">
              Busca un usuario para compartir esta conversación
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function UserAvatar({ user }: { user: SearchUser }) {
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name}
        width={28}
        height={28}
        className="size-7 rounded-full object-cover shrink-0"
      />
    )
  }
  return (
    <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
      <span className="text-[11px] font-semibold text-muted-foreground">
        {user.name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
