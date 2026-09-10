import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Receipt,
  PlusCircle,
  Shapes,
  Search,
  FileBarChart2,
  Settings,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { APP_NAME, APP_TAGLINE, PRIMARY_NAV, SECONDARY_NAV } from '../utils/constants'
import { MotivationCard } from './MotivationCard'

const ICONS: Record<string, LucideIcon> = {
  '/': LayoutGrid,
  '/transactions': Receipt,
  '/add': PlusCircle,
  '/categories': Shapes,
  '/search': Search,
  '/reports': FileBarChart2,
  '/settings': Settings,
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-surface-border px-4 py-4 justify-between select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-accent">{APP_NAME}</p>
            <p className="text-[11px] text-white/40 leading-tight">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map(({ to, label, end }) => {
            const Icon = ICONS[to]
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-black font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            )
          })}
        </nav>

        <div className="my-3 border-t border-surface-border" />

        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-0.5">
          {SECONDARY_NAV.map(({ to, label }) => {
            const Icon = ICONS[to]
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-black font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Bottom Pinned Motivation Card */}
      <div className="pt-2">
        <MotivationCard />
      </div>
    </aside>
  )
}