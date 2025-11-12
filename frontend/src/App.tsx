import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthStatus(data.status))
      .catch(() => setHealthStatus('error'))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Habit Hero</h1>
        <p className="subtitle">Build better routines and stay consistent</p>
      </header>
      <main className="app-main">
        <div className="status-card">
          <h2>System Status</h2>
          <p className="status-indicator">
            Backend API: <span className={healthStatus === 'ok' ? 'status-ok' : 'status-error'}>{healthStatus}</span>
          </p>
        </div>
        <div className="welcome-card">
          <h2>Welcome to Habit Hero</h2>
          <p>Your journey to better habits starts here. Track your progress, build consistency, and achieve your goals.</p>
        </div>
      </main>
    </div>
  )
}

export default App

