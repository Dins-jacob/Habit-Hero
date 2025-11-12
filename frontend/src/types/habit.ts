export const HabitFrequency = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const

export type HabitFrequency = typeof HabitFrequency[keyof typeof HabitFrequency]

export const HabitCategory = {
  HEALTH: 'health',
  WORK: 'work',
  LEARNING: 'learning',
  FITNESS: 'fitness',
  MENTAL_HEALTH: 'mental_health',
  PRODUCTIVITY: 'productivity',
} as const

export type HabitCategory = typeof HabitCategory[keyof typeof HabitCategory]

export interface Habit {
  id: number
  name: string
  frequency: HabitFrequency
  category: HabitCategory
  start_date: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface HabitCreate {
  name: string
  frequency: HabitFrequency
  category: HabitCategory
  start_date: string
  description?: string | null
}

export interface HabitUpdate {
  name?: string
  frequency?: HabitFrequency
  category?: HabitCategory
  start_date?: string
  description?: string | null
}
