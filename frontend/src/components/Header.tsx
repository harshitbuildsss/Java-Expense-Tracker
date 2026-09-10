import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bell, Menu, X, Wallet } from 'lucide-react'
import { APP_NAME, PRIMARY_NAV, SECONDARY_NAV } from '../utils/constants'

interface HeaderProps {
  title: string
  subtitle: string
  greeting?: boolean
}

function timeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function Header({ title, subtitle, greeting = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg border border-surface-border flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {greeting ? (
                <>
                  {timeOfDayGreeting()}, {title} <span aria-hidden="true">👋</span>
                </>
              ) : (
                title
              )}
            </h1>
            <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            className="w-9 h-9 rounded-full border border-surface-border flex items-center justify-center text-white/70 hover:text-white relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
          </button>
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold">
              HS
            </div>
            <span className="text-sm font-medium text-white/90">Harshit Singh</span>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-surface-raised border-r border-surface-border px-4 py-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                  <Wallet size={18} />
                </div>
                <p className="text-lg font-bold text-accent">{APP_NAME}</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/50 hover:text-white"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {[...PRIMARY_NAV, ...SECONDARY_NAV].map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-accent text-black' : 'text-white/70 hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
