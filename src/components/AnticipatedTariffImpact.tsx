import { useState, useMemo, useRef, useEffect } from 'react'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { calculateAllCompaniesImpact } from '../utils/tariffCalculations'
import { COMPANY_COLORS, D3_COLORS } from '../constants/colors'
import { FONTS } from '../constants/fonts'
// Removed unused import - getProductBreakdown
import { TRANSITION_DURATION } from '../utils/d3Utils'
import { css, cx } from '../../styled-system/css'
import { layoutStyles, timelineStyles } from '../styles/shared'
import Layout from './Layout'
import { max, scaleSqrt, select, forceSimulation, forceX, forceY, forceCollide } from 'd3'

interface CompanyData {
  company: string
  baseRevenue: number
  tariffImpact: number
  netRevenue: number
  impactPercentage: number
}

interface NodeData extends CompanyData {
  radius: number
  x: number
  y: number
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
    const centerX = width / 2
    const centerY = height / 2

    // Clear previous content
    select(svgRef.current).selectAll('*').remove()

    const svg = select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create radius scale based on impact percentage - larger circles to match Figma
    const radiusScale = scaleSqrt()
      .domain([0, max(companyData, (d) => d.impactPercentage) ?? 0])
      .range([50, 90])

    // Get company colors
    const getCompanyColor = (companyName: string): string => {
      const company = techCompanies.find((c) => c.name === companyName)
      if (company) {
        return COMPANY_COLORS[company.id] || D3_COLORS.TEXT_MUTED
      }
      return D3_COLORS.TEXT_MUTED
    }

    // Create node data with positions
    const nodes: NodeData[] = companyData.map((d, i) => ({
      ...d,
      radius: radiusScale(d.impactPercentage),
      x: centerX + (i - 1) * 150, // Initial spread
      y: centerY + (i - 1) * 50,
    }))

    // Run force simulation to prevent overlaps
    const simulation = forceSimulation<NodeData>(nodes)
      .force('x', forceX(centerX).strength(0.05))
      .force('y', forceY(centerY).strength(0.05))
      .force(
        'collide',
        forceCollide<NodeData>().radius((d) => d.radius + 20),
      )
      .stop()

    // Run simulation synchronously
    for (let i = 0; i < 120; i++) simulation.tick()

    // Create company groups with force-positioned nodes
    const companyGroups = svg
      .selectAll('.company-bubble')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')
      .attr('transform', (d) => `translate(${String(d.x)},${String(d.y)})`)

    // Add circles
    companyGroups
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => getCompanyColor(d.company))
      .attr('stroke', D3_COLORS.BG_PRIMARY)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0.9)

    // Add company names to the left of bubbles (to match Figma)
    companyGroups
      .append('text')
      .attr('x', (d) => -d.radius - 20)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('class', 'company-name')
      .style('font-family', FONTS.EDITORIAL)
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', D3_COLORS.TEXT_PRIMARY)
      .style('pointer-events', 'none')
      .text((d) => {
        if (d.company === 'HP Inc.') return 'HP'
        if (d.company === 'Dell Technologies') return 'Dell'
        return d.company
      })

    // Add impact percentage below company name
    companyGroups
      .append('text')
      .attr('x', (d) => -d.radius - 20)
      .attr('y', 20)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('class', 'impact-percentage')
      .style('font-family', FONTS.DATA)
      .style('font-size', '14px')
      .style('font-weight', '400')
      .style('font-variant-numeric', 'tabular-nums')
      .style('fill', D3_COLORS.TEXT_MUTED)
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
      .style('fill', D3_COLORS.BG_PRIMARY)
      .style('stroke', D3_COLORS.BORDER_DEFAULT)
      .style('stroke-width', 1)
      .style('filter', `drop-shadow(0 4px 12px ${D3_COLORS.SHADOW})`)

    // Popup content group
    const popupContent = popup
      .append('g')
      .attr('class', 'popup-content')
      .attr('transform', 'translate(15,20)')

    // Create callout line group
    svg.append('g').attr('class', 'callout-line')

    // Add hover interactions
    companyGroups
      .on('mouseenter', function (this: SVGGElement, _event: MouseEvent, d: NodeData) {
        setHoveredCompany(d.company)

        // Highlight bubble
        select(this)
          .select('circle')
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('stroke-width', 3)
          .style('filter', 'brightness(1.1)')

        // Get bubble position from node data
        const bubblePos = { x: d.x, y: d.y }
        const bubbleRadius = d.radius

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
          .style('font-family', FONTS.EDITORIAL)
          .style('font-size', '16px')
          .style('font-weight', '600')
          .style('fill', D3_COLORS.TEXT_PRIMARY)
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
            .style('font-family', FONTS.DATA)
            .style('font-size', '12px')
            .style('font-weight', '500')
            .style('fill', D3_COLORS.TEXT_MUTED)
            .text(detail.label)

          popupContent
            .append('text')
            .attr('x', popupWidth - 20)
            .attr('y', yPos)
            .attr('text-anchor', 'end')
            .style('font-family', FONTS.DATA)
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', D3_COLORS.TEXT_PRIMARY)
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
          .style('stroke', D3_COLORS.TEXT_MUTED)
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
        select(this)
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
        left: 'Volume',
        right: 'Exposure',
        current: 'right',
        onToggle: () => {
          // Toggle functionality to be implemented
        },
      }}
    >
      <div className={cx('anticipated-tariff-impact', layoutStyles.pageContainer)}>
        <div className={cx('visualization-container', layoutStyles.visualizationContainer)}>
          <svg
            ref={svgRef}
            data-testid="tariff-impact-svg"
            className={css({
              width: '100%',
              height: 'auto',
              background: 'transparent',
              display: 'block',
            })}
          ></svg>
        </div>

        <div
          className={cx(
            'timeline-container',
            css({
              background: 'white',
              padding: '2rem 3rem 3rem',
              borderTop: '1px solid #e0e0e0',
              position: 'relative',
            }),
          )}
        >
          <h3
            className={css({
              margin: 0,
              fontFamily: 'editorial',
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'text.primary',
              position: 'absolute',
              left: '3rem',
              top: '2rem',
            })}
          >
            TIMELINE
          </h3>
          <div className={cx('timeline-subtitle', timelineStyles.timelineSubtitle)}>Aug 2025</div>
          <div
            className={css({
              position: 'relative',
              padding: '4rem 3rem 1rem',
            })}
          >
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
              className={css({
                position: 'relative',
                width: '100%',
                height: '4px',
                background: '#e0e0e0',
                borderRadius: '2px',
                cursor: 'pointer',
                margin: '2rem 0 1rem',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: '#333',
                  borderRadius: '2px',
                  width: 'calc(var(--progress, 0) * 100%)',
                  transition: 'width 0.3s ease',
                },
              })}
              step={1}
              aria-label="Timeline slider"
            />
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                padding: '0 0.5rem',
              })}
            >
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
