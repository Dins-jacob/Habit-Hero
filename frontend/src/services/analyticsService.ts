import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl('analytics')

export interface BestDays {
  best_days: Record<string, number>
}

export interface CheckinsByDate {
  checkins_by_date: Record<string, number>
}

export interface CategoryStats {
  category_stats: Record<string, { total_logs: number; habit_count: number }>
}

export interface OverallStats {
  overall_stats: {
    total_habits: number
    total_checkins: number
    week_checkins: number
  }
}

class AnalyticsService {
  async getBestDays(habitId?: number): Promise<BestDays> {
    const url = habitId ? `${API_BASE_URL}/best-days?habit_id=${habitId}` : `${API_BASE_URL}/best-days`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch best days')
    }
    return response.json()
  }

  async getCheckinsByDate(habitId?: number, days: number = 30): Promise<CheckinsByDate> {
    const url = habitId
      ? `${API_BASE_URL}/checkins-by-date?habit_id=${habitId}&days=${days}`
      : `${API_BASE_URL}/checkins-by-date?days=${days}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch check-ins by date')
    }
    return response.json()
  }

  async getCategoryStats(): Promise<CategoryStats> {
    const response = await fetch(`${API_BASE_URL}/category-stats`)
    if (!response.ok) {
      throw new Error('Failed to fetch category stats')
    }
    return response.json()
  }

  async getOverallStats(): Promise<OverallStats> {
    const response = await fetch(`${API_BASE_URL}/overall`)
    if (!response.ok) {
      throw new Error('Failed to fetch overall stats')
    }
    return response.json()
  }
}

export const analyticsService = new AnalyticsService()

