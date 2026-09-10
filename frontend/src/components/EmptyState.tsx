import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, AlertTriangle } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
  icon?: ReactNode
}

export function EmptyState({ title, description, actionLabel, actionTo, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4">
        {icon ?? <Inbox size={20} />}
      </div>
      <p className="text-sm font-medium text-white/80">{title}</p>
      <p className="text-sm text-white/40 mt-1 max-w-xs">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 px-4 py-2 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-expense/10 flex items-center justify-center text-expense mb-4">
        <AlertTriangle size={20} />
      </div>
      <p className="text-sm font-medium text-white/80">Couldn't load this data</p>
      <p className="text-sm text-white/40 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-4 py-2 rounded-xl border border-surface-border text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
