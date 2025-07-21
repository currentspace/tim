import { useState } from 'react'
import './App.css'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'
import TariffRateTimeline from './components/TariffRateTimeline'
import NotificationSettings from './components/NotificationSettings'
import CountryTariffTimeline from './components/CountryTariffTimeline'
import StartupUniverse from './components/StartupUniverse'

export type ViewType = 
  | 'anticipated-tariff'
  | 'country-exposure' 
  | 'company-timeline'
  | 'country-timeline'
  | 'startup-universe'
  | 'notifications'

function App() {
  // Default to the anticipated tariff impact view
  const [currentView, setCurrentView] = useState<ViewType>('anticipated-tariff')

  const renderView = () => {
    switch (currentView) {
      case 'anticipated-tariff':
        return <AnticipatedTariffImpact />
      case 'country-exposure':
        return <CountryExposure />
      case 'company-timeline':
        return <TariffRateTimeline />
      case 'country-timeline':
        return <CountryTariffTimeline />
      case 'startup-universe':
        return <StartupUniverse />
      case 'notifications':
        return <NotificationSettings />
      default:
        return <AnticipatedTariffImpact />
    }
  }

  return (
    <div className="app-no-sidebar">
      {renderView()}
    </div>
  )
}

export default App