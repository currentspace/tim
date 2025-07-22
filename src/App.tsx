import { Outlet, useLocation, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import TopNavigation from './components/TopNavigation'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { ROUTE_CONFIG } from './routes'
import './App.css'

function App() {
  const location = useLocation()

  // Find current route info from config
  const currentRoute =
    ROUTE_CONFIG.find((route) => route.path === location.pathname) ?? ROUTE_CONFIG[0]

  return (
    <div className="app-no-sidebar">
      <TopNavigation
        leftSection={
          <div className="current-view-header">
            <h3>Current View</h3>
            <p className="view-subtitle">{currentRoute.view}</p>
          </div>
        }
        centerSection={
          <div className="navigation-center">
            <nav className="main-navigation">
              {ROUTE_CONFIG.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="tab-badge">{currentRoute.view}</div>
          </div>
        }
        rightSection={
          <div className="company-branding">
            <h1 className="company-name">Staples Technology Solutions</h1>
            <p className="company-subtitle">TIM Dashboard</p>
          </div>
        }
      />
      <main className="app-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
