import { useEffect, useState } from 'react'
import { HabitCategory, HabitFrequency, type HabitCreate } from '../types'
import './HabitForm.css'

interface HabitFormProps {
  onSubmit: (habit: HabitCreate) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<HabitCreate>
  isEditMode?: boolean
}

const categoryIcons: Record<HabitCategory, string> = {
  [HabitCategory.HEALTH]: '🏥',
  [HabitCategory.WORK]: '💼',
  [HabitCategory.LEARNING]: '📚',
  [HabitCategory.FITNESS]: '💪',
  [HabitCategory.MENTAL_HEALTH]: '🧘',
  [HabitCategory.PRODUCTIVITY]: '⚡',
}

const frequencyIcons: Record<HabitFrequency, string> = {
  [HabitFrequency.DAILY]: '📅',
  [HabitFrequency.WEEKLY]: '📆',
}

export default function HabitForm({ onSubmit, onCancel, initialData, isEditMode = false }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitCreate>({
    name: initialData?.name || '',
    frequency: initialData?.frequency || HabitFrequency.DAILY,
    category: initialData?.category || HabitCategory.HEALTH,
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    description: initialData?.description || null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        frequency: initialData.frequency || HabitFrequency.DAILY,
        category: initialData.category || HabitCategory.HEALTH,
        start_date: initialData.start_date || new Date().toISOString().split('T')[0],
        description: initialData.description || null,
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      if (!isEditMode) {
        // Only reset form if creating new habit
        setFormData({
          name: '',
          frequency: HabitFrequency.DAILY,
          category: HabitCategory.HEALTH,
          start_date: new Date().toISOString().split('T')[0],
          description: null,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save habit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formProgress = () => {
    let filled = 0
    if (formData.name.trim()) filled++
    if (formData.frequency) filled++
    if (formData.category) filled++
    if (formData.start_date) filled++
    return (filled / 4) * 100
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-header-icon">{isEditMode ? '✏️' : '✨'}</div>
        <h2>{isEditMode ? 'Edit Habit' : 'Create New Habit'}</h2>
        <div className="form-progress-bar">
          <div 
            className="form-progress-fill" 
            style={{ width: `${formProgress()}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-fields">
        <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''}`}>
          <label htmlFor="name">
            <span className="label-icon">📝</span>
            Habit Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              maxLength={200}
              placeholder="e.g., Morning Exercise"
            />
            {formData.name && <span className="input-check">✓</span>}
          </div>
          {formData.name && <div className="char-count">{formData.name.length}/200</div>}
        </div>

        <div className="form-row">
          <div className={`form-group ${focusedField === 'frequency' ? 'focused' : ''} ${formData.frequency ? 'filled' : ''}`}>
            <label htmlFor="frequency">
              <span className="label-icon">{frequencyIcons[formData.frequency]}</span>
              Frequency <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as HabitFrequency })}
                onFocus={() => setFocusedField('frequency')}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value={HabitFrequency.DAILY}>📅 Daily</option>
                <option value={HabitFrequency.WEEKLY}>📆 Weekly</option>
              </select>
            </div>
          </div>

          <div className={`form-group ${focusedField === 'category' ? 'focused' : ''} ${formData.category ? 'filled' : ''}`}>
            <label htmlFor="category">
              <span className="label-icon">{categoryIcons[formData.category]}</span>
              Category <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as HabitCategory })}
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value={HabitCategory.HEALTH}>🏥 Health</option>
                <option value={HabitCategory.WORK}>💼 Work</option>
                <option value={HabitCategory.LEARNING}>📚 Learning</option>
                <option value={HabitCategory.FITNESS}>💪 Fitness</option>
                <option value={HabitCategory.MENTAL_HEALTH}>🧘 Mental Health</option>
                <option value={HabitCategory.PRODUCTIVITY}>⚡ Productivity</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`form-group ${focusedField === 'start_date' ? 'focused' : ''} ${formData.start_date ? 'filled' : ''}`}>
          <label htmlFor="start_date">
            <span className="label-icon">🗓️</span>
            Start Date <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              onFocus={() => setFocusedField('start_date')}
              onBlur={() => setFocusedField(null)}
              required
            />
            {formData.start_date && <span className="input-check">✓</span>}
          </div>
        </div>

        <div className={`form-group ${focusedField === 'description' ? 'focused' : ''} ${formData.description ? 'filled' : ''}`}>
          <label htmlFor="description">
            <span className="label-icon">📄</span>
            Description <span className="optional">(optional)</span>
          </label>
          <div className="textarea-wrapper">
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              rows={4}
              maxLength={1000}
              placeholder="Add a description for this habit..."
            />
            {formData.description && (
              <div className="char-count">{formData.description.length}/1000</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
            <span>Cancel</span>
          </button>
        )}
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting || !formData.name.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <span>{isEditMode ? '✏️' : '✨'}</span>
              {isEditMode ? 'Update Habit' : 'Create Habit'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
