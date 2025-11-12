import type { HabitLog, HabitLogCreate, HabitLogUpdate } from '../types/habitLog'
import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl('habit-logs')

class HabitLogService {
  async getByHabitId(habitId: number): Promise<HabitLog[]> {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch habit logs')
    }
    return response.json()
  }

  async getById(id: number): Promise<HabitLog> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch habit log')
    }
    return response.json()
  }

  async create(log: HabitLogCreate): Promise<HabitLog> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    })
    if (!response.ok) {
      throw new Error('Failed to create habit log')
    }
    return response.json()
  }

  async update(id: number, log: HabitLogUpdate): Promise<HabitLog> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    })
    if (!response.ok) {
      throw new Error('Failed to update habit log')
    }
    return response.json()
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete habit log')
    }
  }

  async getStreak(habitId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}/streak`)
    if (!response.ok) {
      throw new Error('Failed to fetch streak')
    }
    const data = await response.json()
    return data.streak
  }

  async getSuccessRate(habitId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/habit/${habitId}/success-rate`)
    if (!response.ok) {
      throw new Error('Failed to fetch success rate')
    }
    const data = await response.json()
    return data.success_rate
  }
}

export const habitLogService = new HabitLogService()

