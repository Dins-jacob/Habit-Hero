import { useState, useEffect } from 'react'
import Header from './components/Header'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import CheckInForm from './components/CheckInForm'
import ConfirmDialog from './components/ConfirmDialog'
import HabitSuggestions from './components/HabitSuggestions'
import MotivationalQuote from './components/MotivationalQuote'
import GamificationPanel from './components/GamificationPanel'
import ProgressInsights from './components/ProgressInsights'
import VisualDecorations from './components/VisualDecorations'
import { habitService } from './services/habitService'
import { habitLogService } from './services/habitLogService'
import type { Habit, HabitCreate, HabitUpdate } from './types'
import './App.css'

type ViewMode = 'habits' | 'analytics'

function App() {
  console.log('App component rendering...')
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoadingHabits, setIsLoadingHabits] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabitId, setDeletingHabitId] = useState<number | null>(null)
  const [streaks, setStreaks] = useState<Record<number, number>>({})
  const [successRates, setSuccessRates] = useState<Record<number, number>>({})
  const [viewMode, setViewMode] = useState<ViewMode>('habits')
  const [gamificationRefresh, setGamificationRefresh] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Health check removed - StatusCard is hidden

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

  const handleUpdateHabit = async (habitData: HabitCreate) => {
    if (!editingHabit) return
    
    try {
      const updateData: HabitUpdate = {
        name: habitData.name,
        frequency: habitData.frequency,
        category: habitData.category,
        start_date: habitData.start_date,
        description: habitData.description,
      }
      await habitService.update(editingHabit.id, updateData)
      setEditingHabit(null)
      setShowForm(false)
      await loadHabits()
    } catch (err) {
      throw err
    }
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingHabitId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingHabitId) return
    
    try {
      await habitService.delete(deletingHabitId)
      setShowDeleteConfirm(false)
      setDeletingHabitId(null)
      await loadHabits()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete habit')
      setShowDeleteConfirm(false)
      setDeletingHabitId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setDeletingHabitId(null)
  }

  const handleCheckIn = (habitId: number) => {
    setSelectedHabitId(habitId)
    setShowCheckIn(true)
  }

  const handleCheckInSuccess = () => {
    setShowCheckIn(false)
    setSelectedHabitId(null)
    loadHabits() // Reload to update streaks
    setGamificationRefresh((prev) => prev + 1) // Trigger gamification refresh
  }

  const handleCheckInCancel = () => {
    setShowCheckIn(false)
    setSelectedHabitId(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  const selectedHabit = selectedHabitId ? habits.find((h) => h.id === selectedHabitId) : null
  const deletingHabit = deletingHabitId ? habits.find((h) => h.id === deletingHabitId) : null

  return (
    <div className="app">
      <VisualDecorations />
      <Header />
      <main className="app-main">
        {/* <StatusCard status={healthStatus} /> */}
        {error && <div className="error-banner">{error}</div>}
        
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && deletingHabit && (
          <ConfirmDialog
            title="Delete Habit"
            message={`Are you sure you want to delete "${deletingHabit.name}"? This action cannot be undone and will also delete all associated check-ins.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            variant="danger"
          />
        )}

        {showCheckIn && selectedHabit && (
          <CheckInForm
            habitId={selectedHabit.id}
            habitName={selectedHabit.name}
            onSuccess={handleCheckInSuccess}
            onCancel={handleCheckInCancel}
          />
        )}
        
        {/* View Mode Tabs */}
        <div className="view-tabs">
          <button
            className={`tab-button ${viewMode === 'habits' ? 'active' : ''}`}
            onClick={() => setViewMode('habits')}
          >
            Habits
          </button>
          <button
            className={`tab-button ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </button>
        </div>

        {viewMode === 'habits' ? (
          <>
            <GamificationPanel refreshTrigger={gamificationRefresh} />
            <ProgressInsights />
            <MotivationalQuote />
            {showForm ? (
              <HabitForm
                onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
                onCancel={handleFormCancel}
                initialData={editingHabit ? {
                  name: editingHabit.name,
                  frequency: editingHabit.frequency,
                  category: editingHabit.category,
                  start_date: editingHabit.start_date,
                  description: editingHabit.description,
                } : undefined}
                isEditMode={!!editingHabit}
              />
            ) : (
              <>
                <div className="actions-bar">
                  <button className="btn-primary" onClick={() => setShowForm(true)}>
                    + Create New Habit
                  </button>
                </div>
                <HabitSuggestions
                  onSuggestionSelect={async () => {
                    await loadHabits()
                  }}
                />
                <HabitList
                  habits={habits}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditHabit}
                  onCheckIn={handleCheckIn}
                  isLoading={isLoadingHabits}
                  streaks={streaks}
                  successRates={successRates}
                />
              </>
            )}
          </>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  )
}

export default App
