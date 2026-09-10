import { useCallback, useEffect, useState } from 'react'
import { expenseApi } from '../api/expenseApi'
import type { DashboardSummary } from '../types/transaction'
import { ApiError } from '../api/client'

interface UseDashboardResult {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refetch = useCallback(() => setReloadToken((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    expenseApi
      .dashboard()
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
  }, [reloadToken])

  return { data, loading, error, refetch }
}
