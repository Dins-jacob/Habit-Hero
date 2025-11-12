import type { Habit } from '../types'
import './HabitList.css'

interface HabitListProps {
  habits: Habit[]
  onDelete?: (id: number) => void
  onEdit?: (habit: Habit) => void
  onCheckIn?: (habitId: number) => void
  isLoading?: boolean
  streaks?: Record<number, number>
  successRates?: Record<number, number>
}

export default function HabitList({
  habits,
  onDelete,
  onEdit,
  onCheckIn,
  isLoading,
  streaks = {},
  successRates = {},
}: HabitListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: '#10b981',
      work: '#3b82f6',
      learning: '#8b5cf6',
      fitness: '#f59e0b',
      mental_health: '#ec4899',
      productivity: '#6366f1',
    }
    return colors[category] || '#6b7280'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="habit-list">
        <div className="loading">Loading habits...</div>
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="habit-list">
        <div className="empty-state">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="habit-list">
      <h2>Your Habits ({habits.length})</h2>
      <div className="habits-grid">
        {habits.map((habit) => {
          const streak = streaks[habit.id] || 0
          const successRate = successRates[habit.id] || 0

          return (
            <div key={habit.id} className="habit-card">
              <div className="habit-header">
                <h3>{habit.name}</h3>
                <div className="habit-actions">
                  {onEdit && (
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(habit)}
                      aria-label="Edit habit"
                      title="Edit habit"
                    >
                      ✎
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(habit.id)}
                      aria-label="Delete habit"
                      title="Delete habit"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="habit-meta">
                <span className="badge" style={{ backgroundColor: getCategoryColor(habit.category) }}>
                  {habit.category.replace('_', ' ')}
                </span>
                <span className="frequency">{habit.frequency}</span>
              </div>
              {habit.description && <p className="habit-description">{habit.description}</p>}
              <div className="habit-stats">
                <div className="stat-item">
                  <span className="stat-label">Streak:</span>
                  <span className="stat-value streak-value">{streak} days</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Success Rate:</span>
                  <span className="stat-value">{successRate.toFixed(0)}%</span>
                </div>
              </div>
              <div className="habit-actions-bottom">
                {onCheckIn && (
                  <button className="checkin-btn" onClick={() => onCheckIn(habit.id)}>
                    ✓ Check In
                  </button>
                )}
              </div>
              <div className="habit-footer">
                <span className="start-date">Started: {formatDate(habit.start_date)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
