const API_BASE_URL = '/api/gamification'

export interface Badge {
  id: string
  name: string
  description: string
  xp: number
}

export interface GamificationStats {
  total_xp: number
  level: number
  xp_to_next_level: number
  badges: Badge[]
  badge_count: number
}

class GamificationService {
  async getStats(): Promise<GamificationStats> {
    const response = await fetch(`${API_BASE_URL}/stats`)
    if (!response.ok) {
      throw new Error('Failed to fetch gamification stats')
    }
    return response.json()
  }

  async checkBadges(): Promise<{ new_badges: Badge[]; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/check-badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Badge check failed:', response.status, errorText)
        throw new Error(`Failed to check badges: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Badge check result:', data)
      return data
    } catch (err) {
      console.error('Error in checkBadges:', err)
      throw err
    }
  }
}

export const gamificationService = new GamificationService()

