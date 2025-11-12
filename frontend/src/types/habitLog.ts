export interface HabitLog {
  id: number
  habit_id: number
  log_date: string
  notes: string | null
  created_at: string
}

export interface HabitLogCreate {
  habit_id: number
  log_date?: string
  notes?: string | null
}

export interface HabitLogUpdate {
  log_date?: string
  notes?: string | null
}

