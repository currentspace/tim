import { useState, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { calculateAllCompaniesImpact } from '../utils/tariffCalculations'
import { COMPANY_COLORS } from '../constants/colors'
import { getProductBreakdown } from '../data/productBreakdown'
import { TRANSITION_DURATION } from '../utils/d3Utils'
import './AnticipatedTariffImpact.css'

interface CompanyData {
  company: string
  baseRevenue: number
  tariffImpact: number
  netRevenue: number
  impactPercentage: number
}

function AnticipatedTariffImpact() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null)

  // Quarter positions for timeline
  const quarters = [
    new Date('2025-06-01'),
    new Date('2025-08-01'),
    new Date('2025-10-01'),
    new Date('2025-12-01'),
  ]

  const getQuarterIndex = (date: Date): number => {
    const time = date.getTime()
    for (let i = quarters.length - 1; i >= 0; i--) {
      if (time >= quarters[i].getTime()) return i
    }
    return 0
  }

  const getDateFromQuarterIndex = (index: number): Date => {
    return quarters[Math.max(0, Math.min(index, quarters.length - 1))]
  }

  // Start with current date (Aug 2025 as shown in screenshot)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-08-01'))

  // Get impacts for all companies
  const allImpacts = useMemo(
    () => calculateAllCompaniesImpact(techCompanies, selectedDate, tariffTimeline),
    [selectedDate],
  )

  // Filter to show only specific companies and calculate percentages
  const companyData: CompanyData[] = useMemo(() => {
    const targetCompanies = ['Canon', 'HP Inc.', 'Apple']
    return allImpacts
      .filter((impact) => targetCompanies.includes(impact.company))
      .map((impact) => ({
        company: impact.company,
        baseRevenue: impact.baseRevenue,
        tariffImpact: impact.tariffImpact,
        netRevenue: impact.netRevenue,
        impactPercentage: (impact.tariffImpact / impact.baseRevenue) * 100,
      }))
    // Don't sort - maintain specific order for positioning
  }, [allImpacts])

  // Create visualization
  useEffect(() => {
    if (!svgRef.current || companyData.length === 0) return

    const width = 800
    const height = 400
    const centerX = width / 2
    const centerY = height / 2
    const radius = 120

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create radius scale based on impact percentage - smaller bubbles
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(companyData, (d) => d.impactPercentage) ?? 0])
      .range([40, 80])

    // Get company colors
    const getCompanyColor = (companyName: string): string => {
      const company = techCompanies.find((c) => c.name === companyName)
      if (company) {
        return COMPANY_COLORS[company.id] || '#888888'
      }
      return '#888888'
    }

    // Calculate positions for three bubbles in triangular arrangement
    // Match the design mockup: Canon top, HP bottom left, Apple bottom right
    const getPosition = (company: string) => {
      // Adjust positioning to match design mockup exactly
      const adjustedRadius = radius * 0.7 // Slightly tighter arrangement
      switch (company) {
        case 'Canon':
        case 'Dell Technologies':
          return { x: centerX, y: centerY - adjustedRadius * 0.8 } // Top
        case 'HP Inc.':
          return { x: centerX - adjustedRadius * 0.866, y: centerY + adjustedRadius * 0.5 } // Bottom left
        case 'Apple':
          return { x: centerX + adjustedRadius * 0.866, y: centerY + adjustedRadius * 0.5 } // Bottom right
        default:
          return { x: centerX, y: centerY }
      }
    }

    // Create company groups with specific positioning
    const companyGroups = svg
      .selectAll('.company-bubble')
      .data(companyData)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')
      .attr('transform', (d) => {
        const pos = getPosition(d.company)
        return `translate(${String(pos.x)},${String(pos.y)})`
      })

    // Add circles
    companyGroups
      .append('circle')
      .attr('r', (d) => radiusScale(d.impactPercentage))
      .attr('fill', (d) => getCompanyColor(d.company))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .style('opacity', 0.9)

    // Add company names
    companyGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('class', 'company-name')
      .style('font-family', 'var(--font-heading)')
      .style('font-size', '14px')
      .style('font-weight', '700')
      .style('letter-spacing', '-0.01em')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text((d) => {
        if (d.company === 'HP Inc.') return 'HP'
        if (d.company === 'Dell Technologies') return 'Dell'
        return d.company
      })

    // Add impact percentage
    companyGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('class', 'impact-percentage')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('font-variant-numeric', 'tabular-nums')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text((d) => `${d.impactPercentage.toFixed(1)}%`)

    // Create dotted lines group (will be populated on hover)
    const linesGroup = svg.append('g').attr('class', 'dotted-lines')

    // Create right panel for product breakdown - remove as it's not in the design
    const rightPanel = svg
      .append('g')
      .attr('class', 'right-panel')
      .attr('transform', `translate(${String(width - 250)},${String(50)})`)
      .style('opacity', 0)
      .style('display', 'none')

    // Add product breakdown title
    rightPanel
      .append('text')
      .attr('class', 'breakdown-title')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-family', 'var(--font-heading)')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#333')

    // Add cumulative average
    rightPanel
      .append('text')
      .attr('class', 'cumulative-avg')
      .attr('x', 0)
      .attr('y', 25)
      .style('font-family', 'var(--font-data)')
      .style('font-size', '20px')
      .style('font-weight', '700')
      .style('fill', '#333')

    // Add hover interactions
    companyGroups
      .on('mouseenter', function (_event: MouseEvent, d: CompanyData) {
        setHoveredCompany(d.company)

        // Highlight bubble
        d3.select(this)
          .select('circle')
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('stroke-width', 5)
          .style('filter', 'brightness(1.1)')
      })
      .on('mouseleave', function () {
        setHoveredCompany(null)

        // Reset bubble
        d3.select(this)
          .select('circle')
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('stroke-width', 3)
          .style('filter', 'none')
      })
  }, [companyData, hoveredCompany])

  return (
    <div className="anticipated-tariff-impact">
      <div className="header">
        <div className="header-top">
          <div className="title-section">
            <span className="dollar-volume">Dollar Volume</span>
            <label className="toggle-switch">
              <input type="checkbox" checked readOnly />
              <span className="slider"></span>
            </label>
            <span className="exposure-rate">Tariff Exposure & Rate</span>
          </div>
          <div className="company-title">
            <h2>Staples Technology Solutions</h2>
            <p>TIM Dashboard</p>
          </div>
          <div className="notifications-section">
            <button className="notifications-button">Notifications</button>
          </div>
        </div>
        <div className="header-tabs">
          <button className="tab-button">Timeline</button>
          <div className="anticipated-badge">ANTICIPATED</div>
          <button className="tab-button active">Chart</button>
        </div>
      </div>

      <div className="current-view">
        <h3>Current View</h3>
        <p className="view-subtitle">Tariff Exposure & Rate</p>
        <p className="date-display">
          {selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRef} data-testid="tariff-impact-svg"></svg>
      </div>

      <div className="timeline-container">
        <h3 className="timeline-title">TIMELINE</h3>
        <div className="timeline-subtitle">Aug 2025</div>
        <div className="timeline-wrapper">
          <input
            id="date-slider"
            type="range"
            min={0}
            max={3}
            value={getQuarterIndex(selectedDate)}
            onChange={(e) => {
              const quarterIndex = parseInt(e.target.value)
              const newDate = getDateFromQuarterIndex(quarterIndex)
              setSelectedDate(newDate)
            }}
            className="timeline-slider"
            step={1}
            aria-label="Timeline slider"
          />
          <div className="timeline-labels">
            <span>Jun 2025</span>
            <span>Aug 2025</span>
            <span>Oct 2025</span>
            <span>Dec 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnticipatedTariffImpact
