import './StatusCard.css'

interface StatusCardProps {
  status: 'ok' | 'error' | 'checking...'
}

export default function StatusCard({ status }: StatusCardProps) {
  return (
    <div className="status-card">
      <h2>System Status</h2>
      <p className="status-indicator">
        Backend API:{' '}
        <span className={status === 'ok' ? 'status-ok' : status === 'error' ? 'status-error' : 'status-checking'}>
          {status}
        </span>
      </p>
    </div>
  )
}

