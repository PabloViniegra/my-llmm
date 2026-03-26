export function MeshBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, var(--mesh-1) 0%, var(--mesh-2) 40%, var(--mesh-3) 75%, var(--mesh-4) 100%)',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: 700,
          maxHeight: 700,
          top: '-15%',
          right: '-10%',
          background: 'var(--blob-1)',
          filter: 'blur(60px)',
          animation: 'blob-1 28s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          maxWidth: 580,
          maxHeight: 580,
          top: '30%',
          left: '-12%',
          background: 'var(--blob-2)',
          filter: 'blur(50px)',
          animation: 'blob-2 24s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '38vw',
          height: '38vw',
          maxWidth: 500,
          maxHeight: 500,
          bottom: '5%',
          right: '15%',
          background: 'var(--blob-3)',
          filter: 'blur(45px)',
          animation: 'blob-3 32s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
