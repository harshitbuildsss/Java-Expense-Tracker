import { Header } from '../components/Header'
import { StatCard, CompactStat } from '../components/StatCard'
import { TrendChart } from '../components/TrendChart'
import { CategoryChart } from '../components/CategoryChart'
import { LoadingState } from '../components/LoadingState'
import { ErrorState, EmptyState } from '../components/EmptyState'
import { useDashboard } from '../hooks/useDashboard'
import { formatCurrency, formatMonth } from '../utils/format'
import { Wallet, TrendingUp, TrendingDown, Receipt, BarChart3 } from 'lucide-react'

export function Reports() {
  const { data, loading, error, refetch } = useDashboard()

  return (
    <div>
      <Header title="Summary" subtitle="A detailed look at your income, expenses, and trends" />

      {loading && (
        <div className="space-y-4">
          <LoadingState variant="cards" />
          <LoadingState variant="chart" />
        </div>
      )}

      {error && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}

      {!loading && !error && data && data.totalTransactions === 0 && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl">
          <EmptyState
            title="Nothing to summarize yet"
            description="Once you've added a few transactions, your summary will appear here."
            actionLabel="Add Transaction"
            actionTo="/add"
            icon={<BarChart3 size={20} />}
          />
        </div>
      )}

      {!loading && !error && data && data.totalTransactions > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Current Balance"
              value={formatCurrency(data.balance)}
              icon={<Wallet size={15} className="text-accent" />}
              iconBg="rgba(182,241,59,0.15)"
            />
            <StatCard
              label="Total Income"
              value={formatCurrency(data.totalIncome)}
              icon={<TrendingUp size={15} className="text-income" />}
              iconBg="rgba(74,222,128,0.15)"
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(data.totalExpense)}
              icon={<TrendingDown size={15} className="text-expense" />}
              iconBg="rgba(244,83,74,0.15)"
            />
            <StatCard
              label="Total Transactions"
              value={String(data.totalTransactions)}
              icon={<Receipt size={15} className="text-white/70" />}
              iconBg="rgba(255,255,255,0.08)"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <CompactStat label="Net Savings" value={formatCurrency(data.netSavings)} />
            <CompactStat label="Average Expense" value={formatCurrency(data.averageExpense)} />
            <CompactStat
              label="Savings Rate"
              value={
                data.totalIncome > 0
                  ? `${Math.round((data.netSavings / data.totalIncome) * 100)}%`
                  : '—'
              }
              helper="Net savings ÷ total income"
            />
          </div>

          <div className="bg-surface-raised border border-surface-border rounded-2xl p-5 mt-4">
            <h2 className="text-sm font-semibold text-white/90 mb-1">Income vs Expense Trend</h2>
            <p className="text-xs text-white/40 mb-2">Full monthly history from your transactions</p>
            <TrendChart data={data.monthlyBreakdown} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
            <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white/90 mb-4">Expenses by Category</h2>
              <CategoryChart categoryTotals={data.categoryWiseExpense} />
            </div>

            <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white/90 mb-4">Monthly Breakdown</h2>
              {data.monthlyBreakdown.length === 0 ? (
                <p className="text-sm text-white/40">No monthly data yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {[...data.monthlyBreakdown].reverse().map((m) => (
                    <div
                      key={m.month}
                      className="flex items-center justify-between text-sm border-b border-surface-border/70 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="text-white/70">{formatMonth(m.month)}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-income">{formatCurrency(m.totalIncome)}</span>
                        <span className="text-expense">{formatCurrency(m.totalExpense)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
