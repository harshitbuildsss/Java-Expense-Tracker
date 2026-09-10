const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formats a number as Indian Rupees, e.g. 1299 -> "₹1,299.00" */
export function formatCurrency(value: number): string {
  return inr.format(value)
}

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Whole-rupee currency, for tight spaces (legends, compact cards) where paise isn't worth the width. */
export function formatCurrencyCompact(value: number): string {
  return inrWhole.format(value)
}

/** Formats a signed amount for transaction rows, e.g. "+ ₹60,000.00" / "- ₹450.00" */
export function formatSignedCurrency(value: number, type: 'INCOME' | 'EXPENSE'): string {
  const sign = type === 'INCOME' ? '+ ' : '- '
  return sign + inr.format(Math.abs(value))
}

const dateDisplay = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** Formats an ISO date string (yyyy-MM-dd) as "31 May 2026". Never throws. */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  const parts = isoDate.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return '—'
  const [y, m, d] = parts
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return '—'
  return dateDisplay.format(date)
}

const monthDisplay = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })

/** Formats a yyyy-MM month key as "Sep '26". Never throws. */
export function formatMonth(yyyyMM: string | null | undefined): string {
  if (!yyyyMM) return '—'
  const parts = yyyyMM.split('-').map(Number)
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return '—'
  const [y, m] = parts
  const date = new Date(y, m - 1, 1)
  if (Number.isNaN(date.getTime())) return '—'
  return monthDisplay.format(date)
}

/** Today's date as yyyy-MM-dd, for default form values. */
export function todayIso(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function formatPercent(part: number, whole: number): string {
  if (whole <= 0) return '0%'
  return `${Math.round((part / whole) * 100)}%`
}
