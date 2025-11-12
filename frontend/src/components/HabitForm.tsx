import { useState } from 'react'
import { HabitCategory, HabitFrequency, type HabitCreate } from '../types'
import './HabitForm.css'

interface HabitFormProps {
  onSubmit: (habit: HabitCreate) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<HabitCreate>
}

export default function HabitForm({ onSubmit, onCancel, initialData }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitCreate>({
    name: initialData?.name || '',
    frequency: initialData?.frequency || HabitFrequency.DAILY,
    category: initialData?.category || HabitCategory.HEALTH,
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    description: initialData?.description || null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setFormData({
        name: '',
        frequency: HabitFrequency.DAILY,
        category: HabitCategory.HEALTH,
        start_date: new Date().toISOString().split('T')[0],
        description: null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save habit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2>Create New Habit</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="name">Habit Name *</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          maxLength={200}
          placeholder="e.g., Morning Exercise"
        />
      </div>
      <div className="form-group">
        <label htmlFor="frequency">Frequency *</label>
        <select
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as HabitFrequency })}
          required
        >
          <option value={HabitFrequency.DAILY}>Daily</option>
          <option value={HabitFrequency.WEEKLY}>Weekly</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as HabitCategory })}
          required
        >
          <option value={HabitCategory.HEALTH}>Health</option>
          <option value={HabitCategory.WORK}>Work</option>
          <option value={HabitCategory.LEARNING}>Learning</option>
          <option value={HabitCategory.FITNESS}>Fitness</option>
          <option value={HabitCategory.MENTAL_HEALTH}>Mental Health</option>
          <option value={HabitCategory.PRODUCTIVITY}>Productivity</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="start_date">Start Date *</label>
        <input
          type="date"
          id="start_date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
          rows={3}
          maxLength={1000}
          placeholder="Add a description for this habit..."
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={isSubmitting || !formData.name.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Habit'}
        </button>
      </div>
    </form>
  )
}

