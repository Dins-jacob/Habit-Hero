import { useEffect, useState } from 'react'
import { gamificationService } from '../services/gamificationService'
import type { Badge, GamificationStats } from '../services/gamificationService'
import BadgeInfo from './BadgeInfo'
import './GamificationPanel.css'

interface GamificationPanelProps {
  refreshTrigger?: number // Trigger refresh when this changes
}

export default function GamificationPanel({ refreshTrigger }: GamificationPanelProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingBadges, setIsCheckingBadges] = useState(false)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [badgeMessage, setBadgeMessage] = useState<string | null>(null)
  const [showBadgeInfo, setShowBadgeInfo] = useState(false)

  useEffect(() => {
    loadStats()
  }, [refreshTrigger])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const data = await gamificationService.getStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckBadges = async () => {
    setIsCheckingBadges(true)
    setBadgeMessage(null)
    try {
      const result = await gamificationService.checkBadges()
      setBadgeMessage(result.message)
      if (result.new_badges.length > 0) {
        setNewBadges(result.new_badges)
        setTimeout(() => {
          setNewBadges([])
          setBadgeMessage(null)
        }, 5000) // Clear after 5 seconds
        await loadStats() // Reload to show new badges
      } else {
        // Show message even if no new badges
        setTimeout(() => setBadgeMessage(null), 3000)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to check badges'
      setBadgeMessage(`Error: ${errorMsg}`)
      console.error('Failed to check badges:', err)
      setTimeout(() => setBadgeMessage(null), 5000)
    } finally {
      setIsCheckingBadges(false)
    }
  }

  if (isLoading || !stats) {
    return (
      <div className="gamification-panel">
        <div className="loading">Loading stats...</div>
      </div>
    )
  }

  const progressPercentage = (stats.xp_to_next_level / 100) * 100

  return (
    <div className="gamification-panel">
      <div className="stats-header">
        <h3>🏆 Your Progress</h3>
        <div className="header-buttons">
          <button 
            className="check-badges-btn" 
            onClick={handleCheckBadges}
            disabled={isCheckingBadges}
          >
            {isCheckingBadges ? 'Checking...' : 'Check Badges'}
          </button>
          <button 
            className="badge-criteria-btn" 
            onClick={() => setShowBadgeInfo(true)}
          >
            📋 Badge Criteria
          </button>
        </div>
      </div>

      {/* Badge Check Message */}
      {badgeMessage && (
        <div className={`badge-message ${badgeMessage.startsWith('Error') ? 'error' : 'success'}`}>
          {badgeMessage}
        </div>
      )}

      {/* XP and Level */}
      <div className="xp-section">
        <div className="level-badge">Level {stats.level}</div>
        <div className="xp-info">
          <div className="xp-amount">{stats.total_xp} XP</div>
          <div className="xp-progress">
            <div className="xp-progress-bar">
              <div
                className="xp-progress-fill"
                style={{ width: `${100 - progressPercentage}%` }}
              ></div>
            </div>
            <div className="xp-to-next">{stats.xp_to_next_level} XP to next level</div>
          </div>
        </div>
      </div>

      {/* New Badges Notification */}
      {newBadges.length > 0 && (
        <div className="new-badges-notification">
          <h4>🎉 New Badges Earned!</h4>
          {newBadges.map((badge) => (
            <div key={badge.id} className="new-badge-item">
              <span className="badge-icon">🏅</span>
              <div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-desc">{badge.description}</div>
                <div className="badge-xp">+{badge.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badges Grid */}
      {stats.badges.length > 0 && (
        <div className="badges-section">
          <h4>Badges Earned ({stats.badge_count})</h4>
          <div className="badges-grid">
            {stats.badges.map((badge) => (
              <div key={badge.id} className="badge-card">
                <div className="badge-icon-large">🏅</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-desc">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.badges.length === 0 && (
        <div className="no-badges">
          <p>No badges yet. Keep checking in to earn your first badge! 🎯</p>
        </div>
      )}

      {/* Badge Criteria Modal */}
      {showBadgeInfo && (
        <BadgeInfo 
          earnedBadgeIds={stats.badges.map((b) => b.id)} 
          onClose={() => setShowBadgeInfo(false)}
        />
      )}
    </div>
  )
}
