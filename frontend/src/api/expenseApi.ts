import { apiClient, toApiError } from './client'
import type {
  DashboardSummary,
  Transaction,
  TransactionInput,
  TransactionQuery,
} from '../types/transaction'

/**
 * Every network call the frontend makes lives here, matching
 * com.harshit.expensetracker.controller.ExpenseController exactly.
 */
export const expenseApi = {
  // GET /api/expenses?type&category&keyword&startDate&endDate&sortBy&order
  async list(query: TransactionQuery = {}): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<Transaction[]>('/api/expenses', { params: query })
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // GET /api/expenses/{id}
  async getById(id: number): Promise<Transaction> {
    try {
      const res = await apiClient.get<Transaction>(`/api/expenses/${id}`)
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // POST /api/expenses (type is always forced to EXPENSE by the backend)
  async createExpense(input: TransactionInput): Promise<Transaction> {
    try {
      const res = await apiClient.post<Transaction>('/api/expenses', input)
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // POST /api/expenses/income (type is always forced to INCOME by the backend)
  async createIncome(input: TransactionInput): Promise<Transaction> {
    try {
      const res = await apiClient.post<Transaction>('/api/expenses/income', input)
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // PUT /api/expenses/{id}
  async update(
    id: number,
    input: TransactionInput & { type: Transaction['type'] }
  ): Promise<Transaction> {
    try {
      const res = await apiClient.put<Transaction>(`/api/expenses/${id}`, input)
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // DELETE /api/expenses/{id}
  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/expenses/${id}`)
    } catch (err) {
      throw toApiError(err)
    }
  },

  // GET /api/expenses/search?category&type&keyword
  async search(params: { category?: string; type?: string; keyword?: string }): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<Transaction[]>('/api/expenses/search', { params })
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // GET /api/expenses/sorted?by=amount|date&order=asc|desc
  async sorted(by: 'amount' | 'date', order: 'asc' | 'desc'): Promise<Transaction[]> {
    try {
      const res = await apiClient.get<Transaction[]>('/api/expenses/sorted', { params: { by, order } })
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // GET /api/expenses/summary -> category-wise EXPENSE totals
  async categorySummary(): Promise<Record<string, number>> {
    try {
      const res = await apiClient.get<Record<string, number>>('/api/expenses/summary')
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },

  // GET /api/expenses/dashboard
  async dashboard(): Promise<DashboardSummary> {
    try {
      const res = await apiClient.get<DashboardSummary>('/api/expenses/dashboard')
      return res.data
    } catch (err) {
      throw toApiError(err)
    }
  },
}
