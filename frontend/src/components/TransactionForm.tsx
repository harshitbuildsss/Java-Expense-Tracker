import { useState, type FormEvent } from 'react'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import type { Transaction, TransactionType } from '../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import { expenseApi } from '../api/expenseApi'
import { ApiError } from '../api/client'
import { useToast } from './ToastProvider'
import { todayIso } from '../utils/format'

interface TransactionFormProps {
  mode: 'create' | 'edit'
  transaction?: Transaction // required for edit mode
  onSuccess: (transaction: Transaction) => void
  onCancel?: () => void
}

export function TransactionForm({ mode, transaction, onSuccess, onCancel }: TransactionFormProps) {
  const { showSuccess, showError } = useToast()

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'EXPENSE')
  const [category, setCategory] = useState(transaction?.category ?? '')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [date, setDate] = useState(transaction?.date ?? todayIso())
  const [description, setDescription] = useState(transaction?.description ?? '')

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const categoryOptions = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function switchType(next: TransactionType) {
    setType(next)
    // Category presets differ per type, so a category chosen under the old
    // type usually won't be valid for the new one - reset it.
    setCategory('')
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!category) errors.category = 'Category is required'
    const numericAmount = Number(amount)
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      errors.amount = 'Amount must be greater than zero'
    }
    if (!date) errors.date = 'Date is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    const payload = {
      category,
      amount: Number(amount),
      date,
      description: description.trim() || undefined,
    }

    try {
      let result: Transaction
      if (mode === 'edit' && transaction) {
        result = await expenseApi.update(transaction.id, { ...payload, type })
        showSuccess('Transaction updated.')
      } else if (type === 'INCOME') {
        result = await expenseApi.createIncome(payload)
        showSuccess('Income added.')
      } else {
        result = await expenseApi.createExpense(payload)
        showSuccess('Expense added.')
      }
      onSuccess(result)
      if (mode === 'create') {
        setCategory('')
        setAmount('')
        setDescription('')
        setDate(todayIso())
      }
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError('Something went wrong.')
      if (apiErr.fieldErrors) setFieldErrors(apiErr.fieldErrors)
      setFormError(apiErr.message)
      showError(apiErr.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => switchType('EXPENSE')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
            type === 'EXPENSE'
              ? 'bg-expense/10 border-expense text-expense'
              : 'border-surface-border text-white/50 hover:bg-white/5'
          }`}
        >
          <TrendingDown size={16} />
          Expense
        </button>
        <button
          type="button"
          onClick={() => switchType('INCOME')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
            type === 'INCOME'
              ? 'bg-income/10 border-income text-income'
              : 'border-surface-border text-white/50 hover:bg-white/5'
          }`}
        >
          <TrendingUp size={16} />
          Income
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="amount">
          Amount (₹)
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-surface border border-surface-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        {fieldErrors.amount && <p className="text-xs text-expense mt-1.5">{fieldErrors.amount}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          list="category-suggestions"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Food, or type your own"
          maxLength={100}
          className="w-full bg-surface border border-surface-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        <datalist id="category-suggestions">
          {categoryOptions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {fieldErrors.category && (
          <p className="text-xs text-expense mt-1.5">{fieldErrors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors [color-scheme:dark]"
        />
        {fieldErrors.date && <p className="text-xs text-expense mt-1.5">{fieldErrors.date}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="description">
          Description <span className="text-white/30">(optional)</span>
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Lunch at Cafe Coffee Day"
          maxLength={255}
          className="w-full bg-surface border border-surface-border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {formError && !Object.keys(fieldErrors).length && (
        <p className="text-sm text-expense -mt-2">{formError}</p>
      )}

      <div className="flex items-center gap-2.5 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-surface-border hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-black hover:bg-accent-dim transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting
            ? 'Saving…'
            : mode === 'edit'
              ? 'Save changes'
              : type === 'INCOME'
                ? 'Add income'
                : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
