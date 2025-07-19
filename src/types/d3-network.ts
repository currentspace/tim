import { Connection, VC, Startup, Founder } from './network'

// D3 simulation node types
export interface SimulationVC extends VC {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

export interface SimulationStartup extends Startup {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

export interface SimulationFounder extends Founder {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

export type SimulationNode = SimulationVC | SimulationStartup | SimulationFounder

// D3 simulation link type
export interface SimulationLink extends Omit<Connection, 'source' | 'target'> {
  source: SimulationNode | string
  target: SimulationNode | string
}
