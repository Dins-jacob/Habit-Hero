import { useEffect, useState } from 'react'
import './Header.css'

export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <header 
      className="app-header"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      {/* Gradient overlay that follows mouse */}
      <div className={`gradient-overlay ${isHovered ? 'active' : ''}`}></div>

      {/* Main content */}
      <div className="header-content">
        <h1 className="header-title">
          <span className="title-word word-1">Habit</span>
          <span className="title-word word-2">Hero</span>
        </h1>
        <p className="subtitle">
          <span className="subtitle-text">Build better routines and stay consistent</span>
        </p>
        <div className="header-decoration">
          <div className="decoration-line line-1"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-line line-2"></div>
        </div>
      </div>
    </header>
  )
}
