import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ListFilter, X, Inbox } from 'lucide-react'
import { Header } from '../components/Header'
import { TransactionTable } from '../components/TransactionTable'
import { LoadingState } from '../components/LoadingState'
import { EmptyState, ErrorState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { TransactionForm } from '../components/TransactionForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useTransactions } from '../hooks/useTransactions'
import { useToast } from '../components/ToastProvider'
import { expenseApi } from '../api/expenseApi'
import { ApiError } from '../api/client'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import type { Transaction, TransactionType } from '../types/transaction'

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const type = (searchParams.get('type') as TransactionType | null) ?? undefined
  const category = searchParams.get('category') ?? undefined
  const keyword = searchParams.get('keyword') ?? undefined
  const startDate = searchParams.get('startDate') ?? undefined
  const endDate = searchParams.get('endDate') ?? undefined
  
  // Default to date-desc if not explicitly in URL
  const sortBy = (searchParams.get('sortBy') as 'amount' | 'date' | null) ?? 'date'
  const order = (searchParams.get('order') as 'asc' | 'desc' | null) ?? 'desc'

  const { data, loading, error, refetch } = useTransactions({
    type,
    category,
    keyword,
    startDate,
    endDate,
    sortBy,
    order,
  })

  // Guarantee chronological ordering (newest first) across mixed income/expense arrays
  const sortedTransactions = useMemo(() => {
    if (!data) return []
    return [...data].sort((a, b) => {
      if (sortBy === 'amount') {
        return order === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      
      // Sort by date (handles Date objects, ISO strings, or timestamp strings)
      const dateA = new Date(a.date || (a as any).expenseDate || 0).getTime()
      const dateB = new Date(b.date || (b as any).expenseDate || 0).getTime()
      return order === 'asc' ? dateA - dateB : dateB - dateA
    })
  }, [data, sortBy, order])

  const [keywordInput, setKeywordInput] = useState(keyword ?? '')
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function updateParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function handleKeywordSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParam('keyword', keywordInput.trim() || undefined)
  }

  function clearFilters() {
    setKeywordInput('')
    setSearchParams({})
  }

  const hasFilters = Boolean(type || category || keyword || startDate || endDate || searchParams.get('sortBy'))

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await expenseApi.remove(deleting.id)
      showSuccess('Transaction deleted.')
      setDeleting(null)
      refetch()
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError('Could not delete transaction.')
      showError(apiErr.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <Header title="Transactions" subtitle="All your income and expenses in one place" />

      <div className="bg-surface-raised border border-surface-border rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleKeywordSubmit} className="flex-1 min-w-[200px]">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search by description or category…"
              className="w-full bg-surface border border-surface-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
            />
          </form>

          <select
            value={type ?? ''}
            onChange={(e) => updateParam('type', e.target.value || undefined)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          >
            <option value="">All types</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>

          <select
            value={category ?? ''}
            onChange={(e) => updateParam('category', e.target.value || undefined)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          >
            <option value="">All categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate ?? ''}
            onChange={(e) => updateParam('startDate', e.target.value || undefined)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors [color-scheme:dark]"
            aria-label="Start date"
          />
          <input
            type="date"
            value={endDate ?? ''}
            onChange={(e) => updateParam('endDate', e.target.value || undefined)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors [color-scheme:dark]"
            aria-label="End date"
          />

          <select
            value={searchParams.get('sortBy') ? `${sortBy}-${order}` : 'date-desc'}
            onChange={(e) => {
              const val = e.target.value
              if (!val || val === 'date-desc') {
                updateParam('sortBy', undefined)
                updateParam('order', undefined)
                return
              }
              const [by, ord] = val.split('-')
              const next = new URLSearchParams(searchParams)
              next.set('sortBy', by)
              next.set('order', ord)
              setSearchParams(next)
            }}
            className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          >
            <option value="date-desc">Newest first (Default)</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: High to low</option>
            <option value="amount-asc">Amount: Low to high</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
        {loading && <LoadingState variant="table" rows={8} />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && sortedTransactions.length === 0 && (
          <EmptyState
            title={hasFilters ? 'No matching transactions' : 'No transactions yet'}
            description={
              hasFilters
                ? 'Try adjusting or clearing your filters.'
                : 'Add your first income or expense to get started.'
            }
            actionLabel={hasFilters ? undefined : 'Add Transaction'}
            actionTo={hasFilters ? undefined : '/add'}
            icon={hasFilters ? <ListFilter size={20} /> : <Inbox size={20} />}
          />
        )}
        {!loading && !error && sortedTransactions.length > 0 && (
          <>
            <p className="text-xs text-white/40 mb-3">
              {sortedTransactions.length} transaction{sortedTransactions.length === 1 ? '' : 's'}
            </p>
            <TransactionTable
              transactions={sortedTransactions}
              onEdit={(txn) => setEditing(txn)}
              onDelete={(txn) => setDeleting(txn)}
            />
          </>
        )}
      </div>

      <Modal open={!!editing} title="Edit transaction" onClose={() => setEditing(null)}>
        {editing && (
          <TransactionForm
            mode="edit"
            transaction={editing}
            onCancel={() => setEditing(null)}
            onSuccess={() => {
              setEditing(null)
              refetch()
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this transaction?"
        description={
          deleting
            ? `This will permanently remove "${deleting.description || deleting.category}" (₹${deleting.amount}). This can't be undone.`
            : ''
        }
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}