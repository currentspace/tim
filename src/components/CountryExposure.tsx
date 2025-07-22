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
  private centerX = 350
  private centerY = this.height / 2
  private outerRadius = 200

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

  update(
    exposureData: Omit<ArcData, 'startAngle' | 'endAngle' | 'midAngle'>[],
    selectedCompany: string,
  ) {
    // Clear previous content
    this.svg.selectAll('*').remove()

    const g = this.svg
      .append('g')
      .attr('transform', `translate(${String(this.centerX)},${String(this.centerY)}`)

    // Sort data by percentage descending
    const sortedData = [...exposureData].sort((a, b) => b.percentage - a.percentage)

    // Create concentric circles for each country
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(sortedData, (d) => d.percentage) ?? 0])
      .range([30, this.outerRadius])

    // Add circles from largest to smallest
    sortedData.forEach((d) => {
      const radius = radiusScale(d.percentage)

      g.append('circle')
        .attr('r', radius)
        .attr('fill', COUNTRY_COLORS[d.country] ?? '#888888')
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent) => {
          d3.select(event.currentTarget as SVGCircleElement)
            .style('opacity', 1)
            .attr('stroke-width', 4)

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
          d3.select(event.currentTarget as SVGCircleElement)
            .style('opacity', 0.8)
            .attr('stroke-width', 3)
          hideTooltip(this.tooltip)
        })
        .on('mousemove', (event: MouseEvent) => {
          this.tooltip
            .style('left', `${String(event.pageX + 10)}px`)
            .style('top', `${String(event.pageY - 28)}px`)
        })
    })

    // Add center company name
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-family', 'var(--font-heading)')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(selectedCompany === 'HP Inc.' ? 'HP' : selectedCompany)

    // Add leader lines and labels
    const legendX = this.centerX + this.outerRadius + 100
    const legendStartY = 80
    const legendSpacing = 35

    sortedData.forEach((d, i) => {
      const endY = legendStartY + i * legendSpacing

      // Start from center (0, 0) for all lines
      const startX = 0
      const startY = 0

      // Create curved leader line path from center to legend
      const midX = (legendX - this.centerX) / 2
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
        .text(`${String(Math.round(d.totalRevenue / 1e6))}M`)
    })
  }

  destroy() {
    this.tooltip.remove()
  }
}

function CountryExposure() {
  const visualizationRef = useRef<CountryExposureVisualization | null>(null)
  // Removed unused isInitialized state
  const [selectedCompany, setSelectedCompany] = useState<string>('hp') // Default to HP like in the image
  const [selectedDate, setSelectedDate] = useState(new Date('2025-01-01'))

  const activeTariff = useMemo(
    () => getActiveTariffForDate(selectedDate, tariffTimeline),
    [selectedDate],
  )

  const exposureData = useMemo(() => {
    // For HP, use design mockup values
    if (selectedCompany === 'hp') {
      const mockData = [
        { country: 'China', revenue: 485000000, percentage: 28.5 },
        { country: 'Vietnam', revenue: 320000000, percentage: 18.8 },
        { country: 'Mexico', revenue: 275000000, percentage: 16.2 },
        { country: 'EU', revenue: 230000000, percentage: 13.5 },
        { country: 'Taiwan', revenue: 160000000, percentage: 9.4 },
        { country: 'Japan', revenue: 95000000, percentage: 5.6 },
        { country: 'Malaysia', revenue: 75000000, percentage: 4.4 },
        { country: 'South Korea', revenue: 65000000, percentage: 3.8 },
        { country: 'Philippines', revenue: 35000000, percentage: 2.1 },
        { country: 'Thailand', revenue: 25000000, percentage: 1.5 },
      ]

      return mockData.map((d) => ({
        country: d.country,
        totalRevenue: d.revenue,
        percentage: d.percentage,
        affectedCompanies: ['HP Inc.'],
        currentTariff: activeTariff?.rates[d.country] ?? 0,
      }))
    }

    // Original calculation for other companies
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
      visualizationRef.current ??= new CountryExposureVisualization(node)
      visualizationRef.current.update(exposureData, selectedCompany)
    } else if (visualizationRef.current) {
      visualizationRef.current.destroy()
      visualizationRef.current = null
      // Cleanup complete
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
          Total: ${Math.round(exposureData.reduce((sum, d) => sum + d.totalRevenue, 0) / 1e6)}M
        </p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRefCallback} data-testid="country-exposure-svg"></svg>
      </div>

      <div className="timeline-container">
        <h3>Timeline</h3>
        <div className="timeline-wrapper">
          <input
            id="date-slider"
            type="range"
            aria-label="Date slider"
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
