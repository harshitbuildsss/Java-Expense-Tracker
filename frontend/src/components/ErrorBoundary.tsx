import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render errors anywhere below it so a single bad row of data (or any
 * other unexpected bug) shows a recoverable screen instead of a blank page.
 * This is a last-resort safety net - individual pages should still handle
 * their own loading/error/empty states.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error in the UI:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-surface">
          <div className="max-w-sm text-center">
            <div className="w-12 h-12 rounded-full bg-expense/10 flex items-center justify-center text-expense mx-auto mb-4">
              <AlertTriangle size={20} />
            </div>
            <p className="text-base font-semibold text-white/90">Something went wrong</p>
            <p className="text-sm text-white/40 mt-1.5">
              An unexpected error occurred while rendering this page. Reloading usually fixes it.
            </p>
            <p className="text-xs text-white/25 mt-3 font-mono break-all">
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-4 py-2 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
