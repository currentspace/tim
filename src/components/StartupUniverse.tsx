import { useState, Suspense, startTransition } from 'react'
import NetworkGraph from './NetworkGraph'
import LoadingSpinner from './LoadingSpinner'
import ErrorBoundary from './ErrorBoundary'
import { NetworkData } from '../types/network'
import { setResetFunction } from '../utils/testUtils'
import './StartupUniverse.css'

// Create a resource for Suspense
interface Resource<T> {
  read(): T
}

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T
  let error: unknown

  const suspender = promise.then(
    (data) => {
      status = 'success'
      result = data
    },
    (err: unknown) => {
      status = 'error'
      error = err
    },
  )

  return {
    read() {
      if (status === 'pending') {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw suspender
      } else if (status === 'error') {
        throw new Error(String(error))
      }
      return result
    },
  }
}

// Cache for the resource
let networkDataResource: Resource<NetworkData> | null = null

// Set the reset function for testing
setResetFunction(() => {
  networkDataResource = null
})

function getNetworkDataResource(): Resource<NetworkData> {
  if (!networkDataResource) {
    // Import the data provider
    const dataPromise = import('../data/networkDataProvider').then((module) =>
      module.fetchNetworkData(),
    )
    networkDataResource = createResource(dataPromise)
  }
  return networkDataResource
}

// Separate component that uses the data
function NetworkVisualization() {
  const resource = getNetworkDataResource()
  const data = resource.read() // This will suspend if data is not ready

  const [linkDistance, setLinkDistance] = useState(150)
  const [chargeStrength, setChargeStrength] = useState(-300)
  const [collisionRadius, setCollisionRadius] = useState(30)
  const [centerStrength, setCenterStrength] = useState(0.05)

  // Use startTransition to avoid replacing visible content with loading state
  const updateParam =
    (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

      <NetworkGraph
        data={data}
        linkDistance={linkDistance}
        chargeStrength={chargeStrength}
        collisionRadius={collisionRadius}
        centerStrength={centerStrength}
      />
    </>
  )
}

function StartupUniverse() {
  return (
    <div className="startup-universe">
      <h2>The Startup Universe</h2>
      <p className="subtitle">A Visual Guide to Startups, Founders & Venture Capitalists</p>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <NetworkVisualization />
        </Suspense>
      </ErrorBoundary>

      <div className="info-panel">
        <p>
          Hover over nodes to see connections. Drag nodes to reposition them. Zoom and pan to
          explore.
        </p>
        <p>
          Node size represents: VCs (number of investments), Startups (funding amount), Founders
          (companies founded)
        </p>
      </div>
    </div>
  )
}

export default StartupUniverse
