'use client'

export default function ConversationError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-4 text-center px-4">
      <p className="text-muted-foreground text-sm">No se pudo cargar la conversación.</p>
      <button
        onClick={reset}
        className="text-sm font-medium underline underline-offset-2 hover:no-underline transition-all"
      >
        Reintentar
      </button>
    </div>
  )
}
