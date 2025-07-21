import { useRef, useState, useMemo } from 'react'
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

// D3 visualization class
class CountryTariffVisualization {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private width = 900
  private height = 500
  private margin = { top: 40, right: 200, bottom: 60, left: 60 }
  private innerWidth = this.width - this.margin.left - this.margin.right
  private innerHeight = this.height - this.margin.top - this.margin.bottom
  private g!: d3.Selection<SVGGElement, unknown, null, undefined>
  private selectedLine!: d3.Selection<SVGLineElement, unknown, null, undefined>
  private xScale!: d3.ScaleTime<number, number>
  private yScale!: d3.ScaleLinear<number, number>
  private legendItems!: d3.Selection<SVGGElement, CountryTimeSeries, SVGGElement, unknown>
  private lines!: d3.Selection<SVGPathElement, CountryTimeSeries, SVGGElement, unknown>
  private onDateChange: (date: Date) => void

  constructor(svgElement: SVGSVGElement, onDateChange: (date: Date) => void) {
    this.svg = d3.select(svgElement)
    this.tooltip = createTooltip()
    this.onDateChange = onDateChange
    this.initializeSvg()
  }

  private initializeSvg() {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${String(this.width)} ${String(this.height)}`)

    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${String(this.margin.left)},${String(this.margin.top)})`)
  }

  update(timeSeriesData: CountryTimeSeries[], selectedDate: Date) {
    // Clear previous content except the main group
    this.g.selectAll('*').remove()

    // Get date range
    const dates = tariffTimeline.map((t) => new Date(t.date))
    const minDate = d3.min(dates) ?? new Date('2025-01-01')
    const maxDate = d3.max(dates) ?? new Date('2026-01-01')

    // Create scales
    this.xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, this.innerWidth])
    this.yScale = d3.scaleLinear().domain([0, 28]).range([this.innerHeight, 0])

    // Create grid lines
    this.createGridLines()
    // Create axes
    this.createAxes()
    // Create line chart
    this.createLineChart(timeSeriesData)
    // Create interactive elements
    this.createInteractiveElements(timeSeriesData, selectedDate)
    // Create legend
    this.createLegend(timeSeriesData, selectedDate)
  }

  private createGridLines() {
    const yAxisGrid = d3
      .axisLeft(this.yScale)
      .tickSize(-this.innerWidth)
      .tickFormat(() => '')
      .ticks(7)

    const xAxisGrid = d3
      .axisBottom(this.xScale)
      .tickSize(-this.innerHeight)
      .tickFormat(() => '')
      .ticks(d3.timeMonth.every(1))

    this.g.append('g')
      .attr('class', 'grid y-grid')
      .call(yAxisGrid)
      .style('stroke', '#e0e0e0')
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)

    this.g.append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', `translate(0,${String(this.innerHeight)})`)
      .call(xAxisGrid)
      .style('stroke', '#e0e0e0')
      .style('stroke-dasharray', '1,1')
      .style('opacity', 0.5)
  }

  private createAxes() {
    const xAxis = d3
      .axisBottom(this.xScale)
      .tickFormat((domainValue) => {
        if (domainValue instanceof Date) {
          return d3.timeFormat('%b %Y')(domainValue)
        }
        return ''
      })
      .ticks(d3.timeMonth.every(2))

    const yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {
      if (typeof d === 'number') return String(d)
      return ''
    })

    this.g.append('g')
      .attr('transform', `translate(0,${String(this.innerHeight)})`)
      .call(xAxis)
      .style('font-family', 'var(--font-data)')
      .style('font-size', '12px')
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')

    this.g.append('g')
      .call(yAxis)
      .style('font-family', 'var(--font-data)')
      .style('font-size', '12px')

    // Add Y-axis label
    this.g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -this.innerHeight / 2)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '14px')
      .style('fill', '#666')
      .text('Tariff Rate (%)')
  }

  private createLineChart(timeSeriesData: CountryTimeSeries[]) {
    // Create line generator
    const line = d3
      .line<{ date: Date; rate: number }>()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.rate))
      .curve(d3.curveMonotoneX)

    // Draw lines
    this.lines = this.g
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

    // Add dots at data points
    timeSeriesData.forEach((series) => {
      this.g.selectAll(`.dot-${series.countryId}`)
        .data(series.values)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${series.countryId}`)
        .attr('cx', (d) => this.xScale(d.date))
        .attr('cy', (d) => this.yScale(d.rate))
        .attr('r', 4)
        .attr('fill', series.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent, d) => {
          // Enlarge dot on hover
          d3.select(event.currentTarget as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 6)

          // Show tooltip
          const content = `
            <div class="tooltip-title">${series.country}</div>
            <div class="tooltip-value">Date: ${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div class="tooltip-value">Tariff Rate: ${String(d.rate)}%</div>
          `
          showTooltip(this.tooltip, content, event)
        })
        .on('mouseleave', (event: MouseEvent) => {
          // Reset dot size
          d3.select(event.currentTarget as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 4)

          hideTooltip(this.tooltip)
        })
        .on('mousemove', (event: MouseEvent) => {
          this.tooltip
            .style('left', `${String(event.pageX + 10)}px`)
            .style('top', `${String(event.pageY - 28)}px`)
        })
    })
  }

  private createInteractiveElements(_timeSeriesData: CountryTimeSeries[], selectedDate: Date) {
    // Add vertical line for selected date
    this.selectedLine = this.g
      .append('line')
      .attr('class', 'selected-date-line')
      .attr('y1', 0)
      .attr('y2', this.innerHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,2')
      .style('opacity', 0.5)

    // Update selected date line position
    this.updateSelectedDate(selectedDate)

    // Add interactive overlay for date selection
    const overlay = this.g
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .style('cursor', 'crosshair')

    overlay.on('mousemove click', (event) => {
      const [mouseX] = d3.pointer(event)
      const date = this.xScale.invert(mouseX)
      this.onDateChange(date)
      this.updateSelectedDate(date)
    })
  }

  private createLegend(timeSeriesData: CountryTimeSeries[], selectedDate: Date) {
    // Create legend
    const legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${String(this.width - this.margin.right + 20)},${String(this.margin.top)})`)

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

    this.legendItems = legend
      .selectAll('.legend-item')
      .data(timeSeriesData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0,${String(i * 22 + 10)})`)
      .style('cursor', 'pointer')

    // Add legend color dots
    this.legendItems
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('fill', (d) => d.color)

    // Add legend country names
    this.legendItems
      .append('text')
      .attr('x', 12)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text((d) => d.country)

    // Add legend values
    this.legendItems
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

    // Update legend values
    this.updateLegend(selectedDate)

    // Add hover interaction for lines
    this.legendItems
      .on('mouseenter', (_, d) => {
        // Highlight selected line
        this.lines.style('opacity', 0.2)
        this.lines
          .filter((line) => line.countryId === d.countryId)
          .style('opacity', 1)
          .attr('stroke-width', 3)

        // Highlight dots for this line
        this.g.selectAll('.dot').style('opacity', 0.3)
        this.g.selectAll(`.dot-${d.countryId}`).style('opacity', 1)
      })
      .on('mouseleave', () => {
        // Reset all lines and dots
        this.lines.style('opacity', 0.8).attr('stroke-width', 2)
        this.g.selectAll('.dot').style('opacity', 1)
      })
  }

  private updateSelectedDate(date: Date) {
    this.selectedLine.attr('x1', this.xScale(date)).attr('x2', this.xScale(date))
    this.updateLegend(date)
  }

  private updateLegend(date: Date) {
    this.legendItems.select('.legend-value').text((d) => {
      // Find the closest data point
      const closestValue = d.values.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.date.getTime() - date.getTime())
        const currDiff = Math.abs(curr.date.getTime() - date.getTime())
        return currDiff < prevDiff ? curr : prev
      })
      return `${String(closestValue.rate)}%`
    })

    // Update legend title with selected date
    this.svg
      .select('.legend text')
      .text(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
  }

  destroy() {
    this.tooltip.remove()
  }
}

function CountryTariffTimeline() {
  const visualizationRef = useRef<CountryTariffVisualization | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-06-01'))

  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    const data: CountryTimeSeries[] = []

    // Get all unique countries from tariff schedules
    const countries = new Set<string>()
    tariffTimeline.forEach((schedule) => {
      Object.keys(schedule.rates).forEach((country) => {
        countries.add(country)
      })
    })

    // Generate time series for each country
    Array.from(countries).forEach((country) => {
      const values = tariffTimeline.map((schedule) => ({
        date: new Date(schedule.date),
        rate: schedule.rates[country] ?? 0,
      }))

      data.push({
        country,
        countryId: country.toLowerCase().replace(/\s+/g, '-'),
        values,
        color: COUNTRY_COLORS[country] ?? '#888888',
      })
    })

    // Sort countries alphabetically
    return data.sort((a, b) => a.country.localeCompare(b.country))
  }, [])

  // Callback ref for SVG element - called when DOM element is attached/detached
  const svgRefCallback = (node: SVGSVGElement | null) => {
    if (node) {
      if (!visualizationRef.current) {
        visualizationRef.current = new CountryTariffVisualization(node, setSelectedDate)
        setIsInitialized(true)
      }
      visualizationRef.current.update(timeSeriesData, selectedDate)
    } else if (visualizationRef.current) {
      visualizationRef.current.destroy()
      visualizationRef.current = null
      setIsInitialized(false)
    }
  }

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
        <svg ref={svgRefCallback}></svg>
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
