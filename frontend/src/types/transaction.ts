// Mirrors com.harshit.expensetracker.model.TransactionType exactly.
export type TransactionType = 'INCOME' | 'EXPENSE'

// Mirrors com.harshit.expensetracker.model.Expense as returned by the API.
export interface Transaction {
  id: number
  category: string
  amount: number
  date: string // ISO yyyy-MM-dd, as serialized by Jackson for LocalDate
  description: string | null
  type: TransactionType
}

// Shape used when creating/updating a transaction. id is server-assigned.
export interface TransactionInput {
  category: string
  amount: number
  date: string
  description?: string
}

// Mirrors com.harshit.expensetracker.dto.MonthlySummaryDto.
export interface MonthlySummary {
  month: string // yyyy-MM
  totalIncome: number
  totalExpense: number
}

// Mirrors com.harshit.expensetracker.dto.DashboardSummaryDto.
export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  netSavings: number
  totalTransactions: number
  averageExpense: number
  categoryWiseExpense: Record<string, number>
  monthlyBreakdown: MonthlySummary[]
}

// Query params accepted by GET /api/expenses (all optional).
export interface TransactionQuery {
  type?: TransactionType
  category?: string
  keyword?: string
  startDate?: string
  endDate?: string
  sortBy?: 'amount' | 'date'
  order?: 'asc' | 'desc'
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Refund',
  'Other Income',
] as const
