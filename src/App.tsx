import { useState } from 'react'
import './App.css'
import StartupUniverse from './components/StartupUniverse'

function App() {
  const [showStartupUniverse, setShowStartupUniverse] = useState(true)

  return (
    <>
      <h1>Charles - Data Visualization App</h1>
      <div className="nav-buttons">
        <button 
          className={showStartupUniverse ? 'active' : ''}
          onClick={() => setShowStartupUniverse(true)}
        >
          Startup Universe
        </button>
        <button 
          className={!showStartupUniverse ? 'active' : ''}
          onClick={() => setShowStartupUniverse(false)}
        >
          Sample Charts
        </button>
      </div>
      {showStartupUniverse ? (
        <StartupUniverse />
      ) : (
        <div className="coming-soon">
          <p>More visualizations coming soon!</p>
        </div>
      )}
    </>
  )
}

export default App