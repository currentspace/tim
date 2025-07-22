import { Outlet, useLocation, Link } from '@tanstack/react-router'
import { startTransition, useOptimistic, useDeferredValue, Suspense } from 'react'
import TopNavigation from './components/TopNavigation'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// Custom Link component with concurrent features
function OptimisticLink({
  to,
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Link>) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the router handle the navigation, but wrap state updates in transition
    startTransition(() => {
      // Call original onClick if provided
      onClick?.(e)
    })
  }

  return (
    <Link to={to} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

function App() {
  const location = useLocation()

  // Use deferred value for smoother transitions during navigation
  const deferredPathname = useDeferredValue(location.pathname)

  // Optimistic state for navigation feedback
  const [optimisticPath, setOptimisticPath] = useOptimistic(
    location.pathname,
    (_, newPath: string) => newPath,
  )

  // Determine the current view name for the badge
  const getViewName = () => {
    switch (optimisticPath) {
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
    // For country exposure, show back button and toggle
    if (deferredPathname === '/country-exposure') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <OptimisticLink
            to="/"
            className="back-button"
            onClick={() => {
              setOptimisticPath('/')
            }}
          >
            ← Back to Tariff View
          </OptimisticLink>
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

    // For anticipated tariff, show the value toggle
    if (deferredPathname === '/') {
      return (
        <div className="toggle-group">
          <span className="toggle-label">Dollar Volume</span>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label" style={{ marginLeft: '0.5rem' }}>
            Tariff Exposure & Rate
          </span>
        </div>
      )
    }

    // For other views, return null to show nothing in the left section
    return null
  }

  return (
    <div className="app-no-sidebar">
      <TopNavigation
        leftSection={getLeftSection()}
        centerSection={
          <div className="navigation-center">
            <nav className="main-navigation">
              <OptimisticLink
                to="/"
                className={`nav-link ${optimisticPath === '/' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/')
                }}
              >
                Anticipated Tariff Impact
              </OptimisticLink>
              <OptimisticLink
                to="/country-exposure"
                className={`nav-link ${optimisticPath === '/country-exposure' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/country-exposure')
                }}
              >
                Country Exposure
              </OptimisticLink>
              <OptimisticLink
                to="/company-timeline"
                className={`nav-link ${optimisticPath === '/company-timeline' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/company-timeline')
                }}
              >
                Company Timeline
              </OptimisticLink>
              <OptimisticLink
                to="/country-timeline"
                className={`nav-link ${optimisticPath === '/country-timeline' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/country-timeline')
                }}
              >
                Country Timeline
              </OptimisticLink>
              <OptimisticLink
                to="/startup-universe"
                className={`nav-link ${optimisticPath === '/startup-universe' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/startup-universe')
                }}
              >
                Startup Universe
              </OptimisticLink>
              <OptimisticLink
                to="/notifications"
                className={`nav-link ${optimisticPath === '/notifications' ? 'active' : ''}`}
                onClick={() => {
                  setOptimisticPath('/notifications')
                }}
              >
                Notifications
              </OptimisticLink>
            </nav>
            <div className="tab-badge">{getViewName()}</div>
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
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default App
