import { useEffect, useState } from 'react'
import { aiService } from '../services/aiService'
import type { MotivationalQuote } from '../services/aiService'
import './MotivationalQuote.css'

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    loadQuote()

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadQuote()
    }, 5000) // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const loadQuote = async () => {
    setIsLoading(true)
    setIsAnimating(true)
    
    try {
      const data = await aiService.getMotivationalQuote()
      
      // Small delay to allow slide-out animation
      setTimeout(() => {
        setQuote(data)
        setIsAnimating(false)
        setIsLoading(false)
      }, 300)
    } catch (err) {
      console.error('Failed to load quote:', err)
      setIsLoading(false)
      setIsAnimating(false)
    }
  }

  if (!quote && isLoading) {
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
    <div className={`motivational-quote ${isAnimating ? 'animating' : ''}`}>
      <div className="quote-icon">💪</div>
      <blockquote className="quote-text">"{quote.quote}"</blockquote>
      <p className="quote-author">— {quote.author}</p>
    </div>
  )
}
