const API_BASE_URL = '/api/ai'

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
    const response = await fetch(`${API_BASE_URL}/motivational-quote`)
    if (!response.ok) {
      throw new Error('Failed to fetch motivational quote')
    }
    const data = await response.json()
    return data.quote
  }
}

export const aiService = new AIService()

