export interface TechCompany {
  id: string
  name: string
  revenue: number // in millions USD
  headquarters: string
  primaryManufacturing: string[]
  revenueByCountry: Record<string, number> // percentage
  category: 'hardware' | 'software' | 'semiconductor' | 'services'
}

export interface TariffSchedule {
  date: string
  description: string
  rates: Record<string, number> // percentage
  status: 'proposed' | 'active' | 'paused' | 'blocked'
}

export interface QuarterlyImpact {
  quarter: string // e.g., "Q1 2025"
  company: string
  baseRevenue: number
  tariffImpact: number
  netRevenue: number
  impactByCountry: {
    country: string
    revenue: number
    tariffRate: number
    impact: number
  }[]
}

export interface TariffScenario {
  name: string
  description: string
  timeline: TariffSchedule[]
}