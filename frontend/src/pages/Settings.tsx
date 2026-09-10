import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Header } from '../components/Header'
import { expenseApi } from '../api/expenseApi'
import { APP_NAME, APP_TAGLINE } from '../utils/constants'

type ConnectionStatus = 'checking' | 'connected' | 'unreachable'

export function Settings() {
  const [status, setStatus] = useState<ConnectionStatus>('checking')

  useEffect(() => {
    let cancelled = false
    expenseApi
      .categorySummary()
      .then(() => !cancelled && setStatus('connected'))
      .catch(() => !cancelled && setStatus('unreachable'))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Header title="Settings" subtitle="App info and backend connection" />

      <div className="max-w-lg space-y-4">
        <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white/90 mb-4">About</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Application" value={`${APP_NAME} — ${APP_TAGLINE}`} />
            <Row label="Formal project" value="Smart Expense Tracker" />
            <Row label="Currency" value="Indian Rupees (₹)" />
            <Row label="Version" value="1.0.0" />
          </dl>
        </div>

        <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white/90 mb-4">Backend Connection</h2>
          <dl className="space-y-3 text-sm">
            <Row label="API base URL" value={import.meta.env.VITE_API_BASE_URL || 'Not set'} mono />
            <div className="flex items-center justify-between">
              <dt className="text-white/50">Status</dt>
              <dd>
                {status === 'checking' && (
                  <span className="inline-flex items-center gap-1.5 text-white/50">
                    <Loader2 size={14} className="animate-spin" />
                    Checking…
                  </span>
                )}
                {status === 'connected' && (
                  <span className="inline-flex items-center gap-1.5 text-income">
                    <CheckCircle2 size={14} />
                    Connected
                  </span>
                )}
                {status === 'unreachable' && (
                  <span className="inline-flex items-center gap-1.5 text-expense">
                    <XCircle size={14} />
                    Not reachable
                  </span>
                )}
              </dd>
            </div>
          </dl>
          {status === 'unreachable' && (
            <p className="text-xs text-white/40 mt-3">
              Make sure the Spring Boot backend is running and that VITE_API_BASE_URL in your .env
              file points to it.
            </p>
          )}
        </div>

        <p className="text-xs text-white/30 px-1">
          This is a college Semester 7 minor project. Settings here are informational only — there
          are no user accounts or preferences stored by the backend.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/50 shrink-0">{label}</dt>
      <dd className={`text-white/90 text-right truncate ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </dd>
    </div>
  )
}
