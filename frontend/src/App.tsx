import { useState, useEffect } from 'react'
import Header from './components/Header'
import StatusCard from './components/StatusCard'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import CheckInForm from './components/CheckInForm'
import { apiService } from './services/api'
import { habitService } from './services/habitService'
import { habitLogService } from './services/habitLogService'
import type { Habit, HabitCreate } from './types'
import './App.css'

function App() {
  console.log('App component rendering...')
  const [healthStatus, setHealthStatus] = useState<'ok' | 'error' | 'checking...'>('checking...')
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoadingHabits, setIsLoadingHabits] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null)
  const [streaks, setStreaks] = useState<Record<number, number>>({})
  const [successRates, setSuccessRates] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Checking health status...')
    apiService
      .getHealth()
      .then((data) => {
        console.log('Health check result:', data)
        setHealthStatus(data.status === 'ok' ? 'ok' : 'error')
      })
      .catch((err) => {
        console.error('Health check failed:', err)
        setHealthStatus('error')
      })
  }, [])

  const loadHabits = async () => {
    setIsLoadingHabits(true)
    setError(null)
    try {
      const data = await habitService.getAll()
      setHabits(data)
      
      // Load streaks and success rates for all habits
      const streaksData: Record<number, number> = {}
      const successRatesData: Record<number, number> = {}
      
      for (const habit of data) {
        try {
          const streak = await habitLogService.getStreak(habit.id)
          const successRate = await habitLogService.getSuccessRate(habit.id)
          streaksData[habit.id] = streak
          successRatesData[habit.id] = successRate
        } catch (err) {
          console.error(`Failed to load stats for habit ${habit.id}:`, err)
          streaksData[habit.id] = 0
          successRatesData[habit.id] = 0
        }
      }
      
      setStreaks(streaksData)
      setSuccessRates(successRatesData)
    } catch (err) {
      console.error('Failed to load habits:', err)
      setError(err instanceof Error ? err.message : 'Failed to load habits')
      setHabits([])
    } finally {
      setIsLoadingHabits(false)
    }
  }

  useEffect(() => {
    loadHabits()
  }, [])

  const handleCreateHabit = async (habitData: HabitCreate) => {
    try {
      await habitService.create(habitData)
      setShowForm(false)
      await loadHabits()
    } catch (err) {
      throw err
    }
  }

  const handleDeleteHabit = async (id: number) => {
    if (!confirm('Are you sure you want to delete this habit?')) {
      return
    }
    try {
      await habitService.delete(id)
      await loadHabits()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete habit')
    }
  }

  const handleCheckIn = (habitId: number) => {
    setSelectedHabitId(habitId)
    setShowCheckIn(true)
  }

  const handleCheckInSuccess = () => {
    setShowCheckIn(false)
    setSelectedHabitId(null)
    loadHabits() // Reload to update streaks
  }

  const handleCheckInCancel = () => {
    setShowCheckIn(false)
    setSelectedHabitId(null)
  }

  const selectedHabit = selectedHabitId ? habits.find((h) => h.id === selectedHabitId) : null

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <StatusCard status={healthStatus} />
        {error && <div className="error-banner">{error}</div>}
        {showCheckIn && selectedHabit && (
          <CheckInForm
            habitId={selectedHabit.id}
            habitName={selectedHabit.name}
            onSuccess={handleCheckInSuccess}
            onCancel={handleCheckInCancel}
          />
        )}
        {showForm ? (
          <HabitForm onSubmit={handleCreateHabit} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            <div className="actions-bar">
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                + Create New Habit
              </button>
            </div>
            <HabitList
              habits={habits}
              onDelete={handleDeleteHabit}
              onCheckIn={handleCheckIn}
              isLoading={isLoadingHabits}
              streaks={streaks}
              successRates={successRates}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
