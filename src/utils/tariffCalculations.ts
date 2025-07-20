import { TechCompany, TariffSchedule, QuarterlyImpact } from '../types/tariff'

export function getQuarterFromDate(date: string): string {
  const d = new Date(date)
  const quarter = Math.floor(d.getMonth() / 3) + 1
  const year = d.getFullYear()
  return `Q${quarter.toString()} ${year.toString()}`
}

export function getActiveTariffForDate(
  date: Date,
  tariffSchedules: TariffSchedule[]
): TariffSchedule | null {
  // Sort schedules by date
  const sorted = [...tariffSchedules].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Find the most recent schedule before or on the given date
  let activeTariff: TariffSchedule | null = null
  for (const schedule of sorted) {
    if (new Date(schedule.date) <= date && schedule.status !== 'blocked') {
      activeTariff = schedule
    }
  }

  return activeTariff
}

export function calculateCompanyImpact(
  company: TechCompany,
  tariffSchedule: TariffSchedule | null,
  quarter: string
): QuarterlyImpact {
  const quarterlyRevenue = company.revenue / 4 // Simplified: assume equal quarters

  if (!tariffSchedule) {
    return {
      quarter,
      company: company.name,
      baseRevenue: quarterlyRevenue,
      tariffImpact: 0,
      netRevenue: quarterlyRevenue,
      impactByCountry: []
    }
  }

  const impactByCountry = Object.entries(company.revenueByCountry).map(
    ([country, percentage]) => {
      const countryRevenue = (quarterlyRevenue * percentage) / 100
      const tariffRate = tariffSchedule.rates[country] || 0
      const impact = (countryRevenue * tariffRate) / 100

      return {
        country,
        revenue: countryRevenue,
        tariffRate,
        impact
      }
    }
  )

  const totalImpact = impactByCountry.reduce((sum, c) => sum + c.impact, 0)

  return {
    quarter,
    company: company.name,
    baseRevenue: quarterlyRevenue,
    tariffImpact: totalImpact,
    netRevenue: quarterlyRevenue - totalImpact,
    impactByCountry
  }
}

export function calculateAllCompaniesImpact(
  companies: TechCompany[],
  date: Date,
  tariffSchedules: TariffSchedule[]
): QuarterlyImpact[] {
  const activeTariff = getActiveTariffForDate(date, tariffSchedules)
  const quarter = getQuarterFromDate(date.toISOString())

  return companies.map(company =>
    calculateCompanyImpact(company, activeTariff, quarter)
  )
}

export function getDateRange(schedules: TariffSchedule[]): {
  start: Date
  end: Date
} {
  const dates = schedules.map(s => new Date(s.date))
  return {
    start: new Date(Math.min(...dates.map(d => d.getTime()))),
    end: new Date(Math.max(...dates.map(d => d.getTime())))
  }
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000).toFixed(0)}B`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`
  } else {
    return `$${value.toFixed(0)}M`
  }
}

export function getImpactColor(impactPercentage: number): string {
  if (impactPercentage === 0) return '#82ca9d' // Green
  if (impactPercentage < 5) return '#FFA500' // Orange
  if (impactPercentage < 10) return '#FF6347' // Tomato
  if (impactPercentage < 15) return '#DC143C' // Crimson
  return '#8B0000' // Dark Red
}