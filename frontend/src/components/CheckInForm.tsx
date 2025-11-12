import { useState } from 'react'
import { habitLogService } from '../services/habitLogService'
import type { HabitLogCreate } from '../types/habitLog'
import './CheckInForm.css'

interface CheckInFormProps {
  habitId: number
  habitName: string
  onSuccess: () => void
  onCancel?: () => void
}

export default function CheckInForm({ habitId, habitName, onSuccess, onCancel }: CheckInFormProps) {
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const logData: HabitLogCreate = {
        habit_id: habitId,
        log_date: new Date().toISOString(),
        notes: notes.trim() || null,
      }
      await habitLogService.create(logData)
      setNotes('')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log check-in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkin-form-overlay" onClick={onCancel}>
      <div className="checkin-form-container" onClick={(e) => e.stopPropagation()}>
        <h2>Check In: {habitName}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="How did it go? Add any notes about your progress..."
              maxLength={2000}
            />
          </div>
          <div className="form-actions">
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : '✓ Check In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

