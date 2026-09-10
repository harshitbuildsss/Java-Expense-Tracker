import { Link } from 'react-router-dom'
import { Shapes } from 'lucide-react'
import { Header } from '../components/Header'
import { LoadingState } from '../components/LoadingState'
import { EmptyState, ErrorState } from '../components/EmptyState'
import { useDashboard } from '../hooks/useDashboard'
import { formatCurrency, formatPercent } from '../utils/format'
import { colorForCategory } from '../utils/constants'

export function Categories() {
  const { data, loading, error, refetch } = useDashboard()

  const entries = data ? Object.entries(data.categoryWiseExpense).sort((a, b) => b[1] - a[1]) : []
  const total = entries.reduce((sum, [, v]) => sum + v, 0)

  return (
    <div>
      <Header title="Categories" subtitle="Where your expenses go, category by category" />

      {loading && <LoadingState variant="cards" />}
      {error && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl">
          <EmptyState
            title="No expense categories yet"
            description="Add an expense to see its category show up here."
            actionLabel="Add Transaction"
            actionTo="/add"
            icon={<Shapes size={20} />}
          />
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map(([category, amount]) => (
            <Link
              key={category}
              to={`/transactions?type=EXPENSE&category=${encodeURIComponent(category)}`}
              className="bg-surface-raised border border-surface-border rounded-2xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${colorForCategory(category)}22` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colorForCategory(category) }}
                  />
                </span>
                <span className="text-xs font-medium text-white/40">
                  {formatPercent(amount, total)} of expenses
                </span>
              </div>
              <p className="text-sm text-white/60">{category}</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(amount)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
