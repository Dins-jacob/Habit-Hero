// Common types for the application

export interface ApiError {
  message: string
  detail?: string
}

// Re-export all habit types
export * from './habit'
export * from './habitLog'
