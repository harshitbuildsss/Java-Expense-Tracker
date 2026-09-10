import { useCallback, useEffect, useState } from 'react'
import { expenseApi } from '../api/expenseApi'
import type { Transaction, TransactionQuery } from '../types/transaction'
import { ApiError } from '../api/client'

interface UseTransactionsResult {
  data: Transaction[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTransactions(query: TransactionQuery): UseTransactionsResult {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refetch = useCallback(() => setReloadToken((t) => t + 1), [])

  // Stable key so the effect only re-runs when a filter value actually changes.
  const queryKey = JSON.stringify(query)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    expenseApi
      .list(query)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, reloadToken])

  return { data, loading, error, refetch }
}
