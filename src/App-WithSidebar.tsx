import { useState } from 'react'
import './App.css'
import Navigation, { ViewType } from './components/Navigation'
import StartupUniverse from './components/StartupUniverse'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'
import TariffRateTimeline from './components/TariffRateTimeline'
import NotificationSettings from './components/NotificationSettings'
import CountryTariffTimeline from './components/CountryTariffTimeline'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('tariff')
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'startup':
        return <StartupUniverse />
      case 'tariff':
        return <AnticipatedTariffImpact />
      case 'timeline':
        return <TariffRateTimeline />
      case 'notifications':
        return <NotificationSettings />
      case 'country-timeline':
        return <CountryTariffTimeline />
      case 'exposure':
        return <CountryExposure />
      default:
        return <AnticipatedTariffImpact />
    }
  }

  return (
    <div className="app">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isNavigationOpen}
      >
        <span className="hamburger-icon"></span>
      </button>

      <div className={`navigation-wrapper ${isNavigationOpen ? 'open' : ''}`}>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      </div>

      <main className="main-content">
        <div className="view-container">{renderView()}</div>
      </main>

      {isNavigationOpen && (
        <div
          className="navigation-overlay"
          onClick={() => setIsNavigationOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default App
