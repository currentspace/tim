import { useState, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { calculateAllCompaniesImpact } from '../utils/tariffCalculations'
import { COMPANY_COLORS } from '../constants/colors'
// Removed unused import - getProductBreakdown
import { TRANSITION_DURATION } from '../utils/d3Utils'
import './AnticipatedTariffImpact.css'
import '../styles/timeline-slider.css'
import Layout from './Layout'
import '../styles/timeline-slider.css'

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

  // Show top 3 companies with highest tariff impact to match Figma design
  const companyData: CompanyData[] = useMemo(() => {
    return allImpacts
      .map((impact) => ({
        company: impact.company,
        baseRevenue: impact.baseRevenue,
        tariffImpact: impact.tariffImpact,
        netRevenue: impact.netRevenue,
        impactPercentage: (impact.tariffImpact / impact.baseRevenue) * 100,
      }))
      .filter((company) => company.impactPercentage > 0) // Only show companies with tariff impact
      .sort((a, b) => b.impactPercentage - a.impactPercentage) // Sort by impact descending
      .slice(0, 3) // Only show top 3 companies
  }, [allImpacts])

  // Create visualization
  useEffect(() => {
    if (!svgRef.current || companyData.length === 0) return

    const width = 800
    const height = 600
    const leftMargin = 300
    const topMargin = 150
    const bubbleSpacing = 140

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create radius scale based on impact percentage - larger circles to match Figma
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

    // Calculate positions for vertical stack layout
    const getPosition = (index: number) => {
      return {
        x: leftMargin,
        y: topMargin + index * bubbleSpacing,
      }
    }

    // Create company groups with vertical positioning
    const companyGroups = svg
      .selectAll('.company-bubble')
      .data(companyData)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')
      .attr('transform', (_d, i) => {
        const pos = getPosition(i)
        return `translate(${String(pos.x)},${String(pos.y)})`
      })

    // Add circles
    companyGroups
      .append('circle')
      .attr('r', (d) => radiusScale(d.impactPercentage))
      .attr('fill', (d) => getCompanyColor(d.company))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0.9)

    // Add company names to the left of bubbles (to match Figma)
    companyGroups
      .append('text')
      .attr('x', (d) => -radiusScale(d.impactPercentage) - 20)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('class', 'company-name')
      .style('font-family', 'var(--font-heading)')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .text((d) => {
        if (d.company === 'HP Inc.') return 'HP'
        if (d.company === 'Dell Technologies') return 'Dell'
        return d.company
      })

    // Add impact percentage below company name
    companyGroups
      .append('text')
      .attr('x', (d) => -radiusScale(d.impactPercentage) - 20)
      .attr('y', 20)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('class', 'impact-percentage')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '14px')
      .style('font-weight', '400')
      .style('font-variant-numeric', 'tabular-nums')
      .style('fill', '#666')
      .style('pointer-events', 'none')
      .text((d) => `${d.impactPercentage.toFixed(1)}%`)

    // Create popup group for product breakdown
    const popup = svg
      .append('g')
      .attr('class', 'breakdown-popup')
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Popup background
    const popupBg = popup
      .append('rect')
      .attr('class', 'popup-background')
      .attr('rx', 8)
      .style('fill', '#fff')
      .style('stroke', '#ddd')
      .style('stroke-width', 1)
      .style('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))')

    // Popup content group
    const popupContent = popup
      .append('g')
      .attr('class', 'popup-content')
      .attr('transform', 'translate(15,20)')

    // Create callout line group
    svg.append('g').attr('class', 'callout-line')

    // Add hover interactions
    companyGroups
      .on('mouseenter', function (this: SVGGElement, _event: MouseEvent, d: CompanyData) {
        setHoveredCompany(d.company)

        // Get the index from the data
        const allData = companyGroups.data()
        const i = allData.indexOf(d)

        // Highlight bubble
        d3.select(this)
          .select('circle')
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('stroke-width', 3)
          .style('filter', 'brightness(1.1)')

        // Get bubble position
        const bubblePos = getPosition(i)
        const bubbleRadius = radiusScale(d.impactPercentage)

        // Show popup with product breakdown
        const popupX = bubblePos.x + bubbleRadius + 80
        const popupY = bubblePos.y - 80
        const popupWidth = 250
        const popupHeight = 160

        // Position popup
        popup
          .attr('transform', `translate(${String(popupX)},${String(popupY)})`)
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 1)

        // Update popup background size
        popupBg.attr('width', popupWidth).attr('height', popupHeight)

        // Clear existing popup content
        popupContent.selectAll('*').remove()

        // Add company title
        popupContent
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('font-family', 'var(--font-heading)')
          .style('font-size', '16px')
          .style('font-weight', '600')
          .style('fill', '#333')
          .text(d.company)

        // Add impact details
        const details = [
          { label: 'Base Revenue:', value: `$${(d.baseRevenue / 1000000).toFixed(1)}M` },
          { label: 'Tariff Impact:', value: `$${(d.tariffImpact / 1000000).toFixed(1)}M` },
          { label: 'Net Revenue:', value: `$${(d.netRevenue / 1000000).toFixed(1)}M` },
          { label: 'Impact Rate:', value: `${d.impactPercentage.toFixed(1)}%` },
        ]

        details.forEach((detail, idx) => {
          const yPos = 25 + idx * 25

          popupContent
            .append('text')
            .attr('x', 0)
            .attr('y', yPos)
            .style('font-family', 'var(--font-data)')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('fill', '#666')
            .text(detail.label)

          popupContent
            .append('text')
            .attr('x', popupWidth - 20)
            .attr('y', yPos)
            .attr('text-anchor', 'end')
            .style('font-family', 'var(--font-data)')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#333')
            .text(detail.value)
        })

        // Draw callout line from bubble to popup
        const calloutLine = svg.select('.callout-line')
        calloutLine.selectAll('*').remove()

        calloutLine
          .append('line')
          .attr('x1', bubblePos.x + bubbleRadius)
          .attr('y1', bubblePos.y)
          .attr('x2', popupX - 5)
          .attr('y2', popupY + popupHeight / 2)
          .style('stroke', '#999')
          .style('stroke-width', 1)
          .style('stroke-dasharray', '4,4')
          .style('opacity', 0)
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 0.6)
      })
      .on('mouseleave', function () {
        setHoveredCompany(null)

        // Reset bubble
        d3.select(this)
          .select('circle')
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('stroke-width', 2)
          .style('filter', 'none')

        // Hide popup
        popup.transition().duration(TRANSITION_DURATION).style('opacity', 0)

        // Remove callout line
        svg
          .select('.callout-line')
          .selectAll('*')
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', 0)
          .remove()
      })
  }, [companyData, hoveredCompany])

  return (
    <Layout
      currentView="Chart"
      badge="ANTICIPATED"
      toggleOptions={{
        left: 'Dollar Volume',
        right: 'Tariff Exposure & Rate',
        current: 'right',
        onToggle: () => {
          // Toggle functionality to be implemented
        },
      }}
    >
      <div className="anticipated-tariff-impact">
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
    </Layout>
  )
}

export default AnticipatedTariffImpact
