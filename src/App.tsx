import { Outlet, useLocation, Link } from '@tanstack/react-router'
import TopNavigation from './components/TopNavigation'
import './App.css'

function App() {
  const location = useLocation()
  
  // Determine the current view name for the badge
  const getViewName = () => {
    switch (location.pathname) {
      case '/':
        return 'ANTICIPATED'
      case '/country-exposure':
        return 'EXPOSURE'
      case '/company-timeline':
        return 'TIMELINE'
      case '/country-timeline':
        return 'TIMELINE'
      case '/startup-universe':
        return 'UNIVERSE'
      default:
        return 'ANTICIPATED'
    }
  }

  // Determine left section content based on current view
  const getLeftSection = () => {
    // For company timeline, show Timeline/Chart toggle
    if (location.pathname === '/company-timeline') {
      return (
        <div className="view-toggle">
          <button className="view-toggle-button active">Timeline</button>
          <button className="view-toggle-button">Chart</button>
        </div>
      )
    }
    
    // For most views, show the value toggle
    const toggleConfig = location.pathname === '/' || location.pathname === '/country-exposure'
      ? { label: 'Dollar Volume' }
      : { label: 'Percentage' }
    
    return (
      <div className="toggle-group">
        <span className="toggle-label">{toggleConfig.label}</span>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="toggle-slider"></span>
        </label>
      </div>
    )
  }

  return (
    <div className="app-no-sidebar">
      <TopNavigation
        leftSection={getLeftSection()}
        centerSection={
          <button 
            className="tab-badge"
            onClick={() => {
              // Simple navigation cycle through views
              const routes = ['/', '/country-exposure', '/company-timeline', '/country-timeline', '/startup-universe']
              const currentIndex = routes.indexOf(location.pathname)
              const nextIndex = (currentIndex + 1) % routes.length
              window.location.href = routes[nextIndex]
            }}
            title="Click to navigate to next view"
          >
            {getViewName()}
          </button>
        }
        rightSection={
          <div className="company-branding">
            <h1 className="company-name">Staples Technology Solutions</h1>
            <p className="company-subtitle">TIM Dashboard</p>
          </div>
        }
      />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App