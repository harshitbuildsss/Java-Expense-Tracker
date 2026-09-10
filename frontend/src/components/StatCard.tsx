import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  icon: ReactNode
  iconBg: string
  helper?: ReactNode
  valueClassName?: string
  /** Optional tinted card background + border, e.g. 'rgba(74,222,128,0.08)'. Falls back to the neutral surface look. */
  tint?: { bg: string; border: string }
}

export function StatCard({ label, value, icon, iconBg, helper, valueClassName, tint }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-3.5 flex flex-col gap-2 border ${
        tint ? '' : 'bg-surface-raised border-surface-border'
      }`}
      style={tint ? { backgroundColor: tint.bg, borderColor: tint.border } : undefined}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/55">{label}</p>
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>
      <p className={`text-lg font-bold tracking-tight truncate ${valueClassName ?? ''}`}>{value}</p>
      {helper && <div className="text-xs text-white/40 truncate">{helper}</div>}
    </div>
  )
}

interface CompactStatProps {
  label: string
  value: string
  helper?: string
}

export function CompactStat({ label, value, helper }: CompactStatProps) {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-2xl px-5 py-4 flex-1 min-w-[160px]">
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
      {helper && <p className="text-xs text-white/35 mt-0.5">{helper}</p>}
    </div>
  )
}

interface MetricItemProps {
  label: string
  value: string
  helper?: string
}

/** A slimmer stat used in a single-row divided strip, for secondary metrics. */
export function MetricItem({ label, value, helper }: MetricItemProps) {
  return (
    <div className="flex-1 min-w-0 px-5 py-2.5">
      <p className="text-xs text-white/50 truncate">{label}</p>
      <div className="flex items-baseline gap-2 min-w-0">
        <p className="text-sm font-semibold truncate">{value}</p>
        {helper && <p className="text-xs text-white/35 truncate">{helper}</p>}
      </div>
    </div>
  )
}
