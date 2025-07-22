import { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
  showBackButton?: boolean
  currentView?: string
  badge?: 'ANTICIPATED' | 'TIMELINE' | 'EXPOSURE'
  toggleOptions?: {
    left: string
    right: string
    onToggle: (value: 'left' | 'right') => void
    current: 'left' | 'right'
  }
}

function Layout({ children, showBackButton, currentView, badge, toggleOptions }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          {showBackButton && (
            <Link to="/" className="back-button">
              ← Back to Tariff View
            </Link>
          )}
          {toggleOptions && (
            <div className="toggle-container">
              <span className={toggleOptions.current === 'left' ? 'active' : ''}>
                {toggleOptions.left}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={toggleOptions.current === 'right'}
                  onChange={(e) => {
                    toggleOptions.onToggle(e.target.checked ? 'right' : 'left')
                  }}
                />
                <span className="slider"></span>
              </label>
              <span className={toggleOptions.current === 'right' ? 'active' : ''}>
                {toggleOptions.right}
              </span>
            </div>
          )}
        </div>

        <div className="header-center">
          {currentView && <h1>{currentView}</h1>}
          {badge && <span className={`badge badge-${badge.toLowerCase()}`}>{badge}</span>}
        </div>

        <div className="header-right">
          <div className="company-branding">
            <span className="company-name">Staples Technology Solutions</span>
            <span className="dashboard-label">TIM Dashboard</span>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  )
}

export default Layout
