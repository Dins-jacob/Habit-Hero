import { useEffect, useState } from 'react'
import { aiService } from '../services/aiService'
import type { HabitSuggestion } from '../services/aiService'
import { habitService } from '../services/habitService'
import { HabitCategory, HabitFrequency } from '../types'
import './HabitSuggestions.css'

interface HabitSuggestionsProps {
  onSuggestionSelect: (suggestion: HabitSuggestion) => void
}

export default function HabitSuggestions({ onSuggestionSelect }: HabitSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await aiService.getHabitSuggestions()
      setSuggestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSuggestion = async (suggestion: HabitSuggestion) => {
    try {
      await habitService.create({
        name: suggestion.name,
        category: suggestion.category as HabitCategory,
        frequency: suggestion.frequency as HabitFrequency,
        start_date: new Date().toISOString().split('T')[0],
      })
      onSuggestionSelect(suggestion)
      // Reload suggestions after adding one
      await loadSuggestions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add habit')
    }
  }

  if (isLoading) {
    return (
      <div className="habit-suggestions">
        <div className="loading">Loading suggestions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="habit-suggestions">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="habit-suggestions">
        <p className="no-suggestions">No suggestions available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="habit-suggestions">
      <div className="suggestions-header">
        <h3>💡 Suggested Habits for You</h3>
        <button className="refresh-btn" onClick={loadSuggestions} title="Refresh suggestions">
          ↻
        </button>
      </div>
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-card">
            <div className="suggestion-content">
              <h4>{suggestion.name}</h4>
              <div className="suggestion-meta">
                <span className="suggestion-category">{suggestion.category.replace('_', ' ')}</span>
                <span className="suggestion-frequency">{suggestion.frequency}</span>
              </div>
            </div>
            <button className="add-suggestion-btn" onClick={() => handleAddSuggestion(suggestion)}>
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

