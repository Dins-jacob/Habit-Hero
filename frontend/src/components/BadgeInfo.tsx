import './BadgeInfo.css'

interface BadgeInfo {
  id: string
  name: string
  description: string
  criteria: string
  xp: number
}

const ALL_BADGES: BadgeInfo[] = [
  {
    id: 'first_habit',
    name: 'Getting Started',
    description: 'Created your first habit',
    criteria: 'Create 1 habit',
    xp: 10,
  },
  {
    id: 'checkin_10',
    name: 'Consistent',
    description: '10 check-ins',
    criteria: 'Complete 10 check-ins',
    xp: 15,
  },
  {
    id: 'checkin_50',
    name: 'Dedicated',
    description: '50 check-ins',
    criteria: 'Complete 50 check-ins',
    xp: 40,
  },
  {
    id: 'checkin_100',
    name: 'Habit Master',
    description: '100 check-ins',
    criteria: 'Complete 100 check-ins',
    xp: 75,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day streak',
    criteria: 'Maintain a 7-day streak',
    xp: 25,
  },
  {
    id: 'streak_30',
    name: 'Monthly Champion',
    description: '30-day streak',
    criteria: 'Maintain a 30-day streak',
    xp: 50,
  },
  {
    id: 'streak_100',
    name: 'Century Streak',
    description: '100-day streak',
    criteria: 'Maintain a 100-day streak',
    xp: 100,
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: '7 check-ins in 7 days',
    criteria: 'Complete 7 check-ins in one week',
    xp: 30,
  },
  {
    id: 'category_master',
    name: 'Category Master',
    description: 'Habits in all categories',
    criteria: 'Create habits in 6 different categories',
    xp: 60,
  },
]

interface BadgeInfoProps {
  earnedBadgeIds: string[]
  onClose: () => void
}

export default function BadgeInfo({ earnedBadgeIds, onClose }: BadgeInfoProps) {
  return (
    <div className="badge-info-overlay" onClick={onClose}>
      <div className="badge-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="badge-info-header">
          <h3>📋 Badge Criteria</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="badge-info-content-wrapper">
          <p className="badge-info-intro">Complete these challenges to earn badges and XP!</p>
          <div className="badges-list">
            {ALL_BADGES.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`badge-info-item ${isEarned ? 'earned' : ''}`}
                >
                  <div className="badge-item-header">
                    <span className="badge-icon">{isEarned ? '🏅' : '🔒'}</span>
                    <div className="badge-info-content">
                      <div className="badge-info-name">
                        {badge.name}
                        {isEarned && <span className="earned-badge"> ✓ Earned</span>}
                      </div>
                      <div className="badge-info-desc">{badge.description}</div>
                      <div className="badge-info-criteria">
                        <strong>Criteria:</strong> {badge.criteria}
                      </div>
                      <div className="badge-info-xp">+{badge.xp} XP</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

