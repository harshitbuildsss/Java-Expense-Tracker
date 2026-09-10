import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { TransactionForm } from '../components/TransactionForm'

export function AddTransaction() {
  const navigate = useNavigate()

  return (
    <div>
      <Header title="Add Transaction" subtitle="Record a new income or expense" />

      <div className="max-w-md">
        <div className="bg-surface-raised border border-surface-border rounded-2xl p-6">
          <TransactionForm mode="create" onSuccess={() => navigate('/transactions')} />
        </div>
      </div>
    </div>
  )
}
