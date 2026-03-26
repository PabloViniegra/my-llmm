import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'
  return (
    <div
      className={cn(
        'flex gap-3 items-start',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <Avatar className="size-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            'text-xs font-medium',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <Card
        className={cn(
          'max-w-[75%] rounded-2xl border-0 shadow-xs',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground ring-0'
            : 'rounded-tl-sm',
        )}
      >
        <CardContent className="px-4 py-2.5">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
