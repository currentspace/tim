import { useState, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { getActiveTariffForDate } from '../utils/tariffCalculations'
import { COUNTRY_COLORS } from '../constants/colors'
import { createTooltip, showTooltip, hideTooltip } from '../utils/d3Utils'
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

// D3 visualization class
class CountryExposureVisualization {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private width = 900
  private height = 600
  private centerX = 300
  private centerY = this.height / 2
  private innerRadius = 50
  private outerRadius = 180

  constructor(svgElement: SVGSVGElement) {
    this.svg = d3.select(svgElement)
    this.tooltip = createTooltip()
    this.initializeSvg()
  }

  private initializeSvg() {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${String(this.width)} ${String(this.height)}`)
  }

  update(exposureData: Omit<ArcData, 'startAngle' | 'endAngle' | 'midAngle'>[], selectedCompany: string) {
    // Clear previous content
    this.svg.selectAll('*').remove()

    const g = this.svg
      .append('g')
      .attr('transform', `translate(${String(this.centerX)},${String(this.centerY)}`)

    // Create concentric circles
    const scales = [0.2, 0.4, 0.6, 0.8, 1.0]
    scales.forEach((scale) => {
      g.append('circle')
        .attr('r', this.innerRadius + (this.outerRadius - this.innerRadius) * scale)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
        .style('stroke-dasharray', scale === 1 ? 'none' : '2,2')
    })

    // Calculate angles
    const totalPercentage = d3.sum(exposureData, (d) => d.percentage)
    let currentAngle = -Math.PI / 2

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
      .innerRadius(this.innerRadius)
      .outerRadius((d) => {
        return this.innerRadius + (this.outerRadius - this.innerRadius) * (d.percentage / 30)
      })

    // Add colored arcs
    g.selectAll('.country-arc')
      .data(arcs)
      .enter()
      .append('path')
      .attr('class', 'country-arc')
      .attr('d', arcGenerator)
      .attr('fill', (d) => COUNTRY_COLORS[d.country] ?? '#888888')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseenter', (event: MouseEvent, d) => {
        d3.select(event.currentTarget as SVGPathElement).style('opacity', 1)

        const revenue = d.totalRevenue / 1e6
        const content = `
          <div class="tooltip-title">${d.country}</div>
          <div class="tooltip-value">Revenue: $${revenue.toFixed(0)}M</div>
          <div class="tooltip-value">Share: ${d.percentage.toFixed(1)}%</div>
          <div class="tooltip-value">Tariff: ${String(d.currentTariff)}%</div>
        `
        showTooltip(this.tooltip, content, event)
      })
      .on('mouseleave', (event: MouseEvent) => {
        d3.select(event.currentTarget as SVGPathElement).style('opacity', 0.8)
        hideTooltip(this.tooltip)
      })
      .on('mousemove', (event: MouseEvent) => {
        this.tooltip
          .style('left', `${String(event.pageX + 10)}px`)
          .style('top', `${String(event.pageY - 28)}px`)
      })

    // Add leader lines and labels
    const legendX = this.centerX + this.outerRadius + 100
    const legendStartY = 80
    const legendSpacing = 35

    arcs.forEach((d, i) => {
      const arcMidRadius = this.innerRadius + ((this.outerRadius - this.innerRadius) * (d.percentage / 30)) / 2
      const startX = (Math.cos(d.midAngle) * (arcMidRadius + this.outerRadius)) / 2
      const startY = (Math.sin(d.midAngle) * (arcMidRadius + this.outerRadius)) / 2
      const endY = legendStartY + i * legendSpacing

      // Create curved leader line path
      const midX = startX + 100
      const path = `M ${String(startX)} ${String(startY)} Q ${String(midX)} ${String(startY)}, ${String(legendX - this.centerX)} ${String(endY)}`

      g.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .style('opacity', 0.6)

      // Add colored dot
      this.svg
        .append('circle')
        .attr('cx', legendX - 15)
        .attr('cy', endY + this.centerY)
        .attr('r', 6)
        .attr('fill', COUNTRY_COLORS[d.country] ?? '#888888')

      // Add country name
      this.svg
        .append('text')
        .attr('x', legendX)
        .attr('y', endY + this.centerY)
        .attr('dy', '0.32em')
        .style('font-family', 'var(--font-data)')
        .style('font-size', '14px')
        .style('fill', '#333')
        .text(d.country)

      // Add revenue value
      this.svg
        .append('text')
        .attr('x', legendX + 150)
        .attr('y', endY + this.centerY)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .style('font-family', 'var(--font-data)')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#666')
        .text(`${String((d.totalRevenue / 1e6).toFixed(0))}M`)
    })

    // Add center circle
    g.append('circle')
      .attr('r', this.innerRadius - 5)
      .attr('fill', '#4169E1')
      .style('opacity', 0.9)

    // Add center company name
    if (selectedCompany !== 'all') {
      const company = techCompanies.find((c) => c.id === selectedCompany)
      if (company) {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .style('font-family', 'var(--font-heading)')
          .style('font-size', '18px')
          .style('font-weight', '700')
          .style('fill', 'white')
          .text(company.name === 'HP Inc.' ? 'HP' : company.name)
      }
    }
  }

  destroy() {
    this.tooltip.remove()
  }
}

function CountryExposure() {
  const visualizationRef = useRef<CountryExposureVisualization | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
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

  // Callback ref for SVG element - called when DOM element is attached/detached
  const svgRefCallback = (node: SVGSVGElement | null) => {
    if (node) {
      if (!visualizationRef.current) {
        visualizationRef.current = new CountryExposureVisualization(node)
        setIsInitialized(true)
      }
      visualizationRef.current.update(exposureData, selectedCompany)
    } else if (visualizationRef.current) {
      visualizationRef.current.destroy()
      visualizationRef.current = null
      setIsInitialized(false)
    }
  }

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
        <p className="total-display">
          Total: {(exposureData.reduce((sum, d) => sum + d.totalRevenue, 0) / 1e6) | 0}M
        </p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRefCallback}></svg>
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
