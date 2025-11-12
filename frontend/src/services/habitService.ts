import type { Habit, HabitCreate, HabitUpdate } from '../types'
import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl('habits')

class HabitService {
  async getAll(): Promise<Habit[]> {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch habits')
    }
    return response.json()
  }

  async getById(id: number): Promise<Habit> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch habit')
    }
    return response.json()
  }

  async create(habit: HabitCreate): Promise<Habit> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    })
    if (!response.ok) {
      throw new Error('Failed to create habit')
    }
    return response.json()
  }

  async update(id: number, habit: HabitUpdate): Promise<Habit> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    })
    if (!response.ok) {
      throw new Error('Failed to update habit')
    }
    return response.json()
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete habit')
    }
  }
}

export const habitService = new HabitService()

