import { useState, type FormEvent } from 'react'
import { Search as SearchIcon, SearchX } from 'lucide-react'
import { Header } from '../components/Header'
import { TransactionTable } from '../components/TransactionTable'
import { LoadingState } from '../components/LoadingState'
import { ErrorState, EmptyState } from '../components/EmptyState'
import { expenseApi } from '../api/expenseApi'
import { ApiError } from '../api/client'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import type { Transaction, TransactionType } from '../types/transaction'

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function Search() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<TransactionType | ''>('')

  const [results, setResults] = useState<Transaction[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function runSearch(e?: FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    setHasSearched(true)
    try {
      const data = await expenseApi.search({
        category: category || undefined,
        type: type || undefined,
        keyword: keyword.trim() || undefined,
      })
      setResults(data)
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError('Search failed.')
      setError(apiErr.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header title="Search" subtitle="Find a specific transaction by keyword, category, or type" />

      <form
        onSubmit={runSearch}
        className="bg-surface-raised border border-surface-border rounded-2xl p-4 mb-4 flex flex-wrap gap-2.5"
      >
        <div className="flex-1 min-w-[220px] relative">
          <SearchIcon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search description or category…"
            className="w-full bg-surface border border-surface-border rounded-xl pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType | '')}
          className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        >
          <option value="">All types</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        >
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
        >
          Search
        </button>
      </form>

      <div className="bg-surface-raised border border-surface-border rounded-2xl p-5">
        {loading && <LoadingState variant="table" rows={6} />}
        {error && <ErrorState message={error} onRetry={() => runSearch()} />}

        {!loading && !error && !hasSearched && (
          <EmptyState
            title="Search your transactions"
            description="Enter a keyword, or pick a type/category above, then hit Search."
            icon={<SearchIcon size={20} />}
          />
        )}

        {!loading && !error && hasSearched && results?.length === 0 && (
          <EmptyState
            title="No results found"
            description="Try a different keyword or clear the type/category filters."
            icon={<SearchX size={20} />}
          />
        )}

        {!loading && !error && results && results.length > 0 && (
          <>
            <p className="text-xs text-white/40 mb-3">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
            <TransactionTable transactions={results} />
          </>
        )}
      </div>
    </div>
  )
}
