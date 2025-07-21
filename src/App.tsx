import { useState } from 'react'
import './App.css'
import StartupUniverse from './components/StartupUniverse'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'
import TariffRateTimeline from './components/TariffRateTimeline'
import NotificationSettings from './components/NotificationSettings'

type ViewType = 'startup' | 'tariff' | 'exposure' | 'timeline' | 'notifications'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('tariff')

  return (
    <>
      <h1>Data Visualization App</h1>
      <div className="nav-buttons">
        <button
          className={currentView === 'startup' ? 'active' : ''}
          onClick={() => {
            setCurrentView('startup')
          }}
        >
          Startup Universe
        </button>
        <button
          className={currentView === 'tariff' ? 'active' : ''}
          onClick={() => {
            setCurrentView('tariff')
          }}
        >
          Tariff Impact
        </button>
        <button
          className={currentView === 'exposure' ? 'active' : ''}
          onClick={() => {
            setCurrentView('exposure')
          }}
        >
          Country Exposure
        </button>
        <button
          className={currentView === 'timeline' ? 'active' : ''}
          onClick={() => {
            setCurrentView('timeline')
          }}
        >
          Tariff Timeline
        </button>
        <button
          className={currentView === 'notifications' ? 'active' : ''}
          onClick={() => {
            setCurrentView('notifications')
          }}
        >
          Notifications
        </button>
      </div>
      {currentView === 'startup' ? (
        <StartupUniverse />
      ) : currentView === 'tariff' ? (
        <AnticipatedTariffImpact />
      ) : currentView === 'timeline' ? (
        <TariffRateTimeline />
      ) : currentView === 'notifications' ? (
        <NotificationSettings />
      ) : (
        <CountryExposure />
      )}
    </>
  )
}

export default App
