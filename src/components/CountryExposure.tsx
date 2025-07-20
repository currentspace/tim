import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { getActiveTariffForDate, formatCurrency } from '../utils/tariffCalculations'
import './CountryExposure.css'

// Color palette for countries
const COUNTRY_COLORS: Record<string, string> = {
  China: '#ff4d4d',
  Vietnam: '#ff8c1a',
  Mexico: '#ffcc00',
  EU: '#4dff4d',
  Taiwan: '#1affe6',
  Japan: '#1a75ff',
  Malaysia: '#6666ff',
  'South Korea': '#b366ff',
  Philippines: '#ff66ff',
  Thailand: '#ff66b3',
  USA: '#4d94ff',
  India: '#ff9933',
  Israel: '#0066cc',
  Ireland: '#009900',
  Germany: '#ffcc00',
  Singapore: '#ff0000'
}


function CountryExposure() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState(new Date('2025-09-01'))
  
  const activeTariff = useMemo(
    () => getActiveTariffForDate(selectedDate, tariffTimeline),
    [selectedDate]
  )

  const exposureData = useMemo(() => {
    const companies = selectedCompany === 'all' 
      ? techCompanies 
      : techCompanies.filter(c => c.id === selectedCompany)
    
    const countryRevenue: Record<string, { revenue: number; companies: Set<string> }> = {}
    let totalRevenue = 0
    
    companies.forEach(company => {
      const quarterlyRevenue = company.revenue / 4
      totalRevenue += quarterlyRevenue
      
      Object.entries(company.revenueByCountry).forEach(([country, percentage]) => {
        const revenue = (quarterlyRevenue * percentage) / 100
        
        if (!(country in countryRevenue)) {
          countryRevenue[country] = { revenue: 0, companies: new Set() }
        }
        
        countryRevenue[country].revenue += revenue
        countryRevenue[country].companies.add(company.name)
      })
    })
    
    return Object.entries(countryRevenue)
      .map(([country, data]) => ({
        country,
        totalRevenue: data.revenue,
        percentage: (data.revenue / totalRevenue) * 100,
        affectedCompanies: Array.from(data.companies),
        currentTariff: activeTariff?.rates[country] ?? 0
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [selectedCompany, activeTariff])

  const pieData = exposureData.map(d => ({
    name: d.country,
    value: d.totalRevenue,
    percentage: d.percentage,
    tariff: d.currentTariff
  }))

  const totalExposure = exposureData.reduce(
    (sum, d) => sum + (d.totalRevenue * d.currentTariff) / 100,
    0
  )

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; value: number; percentage: number; tariff: number } }[] }) => {
    if (active && payload?.[0]) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="country-name">{data.name}</p>
          <p className="revenue">Revenue: {formatCurrency(data.value)}</p>
          <p className="percentage">Share: {data.percentage.toFixed(1)}%</p>
          <p className="tariff" style={{ color: data.tariff > 0 ? '#ff4d4d' : '#82ca9d' }}>
            Tariff: {data.tariff}%
          </p>
        </div>
      )
    }
    return null
  }

  const dateRange = useMemo(() => {
    const dates = tariffTimeline.map(s => new Date(s.date))
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    }
  }, [])

  return (
    <div className="country-exposure">
      <div className="header">
        <h1>Manufacturing Country Exposure</h1>
        <div className="subtitle">Revenue Distribution by Manufacturing Location</div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="company-select">Company</label>
          <select
            id="company-select"
            value={selectedCompany}
            onChange={(e) => { setSelectedCompany(e.target.value) }}
            className="company-select"
          >
            <option value="all">All Companies</option>
            {techCompanies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="date-slider">Date</label>
          <input
            id="date-slider"
            type="date"
            min={dateRange.start.toISOString().split('T')[0]}
            max={dateRange.end.toISOString().split('T')[0]}
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => { setSelectedDate(new Date(e.target.value)) }}
            className="date-slider"
          />
        </div>
      </div>

      <div className="exposure-summary">
        <div className="summary-card">
          <h3>Total Quarterly Revenue</h3>
          <div className="summary-value">
            {formatCurrency(exposureData.reduce((sum, d) => sum + d.totalRevenue, 0))}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Tariff Exposure</h3>
          <div className="summary-value" style={{ color: '#ff4d4d' }}>
            {formatCurrency(totalExposure)}
          </div>
        </div>
        <div className="summary-card">
          <h3>Countries Affected</h3>
          <div className="summary-value">
            {exposureData.filter(d => d.currentTariff > 0).length}
          </div>
        </div>
      </div>

      <div className="visualization-container">
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const data = entry as unknown as { name: string; percentage: number }
                  return data.percentage > 2 ? `${data.name} ${data.percentage.toFixed(1)}%` : ''
                }}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index.toString()}`} 
                    fill={COUNTRY_COLORS[entry.name] || '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="country-details">
          <h2>Country Breakdown</h2>
          <div className="country-table">
            <div className="table-header">
              <span>Country</span>
              <span>Revenue</span>
              <span>Share</span>
              <span>Tariff</span>
              <span>Impact</span>
            </div>
            {exposureData.map((country) => {
              const impact = (country.totalRevenue * country.currentTariff) / 100
              return (
                <div key={country.country} className="table-row">
                  <div className="country-cell">
                    <div 
                      className="color-indicator" 
                      style={{ backgroundColor: COUNTRY_COLORS[country.country] || '#8884d8' }}
                    />
                    <span>{country.country}</span>
                  </div>
                  <span>{formatCurrency(country.totalRevenue)}</span>
                  <span>{country.percentage.toFixed(1)}%</span>
                  <span className={country.currentTariff > 0 ? 'tariff-active' : 'tariff-none'}>
                    {country.currentTariff}%
                  </span>
                  <span className="impact-value">
                    {impact > 0 ? `-${formatCurrency(impact)}` : '-'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedCompany !== 'all' && (
        <div className="company-detail">
          <h2>Manufacturing Breakdown</h2>
          <div className="manufacturing-info">
            {techCompanies
              .find(c => c.id === selectedCompany)
              ?.primaryManufacturing.map((location) => (
                <div key={location} className="manufacturing-location">
                  <div 
                    className="location-indicator"
                    style={{ backgroundColor: COUNTRY_COLORS[location] || '#8884d8' }}
                  />
                  <span>{location}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryExposure