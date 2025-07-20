import { useState, useMemo } from 'react'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import {
  calculateAllCompaniesImpact,
  formatCurrency,
  getImpactColor,
  getDateRange
} from '../utils/tariffCalculations'
import './AnticipatedTariffImpact.css'

function AnticipatedTariffImpact() {
  const dateRange = useMemo(() => getDateRange(tariffTimeline), [])
  
  // Start with current date (Sep 2025)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-09-01'))
  
  const impacts = useMemo(
    () => calculateAllCompaniesImpact(techCompanies, selectedDate, tariffTimeline),
    [selectedDate]
  )

  // Sort by impact amount
  const sortedImpacts = useMemo(
    () => [...impacts].sort((a, b) => b.tariffImpact - a.tariffImpact),
    [impacts]
  )

  // Top 5 most impacted
  const topImpacted = sortedImpacts.slice(0, 5)

  // Calculate total impact
  const totalImpact = impacts.reduce((sum, i) => sum + i.tariffImpact, 0)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }

  return (
    <div className="anticipated-tariff-impact">
      <div className="header">
        <h1>Anticipated Tariff Impact</h1>
        <div className="subtitle">Quarterly Revenue Impact on Tech Companies</div>
      </div>

      <div className="timeline-container">
        <label htmlFor="date-slider">Timeline</label>
        <input
          id="date-slider"
          type="date"
          min={dateRange.start.toISOString().split('T')[0]}
          max={dateRange.end.toISOString().split('T')[0]}
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="date-slider"
        />
        <div className="date-display">
          {selectedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      <div className="impact-summary">
        <div className="total-impact">
          <h3>Total Quarterly Impact</h3>
          <div className="impact-value" style={{ color: getImpactColor(5) }}>
            {formatCurrency(totalImpact)}
          </div>
        </div>
      </div>

      <div className="company-impacts">
        <h2>Top 5 Most Impacted Companies</h2>
        {topImpacted.map((impact, index) => {
          const company = techCompanies.find(c => c.name === impact.company)
          if (!company) return null
          const impactPercentage = (impact.tariffImpact / impact.baseRevenue) * 100
          
          return (
            <div key={company.id} className="company-card">
              <div className="company-rank">{index + 1}</div>
              <div className="company-info">
                <h3>{company.name}</h3>
                <div className="company-details">
                  <span>HQ: {company.headquarters}</span>
                  <span>Category: {company.category}</span>
                </div>
              </div>
              <div className="impact-details">
                <div className="revenue-info">
                  <div className="revenue-item">
                    <span>Base Revenue</span>
                    <span>{formatCurrency(impact.baseRevenue)}</span>
                  </div>
                  <div className="revenue-item impact">
                    <span>Tariff Impact</span>
                    <span style={{ color: getImpactColor(impactPercentage) }}>
                      -{formatCurrency(impact.tariffImpact)} ({impactPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="revenue-item net">
                    <span>Net Revenue</span>
                    <span>{formatCurrency(impact.netRevenue)}</span>
                  </div>
                </div>
                <div className="country-breakdown">
                  <h4>Impact by Manufacturing Location</h4>
                  {impact.impactByCountry
                    .filter(c => c.impact > 0)
                    .sort((a, b) => b.impact - a.impact)
                    .map(country => (
                      <div key={country.country} className="country-impact">
                        <span className="country-name">{country.country}</span>
                        <div className="impact-bar">
                          <div
                            className="impact-fill"
                            style={{
                              width: `${((country.impact / impact.tariffImpact) * 100).toFixed(1)}%`,
                              backgroundColor: getImpactColor(country.tariffRate)
                            }}
                          />
                        </div>
                        <span className="impact-amount">
                          {formatCurrency(country.impact)} ({country.tariffRate}%)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="all-companies">
        <h2>All Companies Impact</h2>
        <div className="company-list">
          {sortedImpacts.map(impact => {
            const company = techCompanies.find(c => c.name === impact.company)
            if (!company) return null
            const impactPercentage = (impact.tariffImpact / impact.baseRevenue) * 100
            
            return (
              <div key={company.id} className="company-row">
                <span className="company-name">{company.name}</span>
                <span className="company-hq">{company.headquarters}</span>
                <span className="company-revenue">{formatCurrency(impact.baseRevenue)}</span>
                <span 
                  className="company-impact"
                  style={{ color: getImpactColor(impactPercentage) }}
                >
                  -{formatCurrency(impact.tariffImpact)} ({impactPercentage.toFixed(1)}%)
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnticipatedTariffImpact