import { Pencil, Trash2 } from 'lucide-react'
import type { Transaction } from '../types/transaction'
import { formatDate, formatSignedCurrency } from '../utils/format'
import { colorForCategory } from '../utils/constants'

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  compact?: boolean
}

export function TransactionTable({ transactions, onEdit, onDelete, compact = false }: TransactionTableProps) {
  const showActions = Boolean(onEdit || onDelete)
  const cellPad = compact ? 'py-2.5' : 'py-3.5'

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/40 text-xs uppercase tracking-wide">
            <th className="font-medium px-4 py-2.5">Date</th>
            <th className="font-medium px-4 py-2.5">Description</th>
            <th className="font-medium px-4 py-2.5">Category</th>
            <th className="font-medium px-4 py-2.5">Type</th>
            <th className="font-medium px-4 py-2.5 text-right">Amount</th>
            {showActions && <th className="font-medium px-4 py-2.5 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              className="border-t border-surface-border/70 hover:bg-white/[0.02] transition-colors"
            >
              <td className={`px-4 ${cellPad} text-white/60 whitespace-nowrap`}>{formatDate(txn.date)}</td>
              <td className={`px-4 ${cellPad} font-medium text-white/90 max-w-[220px] truncate`}>
                {txn.description?.trim() ? txn.description : <span className="text-white/30">—</span>}
              </td>
              <td className={`px-4 ${cellPad}`}>
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: `${colorForCategory(txn.category)}22`,
                    color: colorForCategory(txn.category),
                  }}
                >
                  {txn.category}
                </span>
              </td>
              <td className={`px-4 ${cellPad}`}>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    txn.type === 'INCOME'
                      ? 'bg-income/10 text-income'
                      : 'bg-expense/10 text-expense'
                  }`}
                >
                  {txn.type}
                </span>
              </td>
              <td
                className={`px-4 ${cellPad} text-right font-semibold whitespace-nowrap ${
                  txn.type === 'INCOME' ? 'text-income' : 'text-expense'
                }`}
              >
                {formatSignedCurrency(txn.amount, txn.type)}
              </td>
              {showActions && (
                <td className={`px-4 ${cellPad}`}>
                  <div className="flex items-center justify-end gap-1.5">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(txn)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label={`Edit ${txn.description || txn.category}`}
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(txn)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-expense hover:bg-expense/10 transition-colors"
                        aria-label={`Delete ${txn.description || txn.category}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
