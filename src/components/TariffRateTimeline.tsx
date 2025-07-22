import { useRef, useEffect, useState, useMemo } from 'react'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { COMPANY_COLORS, D3_COLORS } from '../constants/colors'
import { FONTS } from '../constants/fonts'
import { createTooltip, showTooltip, hideTooltip } from '../utils/d3Utils'
import { css, cx } from '../../styled-system/css'
import { layoutStyles, timelineStyles } from '../styles/shared'
import Layout from './Layout'
import {
  select,
  min,
  max,
  scaleTime,
  timeMonth,
  timeFormat,
  axisLeft,
  curveCatmullRom,
  axisBottom,
  scaleLinear,
  line,
} from 'd3'
import type { Selection } from 'd3'

interface CompanyTimeSeries {
  company: string
  companyId: string
  values: {
    date: Date
    rate: number
  }[]
  color: string
}

function TariffRateTimeline() {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<Selection<HTMLDivElement, unknown, HTMLElement, unknown> | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-04-01'))

  // Select top companies to display (matching Figma design)
  const displayCompanies = useMemo(() => {
    const priorityCompanies = [
      'apple',
      'alphabet',
      'canon',
      'foxconn',
      'dell',
      'lenovo',
      'microsoft',
      'samsung',
      'intel',
      'cisco',
      'tsmc',
      'tencent',
    ]
    return techCompanies.filter((c) => priorityCompanies.includes(c.id))
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    const width = 900
    const height = 480
    const margin = { top: 20, right: 180, bottom: 100, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear previous content
    select(svgRef.current).selectAll('*').remove()

    const svg = select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${String(margin.left)},${String(margin.top)})`)

    // Prepare time series data for each company
    const timeSeriesData: CompanyTimeSeries[] = []

    // Get date range from tariff timeline
    const dates = tariffTimeline.map((t) => new Date(t.date))
    const minDate = min(dates) ?? new Date('2025-01-01')
    const maxDate = max(dates) ?? new Date('2026-01-01')

    // Generate time series for selected companies
    displayCompanies.forEach((company) => {
      const values = tariffTimeline.map((schedule) => {
        let weightedRate = 0

        // Calculate weighted average of tariff rates based on country exposure
        Object.entries(company.revenueByCountry).forEach(([country, percentage]) => {
          const rate = schedule.rates[country] ?? 0
          weightedRate += rate * (percentage / 100)
        })

        return {
          date: new Date(schedule.date),
          rate: weightedRate,
        }
      })

      timeSeriesData.push({
        company: company.name,
        companyId: company.id,
        values,
        color: COMPANY_COLORS[company.id] ?? D3_COLORS.TEXT_MUTED,
      })
    })

    // Create scales
    const xScale = scaleTime().domain([minDate, maxDate]).range([0, innerWidth])

    const yScale = scaleLinear()
      .domain([0, 32]) // 0-32% as shown in screenshot
      .range([innerHeight, 0])

    // Create tooltip if not exists
    tooltipRef.current ??= createTooltip()

    // Create grid lines
    const yAxisGrid = axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(8)

    const xAxisGrid = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(() => '')
      .ticks(timeMonth.every(1))

    // Add Y grid lines
    g.append('g')
      .attr('class', 'grid y-grid')
      .call(yAxisGrid)
      .style('stroke', D3_COLORS.BORDER_DEFAULT)
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)

    // Add X grid lines
    g.append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', `translate(0,${String(innerHeight)})`)
      .call(xAxisGrid)
      .style('stroke', D3_COLORS.BORDER_DEFAULT)
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)

    // Create axes
    const xAxis = axisBottom(xScale)
      .tickFormat((domainValue) => {
        if (domainValue instanceof Date) {
          return timeFormat('%b')(domainValue)
        }
        return ''
      })
      .ticks(timeMonth.every(1))

    const yAxis = axisLeft(yScale).tickFormat((d) => {
      if (typeof d === 'number') return String(d)
      return ''
    })

    g.append('g')
      .attr('transform', `translate(0,${String(innerHeight)})`)
      .call(xAxis)
      .style('font-family', FONTS.DATA)
      .style('font-size', '12px')

    g.append('g').call(yAxis).style('font-family', FONTS.DATA).style('font-size', '12px')

    // Add Y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .style('font-family', FONTS.DATA)
      .style('font-size', '14px')
      .style('fill', D3_COLORS.TEXT_MUTED)
      .text('Tariff Rate (%)')

    // Create line generator
    const myLine = line<{ date: Date; rate: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.rate))
      .curve(curveCatmullRom.alpha(0.5))

    // Draw lines
    const lines = g
      .selectAll('.line')
      .data(timeSeriesData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', (d) => myLine(d.values))
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2.5)
      .style('opacity', 0.9)

    // Add May 2025 vertical line
    const mayDate = new Date('2025-05-01')
    g.append('line')
      .attr('class', 'may-2025-line')
      .attr('x1', xScale(mayDate))
      .attr('x2', xScale(mayDate))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', D3_COLORS.TEXT_MUTED)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,3')
      .style('opacity', 0.6)

    // Add May 2025 label
    g.append('text')
      .attr('x', xScale(mayDate))
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-family', FONTS.DATA)
      .style('font-size', '11px')
      .style('fill', D3_COLORS.TEXT_MUTED)
      .text('May 2025')

    // Add dots at data points with hover interactions
    timeSeriesData.forEach((series) => {
      g.selectAll(`.dot-${series.companyId}`)
        .data(series.values)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${series.companyId}`)
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(d.rate))
        .attr('r', 3)
        .attr('fill', series.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .style('opacity', 0)
        .on('mouseenter', function (event: MouseEvent, d) {
          // Enlarge dot on hover
          select(this).transition().duration(200).attr('r', 5).style('opacity', 1)

          // Show tooltip
          if (tooltipRef.current) {
            const content = `
              <div class="tooltip-title">${series.company}</div>
              <div class="tooltip-value">Date: ${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div class="tooltip-value">Tariff Rate: ${d.rate.toFixed(2)}%</div>
            `
            showTooltip(tooltipRef.current, content, event)
          }
        })
        .on('mouseleave', function () {
          // Reset dot size
          select(this).transition().duration(200).attr('r', 3).style('opacity', 0)

          if (tooltipRef.current) {
            hideTooltip(tooltipRef.current)
          }
        })
        .on('mousemove', function (event: MouseEvent) {
          if (tooltipRef.current) {
            tooltipRef.current
              .style('left', `${String(event.pageX + 10)}px`)
              .style('top', `${String(event.pageY - 28)}px`)
          }
        })
    })

    // Remove selected date line - not shown in Figma design

    // Update legend values based on selected date
    const updateSelectedDate = (date: Date) => {
      updateLegend(date)
    }

    // Create legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${String(width - margin.right + 20)},${String(margin.top)})`)

    // Add legend title
    legend
      .append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-family', FONTS.EDITORIAL)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', D3_COLORS.TEXT_PRIMARY)
      .text('Apr 2025')

    const legendItems = legend
      .selectAll('.legend-item')
      .data(timeSeriesData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0,${String(i * 22 + 10)})`)
      .style('cursor', 'pointer')

    // Add legend color dots
    legendItems
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('fill', (d) => d.color)

    // Add legend company names
    legendItems
      .append('text')
      .attr('x', 12)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .style('font-family', FONTS.DATA)
      .style('font-size', '11px')
      .style('fill', D3_COLORS.TEXT_MUTED)
      .text((d) => {
        // Truncate long names
        const name = d.company
        return name.length > 20 ? name.substring(0, 20) + '...' : name
      })

    // Add legend values
    legendItems
      .append('text')
      .attr('class', 'legend-value')
      .attr('x', 140)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .attr('text-anchor', 'end')
      .style('font-family', FONTS.DATA)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', D3_COLORS.TEXT_PRIMARY)

    // Update legend values based on selected date
    const updateLegend = (date: Date) => {
      legendItems.select('.legend-value').text((d) => {
        // Find the closest data point
        const closestValue = d.values.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.date.getTime() - date.getTime())
          const currDiff = Math.abs(curr.date.getTime() - date.getTime())
          return currDiff < prevDiff ? curr : prev
        })
        return `${closestValue.rate.toFixed(1)}%`
      })

      // Keep legend title as Apr 2025 to match Figma
    }

    // Add hover interaction for lines
    legendItems
      .on('mouseenter', function (_, d) {
        // Highlight selected line
        lines.style('opacity', 0.3)
        lines
          .filter((line) => line.companyId === d.companyId)
          .style('opacity', 1)
          .attr('stroke-width', 3.5)

        // Highlight dots for this line
        g.selectAll('.dot').style('opacity', 0.3)
        g.selectAll(`.dot-${d.companyId}`).style('opacity', 1)
      })
      .on('mouseleave', function () {
        // Reset all lines and dots
        lines.style('opacity', 0.9).attr('stroke-width', 2.5)
        g.selectAll('.dot').style('opacity', 1)
      })

    // Initialize with selected date
    updateSelectedDate(selectedDate)

    // Remove interactive overlay - keep chart static like Figma

    // Cleanup on unmount
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove()
        tooltipRef.current = null
      }
    }
  }, [selectedDate, displayCompanies])

  return (
    <Layout currentView="Timeline" badge="TIMELINE">
      <div className={cx('tariff-rate-timeline', layoutStyles.pageContainer)}>
        <div className={cx('chart-header', layoutStyles.chartHeader)}>
          <h3
            className={css({
              margin: 0,
              fontFamily: 'data',
              fontSize: 'base',
              fontWeight: 'medium',
              color: 'text.primary',
              textTransform: 'none',
            })}
          >
            Tariff Rate Increases Over Time
          </h3>
        </div>

        <div
          className={cx(
            'visualization-container',
            css({
              background: 'white',
              padding: '2rem',
              margin: 0,
              minHeight: '480px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }),
          )}
        >
          <svg
            ref={svgRef}
            data-testid="tariff-timeline-svg"
            className={css({ width: '100%', background: 'white' })}
          ></svg>
        </div>

        <div className={cx('timeline-container', layoutStyles.timelineContainer)}>
          <h3 className={timelineStyles.timelineTitle}>Timeline</h3>
          <div className={layoutStyles.timelineWrapper}>
            <input
              id="timeline-slider"
              type="range"
              min={new Date('2025-01-01').getTime()}
              max={new Date('2026-01-01').getTime()}
              value={selectedDate.getTime()}
              onChange={(e) => {
                setSelectedDate(new Date(parseInt(e.target.value)))
              }}
              className={timelineStyles.timelineSlider}
              aria-label="Timeline slider"
            />
            <div className={timelineStyles.timelineLabels}>
              <span>Jan 2025</span>
              <span>Jul 2025</span>
              <span>Jan 2026</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TariffRateTimeline
