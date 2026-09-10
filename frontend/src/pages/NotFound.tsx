import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-5xl font-bold text-accent">404</p>
      <p className="text-white/60 mt-3">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
