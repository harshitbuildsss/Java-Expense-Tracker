/**
 * Seeds a small, realistic dataset into Smart Expense Tracker by calling the
 * REAL backend endpoints (POST /api/expenses and POST /api/expenses/income) -
 * not raw SQL - so every row goes through the same validation as a normal
 * user action, and IDs/timestamps are assigned exactly the way the app expects.
 *
 * Requirements: Node 18+ (uses built-in fetch, no dependencies), and the
 * Spring Boot backend already running (default: http://localhost:8080).
 *
 * Usage:
 *   node seed-data.mjs
 *   API_BASE_URL=http://localhost:8080 node seed-data.mjs   (override if needed)
 *
 * Safe to re-run: it only ever ADDS transactions, never deletes or modifies
 * anything already in your database.
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// ---- Dataset -------------------------------------------------------------
// "monthsAgo": 5 = five months before the current month, 0 = current month.
// "day": day-of-month (1-28, to stay valid across every month safely).
// Amounts are modest, realistic INR figures for a student/early-career budget.

const INCOME = [
  { monthsAgo: 5, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
  { monthsAgo: 4, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
  { monthsAgo: 4, day: 15, category: 'Freelance', amount: 8000, description: 'Freelance Logo Design' },
  { monthsAgo: 3, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
  { monthsAgo: 2, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
  { monthsAgo: 2, day: 8, category: 'Refund', amount: 1200, description: 'Amazon Refund' },
  { monthsAgo: 1, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
  { monthsAgo: 1, day: 18, category: 'Freelance', amount: 12000, description: 'Freelance Web Project' },
  { monthsAgo: 0, day: 1, category: 'Salary', amount: 52000, description: 'Monthly Salary' },
]

const EXPENSE = [
  // 5 months ago
  { monthsAgo: 5, day: 3, category: 'Food', amount: 350, description: 'Swiggy Order' },
  { monthsAgo: 5, day: 4, category: 'Transport', amount: 120, description: 'Auto Fare' },
  { monthsAgo: 5, day: 5, category: 'Bills', amount: 1450, description: 'Electricity Bill' },
  { monthsAgo: 5, day: 10, category: 'Shopping', amount: 2200, description: 'Amazon Order' },
  { monthsAgo: 5, day: 14, category: 'Food', amount: 280, description: 'Lunch at Cafe Coffee Day' },
  { monthsAgo: 5, day: 18, category: 'Entertainment', amount: 649, description: 'Netflix Subscription' },
  { monthsAgo: 5, day: 20, category: 'Transport', amount: 450, description: 'Ola Cab' },
  { monthsAgo: 5, day: 24, category: 'Other', amount: 300, description: 'Haircut' },

  // 4 months ago
  { monthsAgo: 4, day: 2, category: 'Food', amount: 420, description: 'Zomato Order' },
  { monthsAgo: 4, day: 5, category: 'Bills', amount: 500, description: 'Mobile Recharge' },
  { monthsAgo: 4, day: 7, category: 'Transport', amount: 80, description: 'Metro Recharge' },
  { monthsAgo: 4, day: 12, category: 'Shopping', amount: 1800, description: 'Myntra Purchase' },
  { monthsAgo: 4, day: 16, category: 'Entertainment', amount: 500, description: 'Movie Tickets' },
  { monthsAgo: 4, day: 19, category: 'Food', amount: 230, description: 'Dinner with Friends' },
  { monthsAgo: 4, day: 23, category: 'Other', amount: 150, description: 'Stationery' },
  { monthsAgo: 4, day: 27, category: 'Transport', amount: 340, description: 'Uber Ride' },

  // 3 months ago
  { monthsAgo: 3, day: 3, category: 'Food', amount: 300, description: 'Grocery Shopping' },
  { monthsAgo: 3, day: 5, category: 'Bills', amount: 1600, description: 'Internet Bill' },
  { monthsAgo: 3, day: 9, category: 'Entertainment', amount: 199, description: 'Spotify Premium' },
  { monthsAgo: 3, day: 11, category: 'Shopping', amount: 2500, description: 'Flipkart Order' },
  { monthsAgo: 3, day: 14, category: 'Transport', amount: 500, description: 'Petrol' },
  { monthsAgo: 3, day: 17, category: 'Food', amount: 380, description: 'Swiggy Order' },
  { monthsAgo: 3, day: 21, category: 'Other', amount: 600, description: 'Gift for Friend' },
  { monthsAgo: 3, day: 26, category: 'Entertainment', amount: 899, description: 'Concert Tickets' },

  // 2 months ago
  { monthsAgo: 2, day: 2, category: 'Food', amount: 260, description: 'Lunch at Cafe Coffee Day' },
  { monthsAgo: 2, day: 5, category: 'Bills', amount: 1450, description: 'Electricity Bill' },
  { monthsAgo: 2, day: 6, category: 'Transport', amount: 150, description: 'Auto Fare' },
  { monthsAgo: 2, day: 13, category: 'Shopping', amount: 950, description: 'New Shoes' },
  { monthsAgo: 2, day: 16, category: 'Food', amount: 410, description: 'Zomato Order' },
  { monthsAgo: 2, day: 19, category: 'Entertainment', amount: 649, description: 'Netflix Subscription' },
  { monthsAgo: 2, day: 22, category: 'Transport', amount: 380, description: 'Ola Cab' },
  { monthsAgo: 2, day: 25, category: 'Other', amount: 200, description: 'Miscellaneous' },

  // 1 month ago
  { monthsAgo: 1, day: 3, category: 'Food', amount: 340, description: 'Swiggy Order' },
  { monthsAgo: 1, day: 5, category: 'Bills', amount: 550, description: 'Mobile Recharge' },
  { monthsAgo: 1, day: 8, category: 'Transport', amount: 100, description: 'Metro Recharge' },
  { monthsAgo: 1, day: 11, category: 'Shopping', amount: 2100, description: 'Amazon Order' },
  { monthsAgo: 1, day: 14, category: 'Food', amount: 290, description: 'Dinner with Friends' },
  { monthsAgo: 1, day: 17, category: 'Entertainment', amount: 500, description: 'Movie Tickets' },
  { monthsAgo: 1, day: 24, category: 'Other', amount: 350, description: 'Haircut' },
  { monthsAgo: 1, day: 27, category: 'Transport', amount: 420, description: 'Uber Ride' },

  // current month (anything past today gets filtered out automatically below)
  { monthsAgo: 0, day: 2, category: 'Food', amount: 300, description: 'Swiggy Order' },
  { monthsAgo: 0, day: 5, category: 'Bills', amount: 1600, description: 'Electricity Bill' },
  { monthsAgo: 0, day: 6, category: 'Transport', amount: 130, description: 'Auto Fare' },
  { monthsAgo: 0, day: 9, category: 'Shopping', amount: 1750, description: 'Flipkart Order' },
  { monthsAgo: 0, day: 12, category: 'Food', amount: 260, description: 'Lunch at Cafe Coffee Day' },
  { monthsAgo: 0, day: 15, category: 'Entertainment', amount: 649, description: 'Netflix Subscription' },
  { monthsAgo: 0, day: 18, category: 'Transport', amount: 220, description: 'Ola Cab' },
]

// ---- Helpers ---------------------------------------------------------------

function resolveDate(monthsAgo, day) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return { iso: `${yyyy}-${mm}-${dd}`, dateObj: d }
}

function isInFuture(dateObj) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dateObj.getTime() > today.getTime()
}

async function post(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

async function seed() {
  console.log(`Seeding data into ${API_BASE_URL} ...\n`)

  const jobs = [
    ...INCOME.map((t) => ({ ...t, endpoint: '/api/expenses/income', kind: 'INCOME' })),
    ...EXPENSE.map((t) => ({ ...t, endpoint: '/api/expenses', kind: 'EXPENSE' })),
  ]

  let inserted = 0
  let skippedFuture = 0
  let failed = 0
  let totalIncome = 0
  let totalExpense = 0

  for (const job of jobs) {
    const { iso, dateObj } = resolveDate(job.monthsAgo, job.day)

    if (isInFuture(dateObj)) {
      skippedFuture++
      continue
    }

    const payload = {
      category: job.category,
      amount: job.amount,
      date: iso,
      description: job.description,
    }

    try {
      await post(job.endpoint, payload)
      inserted++
      if (job.kind === 'INCOME') totalIncome += job.amount
      else totalExpense += job.amount
      console.log(`  ✓ [${job.kind}] ${iso}  ${job.category.padEnd(14)} ₹${job.amount}  ${job.description}`)
    } catch (err) {
      failed++
      console.error(`  ✗ [${job.kind}] ${iso}  ${job.category} - ${err.message}`)
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Inserted:        ${inserted}`)
  console.log(`Skipped (future):${skippedFuture > 0 ? ' ' + skippedFuture : ' 0'}`)
  console.log(`Failed:          ${failed}`)
  console.log(`Total income added:  ₹${totalIncome.toLocaleString('en-IN')}`)
  console.log(`Total expense added: ₹${totalExpense.toLocaleString('en-IN')}`)

  if (failed > 0) {
    console.log('\nSome inserts failed - check that the backend is running and reachable at')
    console.log(API_BASE_URL, 'and that CORS/network settings allow this script to reach it.')
  }
}

seed().catch((err) => {
  console.error('\nSeeding aborted:', err.message)
  console.error(`Is the backend running at ${API_BASE_URL}?`)
  process.exit(1)
})
