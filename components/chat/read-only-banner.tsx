import { Lock } from 'lucide-react'

interface ReadOnlyBannerProps {
  ownerName: string
}

export function ReadOnlyBanner({ ownerName }: ReadOnlyBannerProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-muted/40 border-b border-border/40 text-[12px] text-muted-foreground">
      <Lock className="size-3 shrink-0" strokeWidth={1.8} />
      <span>
        Conversación de <strong className="font-medium text-foreground/70">{ownerName}</strong> — solo lectura
      </span>
    </div>
  )
}
