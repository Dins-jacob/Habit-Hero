import { useEffect, useState } from 'react'
import { analyticsService } from '../services/analyticsService'
import { exportService } from '../services/exportService'
import type { BestDays, CategoryStats, CheckinsByDate, OverallStats } from '../services/analyticsService'
import BestDaysChart from './charts/BestDaysChart'
import CategoryChart from './charts/CategoryChart'
import CheckinsOverTimeChart from './charts/CheckinsOverTimeChart'
import './AnalyticsDashboard.css'

export default function AnalyticsDashboard() {
  const [overallStats, setOverallStats] = useState<OverallStats['overall_stats'] | null>(null)
  const [bestDays, setBestDays] = useState<BestDays['best_days']>({})
  const [checkinsByDate, setCheckinsByDate] = useState<CheckinsByDate['checkins_by_date']>({})
  const [categoryStats, setCategoryStats] = useState<CategoryStats['category_stats']>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
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


  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportService.exportToPDF()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <button className="export-btn" onClick={handleExportPDF} disabled={isExporting}>
          {isExporting ? 'Exporting...' : '📄 Export PDF'}
        </button>
      </div>

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
        <BestDaysChart data={bestDays} />
      </div>

      {/* Category Statistics */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="chart-card">
          <h3>Statistics by Category</h3>
          <CategoryChart data={categoryStats} />
        </div>
      )}

      {/* Recent Activity (Last 30 days) */}
      {Object.keys(checkinsByDate).length > 0 && (
        <div className="chart-card">
          <h3>Check-ins Over Last 30 Days</h3>
          <CheckinsOverTimeChart data={checkinsByDate} days={30} />
          <div className="activity-summary">
            <p>Total check-ins in the last 30 days: <strong>{Object.values(checkinsByDate).reduce((a, b) => a + b, 0)}</strong></p>
            <p className="activity-detail">
              Average per day: <strong>{(Object.values(checkinsByDate).reduce((a, b) => a + b, 0) / 30).toFixed(1)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

