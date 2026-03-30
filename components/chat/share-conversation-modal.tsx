'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { UserPlus, X, Loader2, Users } from 'lucide-react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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

  useEffect(() => {
    if (!open) return
    getConversationShares(conversationId).then((data) => {
      setShares(data.map((s) => ({ id: s.id, sharedWith: s.sharedWith as SearchUser })))
    })
  }, [open, conversationId])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const excludeIds = shares.map((s) => s.sharedWith.id).join(',')
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&exclude=${excludeIds}`)
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
        setShares((prev) => [...prev, { id: crypto.randomUUID(), sharedWith: user }])
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
      <DialogContent
        showCloseButton={false}
        className="bg-popover/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-2xl ring-0 p-0 gap-0 overflow-hidden sm:max-w-sm rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-xl bg-muted/80 flex items-center justify-center shrink-0">
              <UserPlus className="size-3.5 text-foreground/60" strokeWidth={1.8} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-foreground/80 font-heading">
              Share
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="size-7 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/40"
          >
            <X className="size-3.5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-5" />

        <div className="px-5 py-4 space-y-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                'w-full bg-muted/50 rounded-xl px-4 py-2.5 text-[13px] text-foreground/85',
                'placeholder:text-muted-foreground/50 outline-none border border-border/50',
                'focus:ring-1 focus:ring-ring focus:border-ring/50 transition-shadow',
                searching && 'pr-10',
              )}
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-muted-foreground/60" />
            )}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <m.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[12px] text-destructive px-1"
              >
                {error}
              </m.p>
            )}
          </AnimatePresence>

          {/* Search results */}
          <AnimatePresence>
            {results.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="bg-muted/40 border border-border/60 rounded-xl overflow-hidden"
              >
                {results.map((user, i) => (
                  <div
                    key={user.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 transition-colors',
                      i > 0 && 'border-t border-border/40',
                    )}
                  >
                    <UserAvatar user={user} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate text-foreground/85">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground/60 truncate">{user.email}</p>
                    </div>
                    <button
                      disabled={isPending}
                      onClick={() => handleShare(user)}
                      className={cn(
                        'shrink-0 h-7 px-3 rounded-lg text-[12px] font-medium',
                        'bg-accent/60 hover:bg-accent border border-border/60',
                        'text-foreground/70 transition-colors active:scale-95 disabled:opacity-40',
                      )}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          {/* Current shares */}
          <AnimatePresence>
            {shares.length > 0 && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-1.5 px-1">
                  <Users className="size-3 text-muted-foreground/40" strokeWidth={1.8} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                    With access
                  </span>
                </div>
                <div className="glass-sm rounded-xl overflow-hidden">
                  {shares.map((share, i) => (
                    <div
                      key={share.id}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5',
                        i > 0 && 'border-t border-border/40',
                      )}
                    >
                      <UserAvatar user={share.sharedWith} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate text-foreground/85">{share.sharedWith.name}</p>
                        <p className="text-[11px] text-muted-foreground/60 truncate">{share.sharedWith.email}</p>
                      </div>
                      <button
                        disabled={isPending}
                        aria-label={`Revoke access for ${share.sharedWith.name}`}
                        onClick={() => handleRevoke(share.sharedWith.id)}
                        className="size-6 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {shares.length === 0 && query.length < 2 && (
            <p className="text-center text-[12px] text-muted-foreground/50 py-3">
              Search for a user to share this conversation
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
    <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
      <span className="text-[11px] font-semibold text-foreground/60">
        {user.name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
