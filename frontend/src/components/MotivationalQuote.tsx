import { useEffect, useState } from 'react'
import { aiService } from '../services/aiService'
import type { MotivationalQuote } from '../services/aiService'
import './MotivationalQuote.css'

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadQuote()
  }, [])

  const loadQuote = async () => {
    setIsLoading(true)
    try {
      const data = await aiService.getMotivationalQuote()
      setQuote(data)
    } catch (err) {
      console.error('Failed to load quote:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="motivational-quote">
        <div className="loading">Loading quote...</div>
      </div>
    )
  }

  if (!quote) {
    return null
  }

  return (
    <div className="motivational-quote">
      <div className="quote-icon">💪</div>
      <blockquote className="quote-text">"{quote.quote}"</blockquote>
      <p className="quote-author">— {quote.author}</p>
      <button className="refresh-quote-btn" onClick={loadQuote} title="Get another quote">
        ↻ New Quote
      </button>
    </div>
  )
}

