import { useState } from 'react'
import NetworkGraph from './NetworkGraph'
import { networkData } from '../data/networkData'
import './StartupUniverse.css'

function StartupUniverse() {
  const [linkDistance, setLinkDistance] = useState(150)
  const [chargeStrength, setChargeStrength] = useState(-300)
  const [collisionRadius, setCollisionRadius] = useState(30)
  const [centerStrength, setCenterStrength] = useState(0.05)

  return (
    <div className="startup-universe">
      <h2>The Startup Universe</h2>
      <p className="subtitle">A Visual Guide to Startups, Founders & Venture Capitalists</p>
      
      <div className="controls">
        <div className="control-group">
          <label>
            Link Distance: {linkDistance}
            <input
              type="range"
              min="50"
              max="300"
              value={linkDistance}
              onChange={(e) => setLinkDistance(Number(e.target.value))}
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
              onChange={(e) => setChargeStrength(Number(e.target.value))}
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
              onChange={(e) => setCollisionRadius(Number(e.target.value))}
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
              onChange={(e) => setCenterStrength(Number(e.target.value))}
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
        data={networkData}
        linkDistance={linkDistance}
        chargeStrength={chargeStrength}
        collisionRadius={collisionRadius}
        centerStrength={centerStrength}
      />

      <div className="info-panel">
        <p>Hover over nodes to see connections. Drag nodes to reposition them. Zoom and pan to explore.</p>
        <p>Node size represents: VCs (number of investments), Startups (funding amount), Founders (companies founded)</p>
      </div>
    </div>
  )
}

export default StartupUniverse