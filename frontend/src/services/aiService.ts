import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl('ai')

export interface HabitSuggestion {
  name: string
  category: string
  frequency: string
}

export interface MoodAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  keywords: string[]
}

export interface MotivationalQuote {
  quote: string
  author: string
}

export interface ProgressInsight {
  type: 'success' | 'warning' | 'info'
  title: string
  message: string
  icon: string
}

export interface Recommendation {
  action: string
  habit: string
  suggestion: string
}

export interface ProgressInsights {
  insights: ProgressInsight[]
  recommendations: Recommendation[]
}

class AIService {
  async getHabitSuggestions(): Promise<HabitSuggestion[]> {
    const response = await fetch(`${API_BASE_URL}/suggest-habits`)
    if (!response.ok) {
      throw new Error('Failed to fetch habit suggestions')
    }
    const data = await response.json()
    return data.suggestions
  }

  async analyzeMood(notes: string): Promise<MoodAnalysis> {
    const response = await fetch(`${API_BASE_URL}/analyze-mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    })
    if (!response.ok) {
      throw new Error('Failed to analyze mood')
    }
    const data = await response.json()
    return data.analysis
  }

  async getMotivationalQuote(): Promise<MotivationalQuote> {
    try {
      const response = await fetch(`${API_BASE_URL}/motivational-quote`)
      if (!response.ok) {
        throw new Error('Failed to fetch motivational quote')
      }
      const data = await response.json()
      return data.quote
    } catch (err) {
      console.error('Error in getMotivationalQuote:', err)
      throw err
    }
  }

  async getProgressInsights(): Promise<ProgressInsights> {
    const response = await fetch(`${API_BASE_URL}/progress-insights`)
    if (!response.ok) {
      throw new Error('Failed to fetch progress insights')
    }
    return response.json()
  }
}

export const aiService = new AIService()
