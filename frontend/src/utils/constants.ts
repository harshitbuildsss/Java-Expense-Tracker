// Curated for maximum visual distinction on a dark background - no two
// entries share a hue family (previously "amber" and "orange", or "emerald"
// and "teal", looked identical as small dots even though they were
// technically different hex values).
const PALETTE = [
  '#4C8DFF', // blue
  '#FB923C', // orange
  '#34D399', // green
  '#F0559C', // pink
  '#A78BFA', // violet
  '#FACC15', // yellow
  '#FB7185', // rose
  '#22D3EE', // cyan
  '#B45309', // brown
  '#94A3B8', // slate
]

// A few names get a fixed, semantically obvious color regardless of assignment order.
const FIXED_COLORS: Record<string, string> = {
  Salary: '#4ADE80',
  Freelance: '#4ADE80',
  Refund: '#4ADE80',
  'Other Income': '#4ADE80',
  Other: '#9CA3AF',
}

export const FALLBACK_CATEGORY_COLOR = '#9CA3AF'

// The first time a category name is seen anywhere in the app, it claims the
// next unused palette color and keeps it for the rest of the session - this
// guarantees no two categories collide (as long as there are <= PALETTE.length
// distinct categories), unlike hashing the name, which can and did land two
// different names on similar-looking colors.
const categoryColorCache = new Map<string, string>()
let nextColorIndex = 0

/**
 * Assigns a stable, distinct palette color to any category string, so a
 * custom category typed by the user (e.g. "College", "Swimming") still gets
 * a real, consistent color everywhere it appears (chart, badges, legend).
 */
export function colorForCategory(category: string): string {
  if (FIXED_COLORS[category]) return FIXED_COLORS[category]
  if (!category) return FALLBACK_CATEGORY_COLOR

  const cached = categoryColorCache.get(category)
  if (cached) return cached

  const color = PALETTE[nextColorIndex % PALETTE.length]
  nextColorIndex++
  categoryColorCache.set(category, color)
  return color
}

export const APP_NAME = 'Expensely'
export const APP_TAGLINE = 'Personal Expense Tracker'

export interface NavItem {
  to: string
  label: string
  end?: boolean
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transactions', label: 'Transactions' },
  { to: '/add', label: 'Add Transaction' },
  { to: '/categories', label: 'Categories' },
  { to: '/search', label: 'Search' },
  { to: '/reports', label: 'Summary' },
]

export const SECONDARY_NAV: NavItem[] = [{ to: '/settings', label: 'Settings' }]

