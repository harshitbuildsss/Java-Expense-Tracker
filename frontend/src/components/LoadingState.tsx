interface LoadingStateProps {
  variant?: 'cards' | 'table' | 'chart' | 'block'
  rows?: number
  height?: number
}

function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
}

export function LoadingState({ variant = 'block', rows = 5, height = 300 }: LoadingStateProps) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-raised border border-surface-border rounded-2xl p-5 h-[110px] flex flex-col justify-between"
          >
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-6 w-28" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <Shimmer key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div
        className="bg-surface-raised border border-surface-border rounded-2xl p-5 flex items-center justify-center"
        style={{ height: height + 40 }}
      >
        <Shimmer className="w-full h-full" />
      </div>
    )
  }

  return <Shimmer className="h-24 w-full" />
}
