import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

export function ThinkingIndicator() {
  return (
    <div
      role="status"
      aria-label="AI is thinking"
      className="flex gap-3 items-start"
    >
      <Avatar className="size-8 shrink-0 mt-0.5">
        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 max-w-[200px]">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
