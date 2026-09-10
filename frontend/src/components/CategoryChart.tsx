import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { colorForCategory } from '../utils/constants'
import { formatCurrency, formatCurrencyCompact, formatPercent } from '../utils/format'
import { EmptyState } from './EmptyState'
import { PieChart as PieChartIcon } from 'lucide-react'

interface CategoryChartProps {
  categoryTotals: Record<string, number>
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-[#1A1A1A] border border-surface-border rounded-xl px-3.5 py-2.5 shadow-xl">
      <p className="text-sm font-medium" style={{ color: entry.payload.fill }}>
        {entry.name}
      </p>
      <p className="text-xs text-white/60 mt-0.5">{formatCurrency(entry.value)}</p>
    </div>
  )
}

export function CategoryChart({ categoryTotals }: CategoryChartProps) {
  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [, v]) => sum + v, 0)

  if (entries.length === 0 || total === 0) {
    return (
      <EmptyState
        title="No expenses yet"
        description="Once you add expenses, their category breakdown will show up here."
        icon={<PieChartIcon size={20} />}
      />
    )
  }

  const data = entries.map(([category, value]) => ({
    name: category,
    value,
    fill: colorForCategory(category),
  }))

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 min-w-0">
      <div className="relative w-[120px] h-[120px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={34}
              outerRadius={58}
              paddingAngle={2}
              stroke="#0A0A0A"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
          <p className="text-xs font-bold leading-tight text-center">{formatCurrencyCompact(total)}</p>
          <p className="text-[9px] text-white/40 leading-tight text-center">Total</p>
        </div>
      </div>

      <div className="w-full min-w-0 flex-1 space-y-1.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-white/70 break-words leading-tight">{entry.name}</span>
            </div>
            <div className="shrink-0 text-right leading-tight">
              <p className="text-white/90 font-medium text-xs whitespace-nowrap">
                {formatCurrencyCompact(entry.value)}
              </p>
              <p className="text-white/35 text-[11px]">{formatPercent(entry.value, total)}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-surface-border">
          <span className="text-white/50">Total</span>
          <span className="font-semibold whitespace-nowrap">{formatCurrencyCompact(total)}</span>
        </div>
      </div>
    </div>
  )
}
