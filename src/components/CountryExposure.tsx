import { useState, useMemo, useRef } from 'react'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import { getActiveTariffForDate } from '../utils/tariffCalculations'
import { COUNTRY_COLORS, D3_COLORS } from '../constants/colors'
import { FONTS } from '../constants/fonts'
import { createTooltip, showTooltip, hideTooltip } from '../utils/d3Utils'
import { css, cx } from '../../styled-system/css'
import { typographyStyles, formStyles } from '../styles/shared'
import Layout from './Layout'
import { select, arc as d3Arc } from 'd3'
import type { Selection } from 'd3'

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
  private svg: Selection<SVGSVGElement, unknown, null, undefined>
  private tooltip: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  private width = 900
  private height = 600
  private centerX = 300
  private centerY = this.height / 2
  private outerRadius = 180

  constructor(svgElement: SVGSVGElement) {
    this.svg = select(svgElement)
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

    // Create sunburst-style concentric rings
    const ringWidth = (this.outerRadius - 50) / sortedData.length
    const innerRadius = 50

    // Add rings from inside to outside
    sortedData.forEach((d, i) => {
      const inner = innerRadius + i * ringWidth
      const outer = inner + ringWidth - 3 // Small gap between rings

      const arc = d3Arc<unknown, { innerRadius: number; outerRadius: number }>()
        .innerRadius(inner)
        .outerRadius(outer)
        .startAngle(0)
        .endAngle(2 * Math.PI)

      g.append('path')
        .attr('d', arc({ innerRadius: inner, outerRadius: outer }))
        .attr('fill', COUNTRY_COLORS[d.country] ?? D3_COLORS.DEFAULT_GRAY)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 0.85)
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent) => {
          select(event.currentTarget as SVGPathElement)
            .style('opacity', 1)
            .attr('stroke-width', 3)

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
          select(event.currentTarget as SVGPathElement)
            .style('opacity', 0.85)
            .attr('stroke-width', 2)
          hideTooltip(this.tooltip)
        })
        .on('mousemove', (event: MouseEvent) => {
          this.tooltip
            .style('left', `${String(event.pageX + 10)}px`)
            .style('top', `${String(event.pageY - 28)}px`)
        })
    })

    // Add center circle background
    g.append('circle')
      .attr('r', innerRadius - 5)
      .attr('fill', '#3b82f6')
      .style('opacity', 0.9)

    // Add center company name
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-family', FONTS.EDITORIAL)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text(selectedCompany === 'HP Inc.' ? 'HP' : selectedCompany)

    // Add legend on the right side
    const legendX = this.width - 250
    const legendStartY = 120
    const legendSpacing = 30

    sortedData.forEach((d, i) => {
      const endY = legendStartY + i * legendSpacing

      // Start from center (0, 0) for all lines
      const startX = 0
      const startY = 0

      // Create curved leader line path from center to legend
      const controlX = this.outerRadius + 40
      const endXRelative = legendX - this.centerX - 20
      const endYRelative = endY - this.centerY

      const path = `M ${String(startX)} ${String(startY)} C ${String(controlX)} ${String(startY)}, ${String(endXRelative - 40)} ${String(endYRelative)}, ${String(endXRelative)} ${String(endYRelative)}`

      g.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', D3_COLORS.AXIS_LINE)
        .attr('stroke-width', 1.5)
        .style('opacity', 0.4)

      // Add colored dot
      this.svg
        .append('circle')
        .attr('cx', legendX - 20)
        .attr('cy', endY)
        .attr('r', 5)
        .attr('fill', COUNTRY_COLORS[d.country] ?? D3_COLORS.DEFAULT_GRAY)

      // Add country name
      this.svg
        .append('text')
        .attr('x', legendX - 5)
        .attr('y', endY)
        .attr('dy', '0.32em')
        .style('font-family', FONTS.DATA)
        .style('font-size', '12px')
        .style('fill', D3_COLORS.TEXT_PRIMARY)
        .text(d.country)

      // Add revenue value
      this.svg
        .append('text')
        .attr('x', this.width - 20)
        .attr('y', endY)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .style('font-family', FONTS.DATA)
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', D3_COLORS.TEXT_MUTED)
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
    <Layout
      showBackButton
      currentView="Percentage Share"
      toggleOptions={{
        left: 'Percentage',
        right: 'Dollar Volume',
        current: 'left',
        onToggle: () => {
          // Toggle functionality to be implemented
        },
      }}
    >
      <div
        className={cx(
          'country-exposure',
          css({
            background: 'bg.secondary',
            minHeight: '100vh',
            padding: 0,
            margin: 0,
          }),
        )}
      >
        <div
          className={cx(
            'controls-section',
            css({
              background: 'white',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid',
              borderColor: 'border.DEFAULT',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }),
          )}
        >
          <div
            className={cx('company-info', typographyStyles.dataValue, css({ fontSize: 'base' }))}
          >
            <span>Company: </span>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value)
              }}
              className={formStyles.inlineSelect}
            >
              <option value="all">All Companies</option>
              {techCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <p
            className={cx(
              typographyStyles.dataLabel,
              css({
                margin: '0.5rem 0 0 0',
                fontSize: 'sm',
              }),
            )}
          >
            Total: ${Math.round(exposureData.reduce((sum, d) => sum + d.totalRevenue, 0) / 1e6)}M
          </p>
        </div>

        <div
          className={cx(
            'visualization-container',
            css({
              background: 'white',
              padding: '2rem',
              margin: 0,
              minHeight: '600px',
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }),
          )}
        >
          <svg
            ref={svgRefCallback}
            data-testid="country-exposure-svg"
            className={css({
              width: '100%',
              height: 'auto',
              background: 'white',
              display: 'block',
            })}
          ></svg>
        </div>

        <div
          className={cx(
            'timeline-container',
            css({
              background: 'white',
              borderTop: '1px solid',
              borderColor: 'border.DEFAULT',
              padding: '2rem',
            }),
          )}
        >
          <h3
            className={cx(
              typographyStyles.editorialDisplay,
              css({
                margin: '0 0 1rem 0',
                fontSize: 'sm',
                letterSpacing: 'wider',
              }),
            )}
          >
            Timeline
          </h3>
          <div className={css({ position: 'relative' })}>
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
              className={formStyles.timelineSlider}
            />
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
                fontFamily: 'data',
                fontSize: 'xs',
                color: 'text.muted',
              })}
            >
              <span>Jan 2025</span>
              <span>Jul 2025</span>
              <span>Jan 2026</span>
              <span>Dec 2026</span>
            </div>
          </div>
          <div
            className={cx(
              'timeline-info',
              typographyStyles.dataLabel,
              css({
                marginTop: '1rem',
                fontSize: 'sm',
                color: 'text.primary',
              }),
            )}
          >
            <span>Legend</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CountryExposure
