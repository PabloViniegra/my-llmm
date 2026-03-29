'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SharedConversationItemProps {
  id: string
  title: string
  updatedAt: Date
  ownerName: string
  ownerImage: string | null
}

export function SharedConversationItem({
  id,
  title,
  updatedAt,
  ownerName,
  ownerImage,
}: SharedConversationItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = pathname === `/chat/${id}`

  return (
    <m.div
      layout
      className={cn(
        'group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors',
        isActive
          ? 'bg-accent/60 backdrop-blur-sm border border-white/10'
          : 'hover:bg-accent/30',
      )}
      onClick={() => router.push(`/chat/${id}`)}
    >
      {/* Owner avatar */}
      {ownerImage ? (
        <Image
          src={ownerImage}
          alt={ownerName}
          width={16}
          height={16}
          className="size-4 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="size-4 rounded-full bg-accent flex items-center justify-center shrink-0">
          <span className="text-[8px] font-bold text-muted-foreground">
            {ownerName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate text-foreground/85 leading-tight">
          {title}
        </p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">
          {ownerName}
        </p>
      </div>
    </m.div>
  )
}
