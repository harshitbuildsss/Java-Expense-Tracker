import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Search,
  FileBarChart2,
  ArrowUpDown,
  Inbox,
} from 'lucide-react'
import { Header } from '../components/Header'
import { StatCard, MetricItem } from '../components/StatCard'
import { TrendChart } from '../components/TrendChart'
import { CategoryChart } from '../components/CategoryChart'
import { TransactionTable } from '../components/TransactionTable'
import { LoadingState } from '../components/LoadingState'
import { EmptyState, ErrorState } from '../components/EmptyState'
import { useDashboard } from '../hooks/useDashboard'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, formatPercent } from '../utils/format'

export function Dashboard() {
  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } =
    useDashboard()
  const {
    data: recent,
    loading: recentLoading,
    error: recentError,
  } = useTransactions({ sortBy: 'date', order: 'desc' })

  // Month-over-month deltas are only shown when we genuinely have 2+ months
  // of real data - never invented or estimated.
  const months = summary?.monthlyBreakdown ?? []
  const lastMonth = months.length >= 2 ? months[months.length - 2] : null
  const currentMonth = months.length >= 1 ? months[months.length - 1] : null

  function delta(current?: number, previous?: number | null) {
    if (current === undefined || !previous) return null
    if (previous === 0) return null
    const change = ((current - previous) / previous) * 100
    return change
  }

  const incomeDelta = delta(currentMonth?.totalIncome, lastMonth?.totalIncome)
  const expenseDelta = delta(currentMonth?.totalExpense, lastMonth?.totalExpense)

  const topCategory = summary
    ? Object.entries(summary.categoryWiseExpense).sort((a, b) => b[1] - a[1])[0]
    : undefined

  return (
    <div>
      <Header
        title="Harshit"
        subtitle="Track your expenses, build better habits, and take control of your money."
        greeting
      />

      {summaryError && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl mb-6">
          <ErrorState message={summaryError} onRetry={refetchSummary} />
        </div>
      )}

      {summaryLoading && <LoadingState variant="cards" />}

      {summary && !summaryLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard
              label="Current Balance"
              value={formatCurrency(summary.balance)}
              icon={<Wallet size={14} className="text-accent" />}
              iconBg="rgba(182,241,59,0.18)"
              valueClassName={summary.balance < 0 ? 'text-expense' : undefined}
              tint={{ bg: 'rgba(182,241,59,0.06)', border: 'rgba(182,241,59,0.18)' }}
            />
            <StatCard
              label="Total Income"
              value={formatCurrency(summary.totalIncome)}
              icon={<TrendingUp size={14} className="text-income" />}
              iconBg="rgba(74,222,128,0.18)"
              helper={
                incomeDelta !== null && <DeltaBadge value={incomeDelta} positiveIsGood />
              }
              tint={{ bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.18)' }}
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(summary.totalExpense)}
              icon={<TrendingDown size={14} className="text-expense" />}
              iconBg="rgba(244,83,74,0.18)"
              helper={
                expenseDelta !== null && (
                  <DeltaBadge value={expenseDelta} positiveIsGood={false} />
                )
              }
              tint={{ bg: 'rgba(244,83,74,0.06)', border: 'rgba(244,83,74,0.18)' }}
            />
            <StatCard
              label="Total Transactions"
              value={String(summary.totalTransactions)}
              icon={<Receipt size={14} className="text-[#A78BFA]" />}
              iconBg="rgba(167,139,250,0.18)"
              tint={{ bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.18)' }}
            />
          </div>

          <div className="flex items-stretch bg-surface-raised border border-surface-border rounded-2xl divide-x divide-surface-border mt-2.5">
            <MetricItem label="Net Savings" value={formatCurrency(summary.netSavings)} />
            <MetricItem label="Average Expense" value={formatCurrency(summary.averageExpense)} />
            <MetricItem
              label="Top Expense Category"
              value={topCategory ? topCategory[0] : '—'}
              helper={
                topCategory ? `${formatPercent(topCategory[1], summary.totalExpense)} of expenses` : undefined
              }
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5 mt-2.5">
        <div className="xl:col-span-2 bg-surface-raised border border-surface-border rounded-2xl p-3.5">
          <h2 className="text-sm font-semibold text-white/90 mb-0.5">Income vs Expense Trend</h2>
          <p className="text-xs text-white/40 mb-1.5">Monthly totals from your transaction history</p>
          {summaryLoading ? (
            <LoadingState variant="chart" height={190} />
          ) : (
            summary && <TrendChart data={summary.monthlyBreakdown} height={190} />
          )}
        </div>

        <div className="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
          <h2 className="text-sm font-semibold text-white/90 mb-2.5">Expenses by Category</h2>
          {summaryLoading ? (
            <LoadingState variant="chart" height={190} />
          ) : (
            summary && <CategoryChart categoryTotals={summary.categoryWiseExpense} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5 mt-2.5">
        <div className="xl:col-span-2 bg-surface-raised border border-surface-border rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white/90">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs font-medium text-accent hover:underline">
              View All
            </Link>
          </div>
          {recentLoading && <LoadingState variant="table" rows={5} />}
          {recentError && <ErrorState message={recentError} />}
          {!recentLoading && !recentError && recent.length === 0 && (
            <EmptyState
              title="No transactions yet"
              description="Add your first income or expense to see it here."
              actionLabel="Add Transaction"
              actionTo="/add"
              icon={<Inbox size={20} />}
            />
          )}
          {!recentLoading && recent.length > 0 && (
            <TransactionTable transactions={recent.slice(0, 5)} compact />
          )}
        </div>

        <div className="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
          <h2 className="text-sm font-semibold text-white/90 mb-2.5">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/add"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-accent text-black hover:bg-accent-dim transition-colors group"
            >
              <span className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center shrink-0">
                <Plus size={16} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">Add Transaction</span>
                <span className="block text-xs text-black/60">Record income or expense</span>
              </span>
              <ArrowRight size={15} className="shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <QuickActionRow to="/reports" icon={<FileBarChart2 size={15} />} title="View Summary" subtitle="See detailed insights" />
            <QuickActionRow to="/categories" icon={<Wallet size={15} />} title="Manage Categories" subtitle="Organize your spending" />
            <QuickActionRow to="/search" icon={<Search size={15} />} title="Search Transactions" subtitle="Find specific records" />
            <QuickActionRow
              to="/transactions?sortBy=amount&order=desc"
              icon={<ArrowUpDown size={15} />}
              title="Sort By Amount"
              subtitle="Highest to lowest"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionRow({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string
  icon: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-surface-border hover:bg-white/5 transition-colors group"
    >
      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-white/90">{title}</span>
        <span className="block text-xs text-white/40">{subtitle}</span>
      </span>
      <ArrowRight
        size={14}
        className="shrink-0 text-white/25 group-hover:translate-x-0.5 group-hover:text-white/50 transition-all"
      />
    </Link>
  )
}

function DeltaBadge({ value, positiveIsGood }: { value: number; positiveIsGood: boolean }) {
  const isUp = value >= 0
  const isGood = isUp === positiveIsGood
  const magnitude = Math.abs(value)
  // Extreme swings (common with sparse demo data - e.g. last month had ₹1 of
  // expenses) are still real, just not worth a jagged decimal. Cap the display,
  // never the underlying comparison.
  const display = magnitude > 999 ? '999+' : magnitude >= 100 ? Math.round(magnitude).toString() : magnitude.toFixed(1)
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium whitespace-nowrap ${
        isGood ? 'text-income' : 'text-expense'
      }`}
    >
      {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {display}% vs last month
    </span>
  )
}
