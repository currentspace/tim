import { useState, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { getActiveTariffForDate, formatCurrency } from '../utils/tariffCalculations'
import './CountryExposure.css'

interface ArcData {
  country: string
  totalRevenue: number
  percentage: number
  affectedCompanies: string[]
  currentTariff: number
  startAngle: number
  endAngle: number
  midAngle: number
}

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
  Singapore: '#ff0000',
}

function CountryExposure() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>('hp') // Default to HP like in the image
  const [selectedDate, setSelectedDate] = useState(new Date('2025-01-01'))

  const activeTariff = useMemo(
    () => getActiveTariffForDate(selectedDate, tariffTimeline),
    [selectedDate],
  )

  const exposureData = useMemo(() => {
    const companies =
      selectedCompany === 'all'
        ? techCompanies
        : techCompanies.filter((c) => c.id === selectedCompany)

    const countryRevenue: Record<string, { revenue: number; companies: Set<string> }> = {}
    let totalRevenue = 0

    companies.forEach((company) => {
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
        currentTariff: activeTariff?.rates[country] ?? 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [selectedCompany, activeTariff])

  // Create D3 visualization
  useEffect(() => {
    if (!svgRef.current || exposureData.length === 0) return

    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2
    const innerRadius = 80
    const outerRadius = 200

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width.toString()} ${height.toString()}`)

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX.toString()},${centerY.toString()})`)

    // Create concentric circles (like in the image)
    const circles = [1, 0.8, 0.6, 0.4, 0.2]
    circles.forEach((scale) => {
      g.append('circle')
        .attr('r', outerRadius * scale)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
    })

    // Calculate angles for each country
    const totalPercentage = d3.sum(exposureData, (d) => d.percentage)
    let currentAngle = -Math.PI / 2 // Start at top

    // Create arcs for each country
    const arcs: ArcData[] = exposureData.map((d) => {
      const angleSize = (d.percentage / totalPercentage) * 2 * Math.PI
      const startAngle = currentAngle
      const endAngle = currentAngle + angleSize
      currentAngle = endAngle

      return {
        ...d,
        startAngle,
        endAngle,
        midAngle: (startAngle + endAngle) / 2,
      }
    })

    // Create arc generator
    const arcGenerator = d3
      .arc<ArcData>()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius(innerRadius)
      .outerRadius((d) => {
        // Scale radius based on percentage
        return innerRadius + (outerRadius - innerRadius) * (d.percentage / 30)
      })

    // Add colored arcs
    g.selectAll('.country-arc')
      .data(arcs)
      .enter()
      .append('path')
      .attr('class', 'country-arc')
      .attr('d', arcGenerator)
      .attr('fill', (d) => COUNTRY_COLORS[d.country] || '#888888')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 1)

        // Show tooltip
        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'd3-tooltip')
          .style('opacity', 0)
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '10px')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')

        tooltip.transition().duration(200).style('opacity', 0.9)

        tooltip
          .html(
            `
          <strong class="d3-title">${d.country}</strong><br/>
          <span class="d3-value">Revenue: ${formatCurrency(d.totalRevenue)}</span><br/>
          <span class="d3-value">Share: ${d.percentage.toFixed(1).toString()}%</span><br/>
          <span class="d3-value">Tariff: ${d.currentTariff.toString()}%</span>
        `,
          )
          .style('left', `${((event as MouseEvent).pageX + 10).toString()}px`)
          .style('top', `${((event as MouseEvent).pageY - 28).toString()}px`)
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', 0.8)
        d3.selectAll('.d3-tooltip').remove()
      })

    // Add lines and labels
    const labelRadius = outerRadius + 50

    arcs.forEach((d) => {
      // Calculate label position
      const labelX = Math.cos(d.midAngle) * labelRadius
      const labelY = Math.sin(d.midAngle) * labelRadius

      // Draw line from arc to label
      g.append('line')
        .attr('x1', Math.cos(d.midAngle) * outerRadius)
        .attr('y1', Math.sin(d.midAngle) * outerRadius)
        .attr('x2', labelX)
        .attr('y2', labelY)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .style('opacity', 0.6)

      // Add country label with percentage
      const textAnchor = Math.cos(d.midAngle) > 0 ? 'start' : 'end'
      const labelGroup = g
        .append('g')
        .attr('transform', `translate(${labelX.toString()},${labelY.toString()})`)

      // Country name
      labelGroup
        .append('text')
        .attr('text-anchor', textAnchor)
        .attr('dy', '-0.3em')
        .attr('class', 'd3-title')
        .style('font-size', '14px')
        .text(d.country)

      // Percentage
      labelGroup
        .append('text')
        .attr('text-anchor', textAnchor)
        .attr('dy', '1em')
        .attr('class', 'd3-label')
        .text(`${d.percentage.toFixed(1)}%`)
    })

    // Add center company name
    if (selectedCompany !== 'all') {
      const company = techCompanies.find((c) => c.id === selectedCompany)
      if (company) {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .attr('class', 'd3-title')
          .style('font-size', '20px')
          .text(company.name)
      }
    }
  }, [exposureData, selectedCompany])

  const dateRange = useMemo(() => {
    const dates = tariffTimeline.map((s) => new Date(s.date))
    return {
      start: new Date(Math.min(...dates.map((d) => d.getTime()))),
      end: new Date(Math.max(...dates.map((d) => d.getTime()))),
    }
  }, [])

  return (
    <div className="country-exposure">
      <div className="header">
        <div className="header-top">
          <div className="navigation-controls">
            <button className="nav-button">← Back to Tariff View</button>
            <span className="percentage-share">Percentage Share</span>
            <button className="nav-button active">Dollar Volume</button>
          </div>
          <div className="company-title">
            <h2>Staples Technology Solutions</h2>
            <p>HP TIM Dashboard</p>
          </div>
        </div>
      </div>

      <div className="current-view">
        <h3>Current View</h3>
        <p className="view-subtitle">Percentage Share</p>
        <div className="company-info">
          <span>Company: </span>
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value)
            }}
            className="company-select-inline"
          >
            <option value="all">All Companies</option>
            {techCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <p className="total-display">Total: 100%</p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRef}></svg>

        <div className="country-legend">
          <h4>Countries</h4>
          <div className="legend-items">
            {exposureData.slice(0, 10).map((country) => (
              <div key={country.country} className="legend-item">
                <span
                  className="color-indicator"
                  style={{ backgroundColor: COUNTRY_COLORS[country.country] || '#888' }}
                ></span>
                <span className="country-name">{country.country}</span>
                <span className="percentage">{country.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="timeline-container">
        <h3>Timeline</h3>
        <div className="timeline-wrapper">
          <input
            id="date-slider"
            type="range"
            min={dateRange.start.getTime()}
            max={dateRange.end.getTime()}
            value={selectedDate.getTime()}
            onChange={(e) => {
              setSelectedDate(new Date(parseInt(e.target.value)))
            }}
            className="timeline-slider"
          />
          <div className="timeline-labels">
            <span>Jan 2025</span>
            <span>Jul 2025</span>
            <span>Jan 2026</span>
            <span>Dec 2026</span>
          </div>
        </div>
        <div className="timeline-info">
          <span>Legend</span>
        </div>
      </div>
    </div>
  )
}

export default CountryExposure
