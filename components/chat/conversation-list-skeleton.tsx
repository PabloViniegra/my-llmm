import { Skeleton } from '@/components/ui/skeleton'

const ITEMS = [3, 2, 1, 2] // items per group

export function ConversationListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-1 py-1">
      {ITEMS.map((count, groupIdx) => (
        <div key={groupIdx} className="flex flex-col gap-1">
          {/* group label */}
          <Skeleton className="h-3 w-10 mx-2 mb-1 bg-muted/40" />
          {/* items */}
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1 px-2 py-2 rounded-lg">
              <Skeleton className="h-3.5 w-full bg-muted/50" />
              <Skeleton className="h-2.5 w-16 bg-muted/30" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
