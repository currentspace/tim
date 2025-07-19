import { useState, Suspense, startTransition } from 'react'
import NetworkGraphV3 from './NetworkGraphV3'
import LoadingSpinner from './LoadingSpinner'
import ErrorBoundary from './ErrorBoundary'
import { useNetworkData } from '../hooks/useNetworkData'
import { NetworkData } from '../types/network'
import './StartupUniverse.css'

// Separate component that uses the data
function NetworkVisualization({ dataPromise }: { dataPromise: Promise<NetworkData> }) {
  // In React 19, we would use: const data = use(dataPromise)
  // For now, we'll use a workaround with Suspense
  const [data, setData] = useState<NetworkData | null>(null)
  const [linkDistance, setLinkDistance] = useState(150)
  const [chargeStrength, setChargeStrength] = useState(-300)
  const [collisionRadius, setCollisionRadius] = useState(30)
  const [centerStrength, setCenterStrength] = useState(0.05)

  // Throw promise for Suspense (React 19 pattern)
  if (!data) {
    throw dataPromise.then(setData)
  }

  // Use startTransition to avoid replacing visible content with loading state
  const updateParam = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setter(Number(e.target.value))
    })
  }

  return (
    <>
      <div className="controls">
        <div className="control-group">
          <label>
            Link Distance: {linkDistance}
            <input
              type="range"
              min="50"
              max="300"
              value={linkDistance}
              onChange={updateParam(setLinkDistance)}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Force Strength: {chargeStrength}
            <input
              type="range"
              min="-500"
              max="-100"
              value={chargeStrength}
              onChange={updateParam(setChargeStrength)}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Collision Radius: {collisionRadius}
            <input
              type="range"
              min="10"
              max="50"
              value={collisionRadius}
              onChange={updateParam(setCollisionRadius)}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Center Gravity: {centerStrength.toFixed(2)}
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={centerStrength}
              onChange={updateParam(setCenterStrength)}
            />
          </label>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot vc"></span>
          <span>Venture Capitalists</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot startup"></span>
          <span>Startups</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot founder"></span>
          <span>Founders</span>
        </div>
      </div>

      <NetworkGraphV3
        data={data}
        linkDistance={linkDistance}
        chargeStrength={chargeStrength}
        collisionRadius={collisionRadius}
        centerStrength={centerStrength}
      />
    </>
  )
}

function StartupUniverseV3() {
  // Use the custom hook to get a stable promise
  const dataPromise = useNetworkData()

  return (
    <div className="startup-universe">
      <h2>The Startup Universe</h2>
      <p className="subtitle">A Visual Guide to Startups, Founders & Venture Capitalists</p>
      
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <NetworkVisualization dataPromise={dataPromise} />
        </Suspense>
      </ErrorBoundary>

      <div className="info-panel">
        <p>Hover over nodes to see connections. Drag nodes to reposition them. Zoom and pan to explore.</p>
        <p>Node size represents: VCs (number of investments), Startups (funding amount), Founders (companies founded)</p>
      </div>
    </div>
  )
}

export default StartupUniverseV3