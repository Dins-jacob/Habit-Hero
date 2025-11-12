export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum HabitCategory {
  HEALTH = 'health',
  WORK = 'work',
  LEARNING = 'learning',
  FITNESS = 'fitness',
  MENTAL_HEALTH = 'mental_health',
  PRODUCTIVITY = 'productivity',
}

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
