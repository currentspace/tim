import { useState, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { calculateAllCompaniesImpact } from '../utils/tariffCalculations'
import { COMPANY_COLORS } from '../constants/colors'
import { createTooltip, showTooltip, hideTooltip, TRANSITION_DURATION } from '../utils/d3Utils'
import './AnticipatedTariffImpact.css'

interface SimulationNode extends d3.SimulationNodeDatum {
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

function AnticipatedTariffImpact() {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> | null>(
    null,
  )

  // Set date range from Jun 2025 to Dec 2025 as shown in screenshot
  const dateRange = useMemo(
    () => ({
      start: new Date('2025-06-01'),
      end: new Date('2025-12-31'),
    }),
    [],
  )

  // Start with current date (Aug 2025 as shown in screenshot)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-08-01'))

  // Get impacts for all companies
  const allImpacts = useMemo(
    () => calculateAllCompaniesImpact(techCompanies, selectedDate, tariffTimeline),
    [selectedDate],
  )

  // Filter to show only specific companies matching the screenshot style
  const impacts = useMemo(() => {
    const targetCompanies = ['HP Inc.', 'Apple', 'Dell Technologies']
    return allImpacts.filter((impact) => targetCompanies.includes(impact.company))
  }, [allImpacts])

  // Create visualization
  useEffect(() => {
    if (!svgRef.current || impacts.length === 0) return

    const width = 800
    const height = 500

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create tooltip if not exists
    tooltipRef.current ??= createTooltip()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${String(width / 2)},${String(height / 2)})`)

    // Use the filtered impacts directly (already only 3 companies)
    const simulationData = impacts as SimulationNode[]

    // Create scales - larger bubbles for better visibility
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(simulationData, (d) => d.tariffImpact) ?? 0])
      .range([60, 120])

    // Get company colors
    const getCompanyColor = (companyName: string): string => {
      const company = techCompanies.find((c) => c.name === companyName)
      if (company) {
        return COMPANY_COLORS[company.id] || '#888888'
      }
      return '#888888'
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation(simulationData)
      .force('x', d3.forceX(0).strength(0.1))
      .force('y', d3.forceY(0).strength(0.1))
      .force(
        'collide',
        d3.forceCollide((d: SimulationNode) => {
          const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
          return radiusScale(impactPercentage) + 10
        }),
      )
      .force('charge', d3.forceManyBody().strength(-50))

    // Create company groups
    const companyGroups = g
      .selectAll('.company-bubble')
      .data(simulationData)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')

    // Add circles
    companyGroups
      .append('circle')
      .attr('r', (d) => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return radiusScale(impactPercentage)
      })
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
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('letter-spacing', '-0.01em')
      .style('fill', '#fff')
      .style('pointer-events', 'none') // Prevent text from blocking mouse events
      .text((d) => {
        // Show short names as in screenshot
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
      .style('font-size', '24px')
      .style('font-weight', '600')
      .style('font-variant-numeric', 'tabular-nums')
      .style('fill', '#fff')
      .style('pointer-events', 'none') // Prevent text from blocking mouse events
      .text((d) => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return `${impactPercentage.toFixed(1)}%`
      })

    // Create highlight circles for hover effect (separate from physics circles)
    companyGroups
      .append('circle')
      .attr('r', (d) => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return radiusScale(impactPercentage)
      })
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Add invisible interaction layer
    companyGroups
      .append('circle')
      .attr('r', (d) => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return radiusScale(impactPercentage) + 5 // Slightly larger for easier hover
      })
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event: MouseEvent, d: SimulationNode) {
        const company = techCompanies.find((c) => c.name === d.company)
        if (!company || !tooltipRef.current) return

        // Show highlight circle without affecting the actual circle
        d3.select(this.parentNode)
          .select('circle:nth-child(2)')
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 1)

        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        const content = `
          <div class="tooltip-title">${company.name}</div>
          <div class="tooltip-value">Tariff Impact: ${impactPercentage.toFixed(1)}%</div>
          <div class="tooltip-value">Revenue Impact: $${(d.tariffImpact / 1e6).toFixed(1)}M</div>
          <div class="tooltip-value">Base Revenue: $${(d.baseRevenue / 1e9).toFixed(1)}B</div>
        `

        showTooltip(tooltipRef.current, content, event)
      })
      .on('mouseleave', function () {
        // Hide highlight circle
        d3.select(this.parentNode)
          .select('circle:nth-child(2)')
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 0)

        if (tooltipRef.current) {
          hideTooltip(tooltipRef.current)
        }
      })
      .on('mousemove', function (event: MouseEvent) {
        // Update tooltip position on move
        if (tooltipRef.current) {
          tooltipRef.current
            .style('left', `${String(event.pageX + 10)}px`)
            .style('top', `${String(event.pageY - 28)}px`)
        }
      })

    // Run simulation with fixed positions after initial layout
    let tickCount = 0
    simulation.on('tick', () => {
      tickCount++
      companyGroups.attr('transform', (d: SimulationNode) => {
        return `translate(${String(d.x ?? 0)},${String(d.y ?? 0)})`
      })

      // Stop simulation after 120 ticks (roughly 2 seconds) and fix positions
      if (tickCount > 120) {
        simulation.stop()
        // Fix the positions to prevent any further movement
        simulationData.forEach((d) => {
          d.fx = d.x
          d.fy = d.y
        })
      }
    })

    // Cleanup on unmount
    return () => {
      simulation.stop()
      if (tooltipRef.current) {
        tooltipRef.current.remove()
        tooltipRef.current = null
      }
    }
  }, [impacts])

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
        </div>
        <div className="anticipated-badge">ANTICIPATED</div>
      </div>

      <div className="current-view">
        <h3>Current View</h3>
        <p className="view-subtitle">Tariff Exposure & Rate</p>
        <p className="date-display">
          {selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRef}></svg>
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
            <span>Jun 2025</span>
            <span>Aug 2025</span>
            <span>Oct 2025</span>
            <span>Dec 2025</span>
          </div>
        </div>
        <div className="timeline-date">
          {selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

export default AnticipatedTariffImpact
