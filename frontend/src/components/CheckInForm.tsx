import { useState, useEffect } from 'react'
import { habitLogService } from '../services/habitLogService'
import { aiService } from '../services/aiService'
import type { HabitLogCreate } from '../types/habitLog'
import type { MoodAnalysis } from '../services/aiService'
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
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Analyze mood when notes change (debounced)
    const timeoutId = setTimeout(() => {
      if (notes.trim().length > 10) {
        analyzeMood()
      } else {
        setMoodAnalysis(null)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [notes])

  const analyzeMood = async () => {
    if (!notes.trim()) return

    setIsAnalyzing(true)
    try {
      const analysis = await aiService.analyzeMood(notes)
      setMoodAnalysis(analysis)
    } catch (err) {
      console.error('Failed to analyze mood:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

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
      setMoodAnalysis(null)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log check-in')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#10b981'
      case 'negative':
        return '#ef4444'
      default:
        return '#6b7280'
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
            {isAnalyzing && <div className="analyzing-indicator">Analyzing mood...</div>}
            {moodAnalysis && !isAnalyzing && (
              <div className="mood-analysis" style={{ borderLeftColor: getSentimentColor(moodAnalysis.sentiment) }}>
                <div className="mood-header">
                  <span className="mood-sentiment" style={{ color: getSentimentColor(moodAnalysis.sentiment) }}>
                    {moodAnalysis.sentiment === 'positive' ? '😊' : moodAnalysis.sentiment === 'negative' ? '😔' : '😐'}{' '}
                    {moodAnalysis.sentiment.charAt(0).toUpperCase() + moodAnalysis.sentiment.slice(1)}
                  </span>
                  <span className="mood-confidence">{(moodAnalysis.confidence * 100).toFixed(0)}% confidence</span>
                </div>
                {moodAnalysis.keywords.length > 0 && (
                  <div className="mood-keywords">
                    Keywords: {moodAnalysis.keywords.join(', ')}
                  </div>
                )}
              </div>
            )}
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
