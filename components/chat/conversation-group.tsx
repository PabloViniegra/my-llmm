interface ConversationGroupProps {
  label: string
  children: React.ReactNode
}

export function ConversationGroup({ label, children }: ConversationGroupProps) {
  return (
    <div className="mb-1">
      <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground/50 select-none">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}
