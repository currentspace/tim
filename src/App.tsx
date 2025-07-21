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
      case '/notifications':
        return 'NOTIFICATIONS'
      default:
        return 'ANTICIPATED'
    }
  }

  // Determine left section content based on current view
  const getLeftSection = () => {
    // For country exposure, show back button
    if (location.pathname === '/country-exposure') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className="back-button">
            ← Back to Tariff View
          </Link>
          <div className="toggle-group">
            <span className="toggle-label">Percentage</span>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label" style={{ marginLeft: '0.5rem' }}>
              Dollar Volume
            </span>
          </div>
        </div>
      )
    }

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
    const toggleConfig =
      location.pathname === '/' ? { label: 'Dollar Volume' } : { label: 'Percentage' }

    return (
      <div className="toggle-group">
        <span className="toggle-label">{toggleConfig.label}</span>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="toggle-slider"></span>
        </label>
        {location.pathname === '/' && (
          <span className="toggle-label" style={{ marginLeft: '0.5rem' }}>
            Tariff Exposure & Rate
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="app-no-sidebar">
      <TopNavigation
        leftSection={getLeftSection()}
        centerSection={
          <div className="navigation-center">
            <nav className="main-navigation">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Anticipated Tariff
              </Link>
              <Link
                to="/country-exposure"
                className={`nav-link ${location.pathname === '/country-exposure' ? 'active' : ''}`}
              >
                Country Exposure
              </Link>
              <Link
                to="/company-timeline"
                className={`nav-link ${location.pathname === '/company-timeline' ? 'active' : ''}`}
              >
                Company Timeline
              </Link>
              <Link
                to="/country-timeline"
                className={`nav-link ${location.pathname === '/country-timeline' ? 'active' : ''}`}
              >
                Country Timeline
              </Link>
              <Link
                to="/startup-universe"
                className={`nav-link ${location.pathname === '/startup-universe' ? 'active' : ''}`}
              >
                Startup Universe
              </Link>
              <Link
                to="/notifications"
                className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}
              >
                Notifications
              </Link>
            </nav>
            <div className="tab-badge">{getViewName()}</div>
          </div>
        }
        rightSection={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {(location.pathname === '/country-timeline' ||
              location.pathname === '/company-timeline') && (
              <div className="view-toggle">
                <Link
                  to="/country-timeline"
                  className={`view-toggle-button ${location.pathname === '/country-timeline' ? 'active' : ''}`}
                >
                  Country
                </Link>
                <Link
                  to="/company-timeline"
                  className={`view-toggle-button ${location.pathname === '/company-timeline' ? 'active' : ''}`}
                >
                  Company
                </Link>
              </div>
            )}
            <div className="company-branding">
              <h1 className="company-name">Staples Technology Solutions</h1>
              <p className="company-subtitle">TIM Dashboard</p>
            </div>
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
