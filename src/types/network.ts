export interface VC {
  id: string
  name: string
  type: 'vc'
  investments: number
}

export interface Startup {
  id: string
  name: string
  type: 'startup'
  fundingAmount: number
  founded: number
  category: string
}

export interface Founder {
  id: string
  name: string
  type: 'founder'
  companies: number
}

export interface Connection {
  source: string
  target: string
  value: number
  type: 'investment' | 'founded'
}

export type NetworkNode = VC | Startup | Founder

export interface NetworkData {
  nodes: NetworkNode[]
  links: Connection[]
}
