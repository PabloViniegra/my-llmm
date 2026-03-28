import { Skeleton } from '@/components/ui/skeleton'

export default function ConversationLoading() {
  return (
    <div className="flex flex-col h-dvh">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end gap-4 px-4 py-6 max-w-2xl mx-auto w-full">
        <MessageSkeleton align="left" widths={['w-48', 'w-64', 'w-40']} />
        <MessageSkeleton align="right" widths={['w-56']} />
        <MessageSkeleton align="left" widths={['w-72', 'w-52', 'w-36']} />
        <MessageSkeleton align="right" widths={['w-44', 'w-28']} />
        <MessageSkeleton align="left" widths={['w-60', 'w-48']} />
      </div>

      {/* Input skeleton */}
      <div className="px-4 py-4 max-w-2xl mx-auto w-full">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  )
}

function MessageSkeleton({
  align,
  widths,
}: {
  align: 'left' | 'right'
  widths: string[]
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      {widths.map((w, i) => (
        <Skeleton key={i} className={`h-4 ${w} rounded-full opacity-60`} />
      ))}
    </div>
  )
}
