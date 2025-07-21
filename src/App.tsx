import { useState } from 'react'
import './App.css'
import StartupUniverse from './components/StartupUniverse'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'

type ViewType = 'startup' | 'tariff' | 'exposure'

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
      </div>
      {currentView === 'startup' ? (
        <StartupUniverse />
      ) : currentView === 'tariff' ? (
        <AnticipatedTariffImpact />
      ) : (
        <CountryExposure />
      )}
    </>
  )
}

export default App
