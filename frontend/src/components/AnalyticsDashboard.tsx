import { useEffect, useState } from 'react'
import { analyticsService } from '../services/analyticsService'
import type { BestDays, CategoryStats, CheckinsByDate, OverallStats } from '../services/analyticsService'
import './AnalyticsDashboard.css'

export default function AnalyticsDashboard() {
  const [overallStats, setOverallStats] = useState<OverallStats['overall_stats'] | null>(null)
  const [bestDays, setBestDays] = useState<BestDays['best_days']>({})
  const [checkinsByDate, setCheckinsByDate] = useState<CheckinsByDate['checkins_by_date']>({})
  const [categoryStats, setCategoryStats] = useState<CategoryStats['category_stats']>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [overall, bestDaysData, checkinsData, categoryData] = await Promise.all([
        analyticsService.getOverallStats(),
        analyticsService.getBestDays(),
        analyticsService.getCheckinsByDate(undefined, 30),
        analyticsService.getCategoryStats(),
      ])

      setOverallStats(overall.overall_stats)
      setBestDays(bestDaysData.best_days)
      setCheckinsByDate(checkinsData.checkins_by_date)
      setCategoryStats(categoryData.category_stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const getMaxCount = (data: Record<string, number>) => {
    const values = Object.values(data)
    return values.length > 0 ? Math.max(...values) : 1
  }

  const formatCategoryName = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  const maxBestDays = getMaxCount(bestDays)
  const maxCategoryLogs = getMaxCount(
    Object.fromEntries(Object.entries(categoryStats).map(([k, v]) => [k, v.total_logs]))
  )

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>

      {/* Overall Stats Cards */}
      {overallStats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{overallStats.total_habits}</div>
            <div className="stat-label">Total Habits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.total_checkins}</div>
            <div className="stat-label">Total Check-ins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.week_checkins}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      )}

      {/* Best Days Chart */}
      <div className="chart-card">
        <h3>Best Days for Check-ins</h3>
        <div className="chart-container">
          {dayOrder.map((day) => {
            const count = bestDays[day] || 0
            const percentage = maxBestDays > 0 ? (count / maxBestDays) * 100 : 0
            return (
              <div key={day} className="bar-item">
                <div className="bar-label">{day.substring(0, 3)}</div>
                <div className="bar-wrapper">
                  <div className="bar" style={{ width: `${percentage}%` }}>
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Statistics */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="chart-card">
          <h3>Statistics by Category</h3>
          <div className="category-stats">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = maxCategoryLogs > 0 ? (stats.total_logs / maxCategoryLogs) * 100 : 0
              return (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span className="category-name">{formatCategoryName(category)}</span>
                    <span className="category-count">
                      {stats.total_logs} check-ins • {stats.habit_count} habits
                    </span>
                  </div>
                  <div className="category-bar-wrapper">
                    <div className="category-bar" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Activity (Last 30 days) */}
      {Object.keys(checkinsByDate).length > 0 && (
        <div className="chart-card">
          <h3>Check-ins Over Last 30 Days</h3>
          <div className="activity-summary">
            <p>Total check-ins in the last 30 days: {Object.values(checkinsByDate).reduce((a, b) => a + b, 0)}</p>
            <p className="activity-detail">
              Average per day: {(Object.values(checkinsByDate).reduce((a, b) => a + b, 0) / 30).toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

