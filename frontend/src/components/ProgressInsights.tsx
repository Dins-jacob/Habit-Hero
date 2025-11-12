import { useEffect, useState } from 'react'
import { aiService } from '../services/aiService'
import type { ProgressInsights, ProgressInsight, Recommendation } from '../services/aiService'
import './ProgressInsights.css'

export default function ProgressInsights() {
  const [insights, setInsights] = useState<ProgressInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await aiService.getProgressInsights()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights')
      console.error('Failed to load insights:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981'
      case 'warning':
        return '#f59e0b'
      case 'info':
        return '#3b82f6'
      default:
        return '#64748b'
    }
  }

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
      case 'warning':
        return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
      case 'info':
        return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
      default:
        return '#f9fafb'
    }
  }

  if (isLoading) {
    return (
      <div className="progress-insights">
        <div className="loading">Analyzing your progress...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="progress-insights">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!insights) {
    return null
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`progress-insights ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="insights-header" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
        <h3>
          <span className="header-icon">🤖</span>
          AI Progress Insights
          {insights && insights.insights.length > 0 && (
            <span className="insight-count">({insights.insights.length} insights)</span>
          )}
        </h3>
        <div className="header-actions">
          <button 
            className="refresh-btn" 
            onClick={(e) => {
              e.stopPropagation()
              loadInsights()
            }} 
            title="Refresh insights"
          >
            ↻
          </button>
          <button className="expand-btn" title={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="insights-content">
          {insights.insights.length > 0 && (
            <div className="insights-list">
              {insights.insights.map((insight: ProgressInsight, index: number) => (
                <div
                  key={index}
                  className="insight-card"
                  style={{
                    borderLeftColor: getInsightColor(insight.type),
                    background: getInsightBg(insight.type),
                  }}
                >
                  <div className="insight-icon">{insight.icon}</div>
                  <div className="insight-content">
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-message">{insight.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {insights.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4>💡 Personalized Recommendations</h4>
              <div className="recommendations-list">
                {insights.recommendations.map((rec: Recommendation, index: number) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <span className="rec-action">{rec.action}</span>
                      <span className="rec-habit">{rec.habit}</span>
                    </div>
                    <div className="rec-suggestion">{rec.suggestion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.insights.length === 0 && insights.recommendations.length === 0 && (
            <div className="no-insights">
              <p>Start tracking habits to receive personalized AI insights!</p>
            </div>
          )}
        </div>
      )}

      {!isExpanded && insights && insights.insights.length > 0 && (
        <div className="preview-summary" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          <div className="preview-insight">
            <span className="preview-icon">{insights.insights[0].icon}</span>
            <span className="preview-text">{insights.insights[0].title}</span>
          </div>
          <span className="preview-hint">Click to view all insights →</span>
        </div>
      )}
    </div>
  )
}

