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

  // Filter to show only specific companies and calculate percentages
  const companyData: CompanyData[] = useMemo(() => {
    const targetCompanies = ['HP Inc.', 'Apple', 'Dell Technologies']
    return allImpacts
      .filter((impact) => targetCompanies.includes(impact.company))
      .map((impact) => ({
        company: impact.company,
        baseRevenue: impact.baseRevenue,
        tariffImpact: impact.tariffImpact,
        netRevenue: impact.netRevenue,
        impactPercentage: (impact.tariffImpact / impact.baseRevenue) * 100,
      }))
      .sort((a, b) => b.impactPercentage - a.impactPercentage) // Sort by impact percentage descending
  }, [allImpacts])

  // Create visualization
  useEffect(() => {
    if (!svgRef.current || companyData.length === 0) return

    const width = 1000
    const height = 500
    const leftPanelWidth = 400
    const rightPanelWidth = 300
    const centerX = leftPanelWidth / 2
    const bubbleSpacing = 150

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
      .range([35, 65])

    // Get company colors
    const getCompanyColor = (companyName: string): string => {
      const company = techCompanies.find((c) => c.name === companyName)
      if (company) {
        return COMPANY_COLORS[company.id] || '#888888'
      }
      return '#888888'
    }

    // Create left panel group for bubbles
    const leftPanel = svg.append('g').attr('class', 'left-panel')

    // Calculate vertical positions for bubbles
    const startY = (height - (companyData.length - 1) * bubbleSpacing) / 2

    // Create company groups with vertical alignment
    const companyGroups = leftPanel
      .selectAll('.company-bubble')
      .data(companyData)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')
      .attr(
        'transform',
        (_, i) => `translate(${String(centerX)},${String(startY + i * bubbleSpacing)})`,
      )

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

    // Create right panel for product breakdown
    const rightPanel = svg
      .append('g')
      .attr('class', 'right-panel')
      .attr('transform', `translate(${String(width - rightPanelWidth)},${String(50)})`)
      .style('opacity', 0)

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

        // Get bubble position
        const transform = d3.select(this).attr('transform')
        const regex = /translate\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\)/
        const match = regex.exec(transform)
        if (!match) return
        const bubbleX = parseFloat(match[1])
        const bubbleY = parseFloat(match[2])
        const bubbleRadius = radiusScale(d.impactPercentage)

        // Show right panel
        rightPanel.transition().duration(TRANSITION_DURATION).style('opacity', 1)

        // Update breakdown title
        rightPanel
          .select('.breakdown-title')
          .text(`Rate Increase by Product Type (${d.company === 'HP Inc.' ? 'HP' : d.company})`)

        // Calculate cumulative average
        const products = getProductBreakdown(d.company)
        const avgPercentage = products.reduce((sum, p) => sum + p.percentage, 0) / products.length
        rightPanel.select('.cumulative-avg').text(`Cumulative Average ${avgPercentage.toFixed(2)}%`)

        // Remove existing product items
        rightPanel.selectAll('.product-item').remove()

        // Add product breakdown items
        const productItems = rightPanel
          .selectAll('.product-item')
          .data(products)
          .enter()
          .append('g')
          .attr('class', 'product-item')
          .attr('transform', (_, i) => `translate(0,${String(60 + i * 25)})`)

        productItems
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('font-family', 'var(--font-data)')
          .style('font-size', '12px')
          .style('fill', '#666')
          .text((p) => p.product)

        productItems
          .append('text')
          .attr('x', 150)
          .attr('y', 0)
          .attr('text-anchor', 'end')
          .style('font-family', 'var(--font-data)')
          .style('font-size', '12px')
          .style('font-weight', '600')
          .style('fill', '#333')
          .text((p) => `${p.percentage.toFixed(2)}%`)

        // Draw curved dotted lines from bubble to product items
        linesGroup.selectAll('path').remove()

        const lineStartX = bubbleX + bubbleRadius + 10
        const lineStartY = bubbleY

        products.forEach((_, i) => {
          const lineEndX = width - rightPanelWidth - 20
          const lineEndY = 60 + i * 25 + 50

          // Create curved path using quadratic bezier curve
          const midX = (lineStartX + lineEndX) / 2
          const controlPointX = midX + 50 // Curve outward to the right
          const controlPointY = (lineStartY + lineEndY) / 2

          const pathData = `M ${String(lineStartX)} ${String(lineStartY)} Q ${String(controlPointX)} ${String(controlPointY)} ${String(lineEndX)} ${String(lineEndY)}`

          linesGroup
            .append('path')
            .attr('d', pathData)
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .attr('fill', 'none')
            .style('opacity', 0)
            .transition()
            .duration(TRANSITION_DURATION)
            .style('opacity', 0.6)
        })
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

        // Hide right panel and lines
        rightPanel.transition().duration(TRANSITION_DURATION).style('opacity', 0)
        linesGroup
          .selectAll('path')
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 0)
          .remove()
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
            <span className="notifications-label">Notifications</span>
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
