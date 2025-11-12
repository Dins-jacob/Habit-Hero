import { useState, useEffect } from 'react'
import Header from './components/Header'
import StatusCard from './components/StatusCard'
import WelcomeCard from './components/WelcomeCard'
import { apiService } from './services/api'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState<'ok' | 'error' | 'checking...'>('checking...')

  useEffect(() => {
    apiService
      .getHealth()
      .then((data) => setHealthStatus(data.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setHealthStatus('error'))
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <StatusCard status={healthStatus} />
        <WelcomeCard />
      </main>
    </div>
  )
}

export default App
