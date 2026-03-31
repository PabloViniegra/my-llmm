export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex">
      {/* Brand panel — hidden on mobile */}
      <aside
        className="hidden lg:flex w-[420px] xl:w-[460px] flex-none flex-col justify-between p-12 overflow-hidden relative select-none"
        style={{ background: 'oklch(0.38 0.20 264)' }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Logo */}
        <div className="relative font-heading text-8xl font-black leading-none tracking-tighter text-white">
          LLM<br />Chat
        </div>

        {/* Tagline */}
        <div className="relative space-y-2">
          <p className="text-white/85 text-xl font-semibold leading-snug">
            Chat with the best<br />AI models, for free.
          </p>
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Fast · Private · Open source
          </p>
        </div>

        {/* Decorative monospace hint */}
        <div className="relative font-mono text-[11px] text-white/20 leading-6">
          <div>&gt; What can I help you with today?</div>
          <div className="mt-1">█ Type your first question…</div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center p-6 bg-background min-h-dvh">
        {children}
      </main>
    </div>
  )
}
