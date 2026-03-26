import { MeshBackground } from '@/components/chat/mesh-background'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <MeshBackground />
      <div className="relative z-0 flex flex-1 flex-col">{children}</div>
    </div>
  )
}
