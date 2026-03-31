import { useCallback, useEffect, useState, useTransition } from 'react'
import {
  getConversationShares,
  revokeShare,
  shareConversation,
} from '@/lib/actions/shares'

export interface ShareUser {
  id: string
  name: string
  email: string
  image: string | null
}

export interface ShareEntry {
  id: string
  sharedWith: ShareUser
}

interface UseShareConversationReturn {
  query: string
  setQuery: (q: string) => void
  results: ShareUser[]
  shares: ShareEntry[]
  searching: boolean
  error: string | null
  isPending: boolean
  handleShare: (user: ShareUser) => void
  handleRevoke: (userId: string) => void
}

export function useShareConversation(
  conversationId: string,
  open: boolean,
): UseShareConversationReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ShareUser[]>([])
  const [shares, setShares] = useState<ShareEntry[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Load existing shares whenever the modal opens
  useEffect(() => {
    if (!open) return
    getConversationShares(conversationId).then((data) => {
      setShares(
        data.map((s) => ({ id: s.id, sharedWith: s.sharedWith as ShareUser })),
      )
    })
  }, [open, conversationId])

  // Debounced user search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
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
    (user: ShareUser) => {
      setError(null)
      startTransition(async () => {
        const result = await shareConversation(conversationId, user.email)
        if (result.error) {
          setError(result.error)
          return
        }
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

  return {
    query,
    setQuery,
    results,
    shares,
    searching,
    error,
    isPending,
    handleShare,
    handleRevoke,
  }
}
