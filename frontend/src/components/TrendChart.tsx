import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlySummary } from '../types/transaction'
import { formatCurrency, formatMonth } from '../utils/format'
import { EmptyState } from './EmptyState'
import { TrendingUp } from 'lucide-react'

interface TrendChartProps {
  data: MonthlySummary[]
  height?: number
}

// Theme tokens kept local to this component so the chart can be dropped into
// any surface and still read correctly against a dark background.
const COLORS = {
  income: '#34D399', // emerald
  expense: '#FB7185', // rose / wine
  grid: '#1E212B',
  axisLine: '#262A36',
  axisText: '#7A7F8E',
  tooltipBg: '#161822',
  tooltipBorder: '#262A36',
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3.5 py-2.5 shadow-2xl border"
      style={{ backgroundColor: COLORS.tooltipBg, borderColor: COLORS.tooltipBorder }}
    >
      <p className="text-xs text-white/45 mb-1.5">{formatMonth(label)}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-sm font-medium tabular-nums" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function TrendChart({ data, height = 300 }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No trend data yet"
        description="Add a few transactions across different dates to see your income vs expense trend."
        icon={<TrendingUp size={20} />}
      />
    )
  }

  const chartData = data.map((m) => ({
    month: m.month,
    Income: m.totalIncome,
    Expense: m.totalExpense,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.32} />
            <stop offset="60%" stopColor={COLORS.income} stopOpacity={0.08} />
            <stop offset="100%" stopColor={COLORS.income} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.expense} stopOpacity={0.28} />
            <stop offset="60%" stopColor={COLORS.expense} stopOpacity={0.07} />
            <stop offset="100%" stopColor={COLORS.expense} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />

        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          stroke={COLORS.axisLine}
          tick={{ fill: COLORS.axisText, fontSize: 12 }}
          axisLine={{ stroke: COLORS.axisLine }}
          tickLine={false}
        />
        <YAxis
          stroke={COLORS.axisLine}
          tick={{ fill: COLORS.axisText, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
          width={48}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: COLORS.axisLine, strokeWidth: 1 }} />

        {/* type="natural": smooth cubic spline through every point, rather than
            straight segments (linear) or the flatter monotone curve. With only
            2 data points a "curve" is mathematically a straight line either
            way - there's nothing to bend through - but this will visibly
            smooth out as soon as there are 3+ months of history. */}
        <Area
          type="natural"
          dataKey="Income"
          name="Income"
          stroke={COLORS.income}
          strokeWidth={2.5}
          fill="url(#incomeFill)"
          dot={{ r: 3, fill: COLORS.income, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: COLORS.tooltipBg }}
          isAnimationActive
          animationDuration={500}
        />
        <Area
          type="natural"
          dataKey="Expense"
          name="Expense"
          stroke={COLORS.expense}
          strokeWidth={2.5}
          fill="url(#expenseFill)"
          dot={{ r: 3, fill: COLORS.expense, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: COLORS.tooltipBg }}
          isAnimationActive
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
