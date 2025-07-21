import { Outlet, Link } from '@tanstack/react-router'
import TopNavigation from './components/TopNavigation'
import './App.css'

function App() {
  return (
    <div className="app-no-sidebar">
      <TopNavigation
        leftSection={
          <div className="toggle-group">
            <span className="toggle-label">Company View</span>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        }
        centerSection={
          <nav className="tab-navigation">
            <Link to="/" className="tab-button" activeProps={{ className: 'active' }}>
              Anticipated Tariff
            </Link>
            <Link to="/country-exposure" className="tab-button" activeProps={{ className: 'active' }}>
              Country Exposure
            </Link>
            <Link to="/company-timeline" className="tab-button" activeProps={{ className: 'active' }}>
              Company Timeline
            </Link>
            <Link to="/country-timeline" className="tab-button" activeProps={{ className: 'active' }}>
              Country Timeline
            </Link>
            <Link to="/startup-universe" className="tab-button" activeProps={{ className: 'active' }}>
              Startup Universe
            </Link>
          </nav>
        }
        rightSection={
          <div className="company-branding">
            <h1 className="company-name">CHARLES</h1>
            <p className="company-subtitle">Tariff Impact Analysis</p>
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