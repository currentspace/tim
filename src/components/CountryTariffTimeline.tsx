import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { tariffTimeline } from '../data/tariffSchedules'
import { COUNTRY_COLORS } from '../constants/colors'
import { createTooltip, showTooltip, hideTooltip } from '../utils/d3Utils'
import './CountryTariffTimeline.css'

interface CountryTimeSeries {
  country: string
  countryId: string
  values: {
    date: Date
    rate: number
  }[]
  color: string
}

function CountryTariffTimeline() {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> | null>(
    null,
  )
  const [selectedDate, setSelectedDate] = useState(new Date('2025-06-01'))

  useEffect(() => {
    if (!svgRef.current) return

    const width = 900
    const height = 500
    const margin = { top: 40, right: 200, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${String(width)} ${String(height)}`)

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${String(margin.left)},${String(margin.top)})`)

    // Create tooltip if not exists
    tooltipRef.current ??= createTooltip()

    // Prepare time series data for each country
    const timeSeriesData: CountryTimeSeries[] = []

    // Get all unique countries from tariff schedules
    const countries = new Set<string>()
    tariffTimeline.forEach((schedule) => {
      Object.keys(schedule.rates).forEach((country) => {
        countries.add(country)
      })
    })

    // Get date range
    const dates = tariffTimeline.map((t) => new Date(t.date))
    const minDate = d3.min(dates) ?? new Date('2025-01-01')
    const maxDate = d3.max(dates) ?? new Date('2026-01-01')

    // Generate time series for each country
    Array.from(countries).forEach((country) => {
      const values = tariffTimeline.map((schedule) => ({
        date: new Date(schedule.date),
        rate: schedule.rates[country] ?? 0,
      }))

      timeSeriesData.push({
        country,
        countryId: country.toLowerCase().replace(/\s+/g, '-'),
        values,
        color: COUNTRY_COLORS[country] ?? '#888888',
      })
    })

    // Sort countries alphabetically
    timeSeriesData.sort((a, b) => a.country.localeCompare(b.country))

    // Create scales
    const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([0, 28]) // 0-28% as shown in screenshot
      .range([innerHeight, 0])

    // Create grid lines
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(7)

    const xAxisGrid = d3
      .axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(() => '')
      .ticks(d3.timeMonth.every(1))

    // Add Y grid lines
    g.append('g')
      .attr('class', 'grid y-grid')
      .call(yAxisGrid)
      .style('stroke', '#e0e0e0')
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)

    // Add X grid lines
    g.append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', `translate(0,${String(innerHeight)})`)
      .call(xAxisGrid)
      .style('stroke', '#e0e0e0')
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((domainValue) => {
        if (domainValue instanceof Date) {
          return d3.timeFormat('%b %Y')(domainValue)
        }
        return ''
      })
      .ticks(d3.timeMonth.every(2))

    const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
      if (typeof d === 'number') return String(d)
      return ''
    })

    g.append('g')
      .attr('transform', `translate(0,${String(innerHeight)})`)
      .call(xAxis)
      .style('font-family', 'var(--font-data)')
      .style('font-size', '12px')
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')

    g.append('g').call(yAxis).style('font-family', 'var(--font-data)').style('font-size', '12px')

    // Add Y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '14px')
      .style('fill', '#666')
      .text('Tariff Rate (%)')

    // Create line generator
    const line = d3
      .line<{ date: Date; rate: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.rate))
      .curve(d3.curveMonotoneX)

    // Draw lines
    const lines = g
      .selectAll('.line')
      .data(timeSeriesData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .style('opacity', 0.8)

    // Add dots at data points with hover interactions
    timeSeriesData.forEach((series) => {
      g.selectAll(`.dot-${series.countryId}`)
        .data(series.values)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${series.countryId}`)
        .attr('cx', (d) => xScale(d.date))
        .attr('cy', (d) => yScale(d.rate))
        .attr('r', 4)
        .attr('fill', series.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event: MouseEvent, d) {
          // Enlarge dot on hover
          d3.select(this).transition().duration(200).attr('r', 6)

          // Show tooltip
          if (tooltipRef.current) {
            const content = `
              <div class="tooltip-title">${series.country}</div>
              <div class="tooltip-value">Date: ${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div class="tooltip-value">Tariff Rate: ${String(d.rate)}%</div>
            `
            showTooltip(tooltipRef.current, content, event)
          }
        })
        .on('mouseleave', function () {
          // Reset dot size
          d3.select(this).transition().duration(200).attr('r', 4)

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

    // Add vertical line for selected date
    const selectedLine = g
      .append('line')
      .attr('class', 'selected-date-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,2')
      .style('opacity', 0.5)

    // Update selected date line position
    const updateSelectedDate = (date: Date) => {
      selectedLine.attr('x1', xScale(date)).attr('x2', xScale(date))

      // Update legend values
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
      .style('font-family', 'var(--font-heading)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#333')
      .text(selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))

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

    // Add legend country names
    legendItems
      .append('text')
      .attr('x', 12)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text((d) => d.country)

    // Add legend values
    legendItems
      .append('text')
      .attr('class', 'legend-value')
      .attr('x', 140)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .attr('text-anchor', 'end')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', (d) => d.color)

    // Update legend values based on selected date
    const updateLegend = (date: Date) => {
      legendItems.select('.legend-value').text((d) => {
        // Find the closest data point
        const closestValue = d.values.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.date.getTime() - date.getTime())
          const currDiff = Math.abs(curr.date.getTime() - date.getTime())
          return currDiff < prevDiff ? curr : prev
        })
        return `${String(closestValue.rate)}%`
      })

      // Update legend title with selected date
      legend
        .select('text')
        .text(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
    }

    // Add hover interaction for lines
    legendItems
      .on('mouseenter', function (_, d) {
        // Highlight selected line
        lines.style('opacity', 0.2)
        lines
          .filter((line) => line.countryId === d.countryId)
          .style('opacity', 1)
          .attr('stroke-width', 3)

        // Highlight dots for this line
        g.selectAll('.dot').style('opacity', 0.3)
        g.selectAll(`.dot-${d.countryId}`).style('opacity', 1)
      })
      .on('mouseleave', function () {
        // Reset all lines and dots
        lines.style('opacity', 0.8).attr('stroke-width', 2)
        g.selectAll('.dot').style('opacity', 1)
      })

    // Initialize with selected date
    updateSelectedDate(selectedDate)

    // Add interactive overlay for date selection
    const overlay = g
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .style('cursor', 'crosshair')

    overlay.on('mousemove click', function (event) {
      const [mouseX] = d3.pointer(event)
      const date = xScale.invert(mouseX)
      setSelectedDate(date)
      updateSelectedDate(date)
    })

    // Cleanup on unmount
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove()
        tooltipRef.current = null
      }
    }
  }, [selectedDate])

  return (
    <div className="country-tariff-timeline">
      <div className="header">
        <div className="header-content">
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
          <div className="navigation">
            <span className="nav-item active">Country</span>
            <span className="nav-item">Company</span>
          </div>
        </div>
      </div>

      <div className="chart-header">
        <h3>Tariff Rate Increases Over Time</h3>
      </div>

      <div className="visualization-container">
        <svg ref={svgRef}></svg>
      </div>

      <div className="timeline-container">
        <h3>Timeline</h3>
        <div className="timeline-wrapper">
          <input
            id="timeline-slider"
            type="range"
            min={new Date('2025-01-01').getTime()}
            max={new Date('2026-01-01').getTime()}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryTariffTimeline

