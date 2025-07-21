import { useState, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { techCompanies } from '../data/techCompanies'
import { tariffTimeline } from '../data/tariffSchedules'
import {
  calculateAllCompaniesImpact,
  formatCurrency,
  getDateRange
} from '../utils/tariffCalculations'
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
  const dateRange = useMemo(() => getDateRange(tariffTimeline), [])
  
  // Start with current date (Sep 2025)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-09-01'))
  
  const impacts = useMemo(
    () => calculateAllCompaniesImpact(techCompanies, selectedDate, tariffTimeline),
    [selectedDate]
  )

  // Create visualization
  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 600
    const margin = { top: 40, right: 40, bottom: 60, left: 40 }

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width.toString()} ${height.toString()}`)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left.toString()},${margin.top.toString()})`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Sort by impact and get top companies
    const sortedImpacts = [...impacts].sort((a, b) => b.tariffImpact - a.tariffImpact)
    const topCompanies = sortedImpacts.slice(0, 10)

    // Create scales
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(topCompanies, d => d.tariffImpact) ?? 0])
      .range([20, 80])

    const colorScale = d3.scaleSequential()
      .domain([0, 20]) // 0% to 20% impact
      .interpolator(t => {
        // Custom interpolation: green -> orange -> red
        if (t < 0.5) {
          return d3.interpolateRgb('#82ca9d', '#FFA500')(t * 2)
        } else {
          return d3.interpolateRgb('#FFA500', '#DC143C')((t - 0.5) * 2)
        }
      })

    // Create force simulation
    const simulationData = topCompanies as SimulationNode[]
    const simulation = d3.forceSimulation(simulationData)
      .force('x', d3.forceX(innerWidth / 2).strength(0.1))
      .force('y', d3.forceY(innerHeight / 2).strength(0.1))
      .force('collide', d3.forceCollide((d: SimulationNode) => {
        return radiusScale(d.tariffImpact) + 5
      }))
      .force('charge', d3.forceManyBody().strength(-100))

    // Create company groups
    const companyGroups = g.selectAll('.company-bubble')
      .data(simulationData)
      .enter()
      .append('g')
      .attr('class', 'company-bubble')

    // Add circles
    companyGroups.append('circle')
      .attr('r', d => radiusScale(d.tariffImpact))
      .attr('fill', d => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return colorScale(impactPercentage)
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Add company names
    companyGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .style('font-family', 'ABC Monument Grotesk, Inter, system-ui, -apple-system, sans-serif')
      .style('font-size', '14px')
      .style('font-weight', '700')
      .style('letter-spacing', '-0.01em')
      .style('fill', '#fff')
      .text(d => {
        const company = techCompanies.find(c => c.name === d.company)
        return company?.name ?? ''
      })

    // Add impact amount
    companyGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-family', 'Inter, system-ui, -apple-system, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('font-variant-numeric', 'tabular-nums')
      .style('fill', '#fff')
      .text(d => {
        const impactPercentage = (d.tariffImpact / d.baseRevenue) * 100
        return `${impactPercentage.toFixed(1)}%`
      })

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')

    companyGroups
      .on('mouseover', function(event, d) {
        const company = techCompanies.find(c => c.name === d.company)
        if (!company) return

        tooltip.transition()
          .duration(200)
          .style('opacity', .9)

        tooltip.html(`
          <strong style="font-family: ABC Monument Grotesk, Inter, system-ui, -apple-system, sans-serif; font-weight: 700;">${company.name}</strong><br/>
          <span style="font-family: Inter, system-ui, -apple-system, sans-serif;">Base Revenue: ${formatCurrency(d.baseRevenue)}</span><br/>
          <span style="font-family: Inter, system-ui, -apple-system, sans-serif;">Tariff Impact: ${formatCurrency(d.tariffImpact)}</span><br/>
          <span style="font-family: Inter, system-ui, -apple-system, sans-serif;">Net Revenue: ${formatCurrency(d.netRevenue)}</span>
        `)
          .style('left', `${((event as MouseEvent).pageX + 10).toString()}px`)
          .style('top', `${((event as MouseEvent).pageY - 28).toString()}px`)
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })

    // Run simulation
    simulation.on('tick', () => {
      companyGroups.attr('transform', (d: SimulationNode) => {
        return `translate(${(d.x ?? 0).toString()},${(d.y ?? 0).toString()})`
      })
    })

    // Cleanup on unmount
    return () => {
      tooltip.remove()
    }
  }, [impacts])


  // Calculate total impact
  const totalImpact = impacts.reduce((sum, i) => sum + i.tariffImpact, 0)

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
        <p className="date-display">Sep 2025</p>
      </div>

      <div className="visualization-container">
        <svg ref={svgRef}></svg>
        
        <div className="legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#82ca9d' }}></span>
              <span>Low Impact (0-5%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#FFA500' }}></span>
              <span>Medium Impact (5-10%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#DC143C' }}></span>
              <span>High Impact (10%+)</span>
            </div>
          </div>
          <div className="total-impact">
            <strong>Total Impact: </strong>
            <span style={{ color: '#DC143C' }}>{formatCurrency(totalImpact)}</span>
          </div>
        </div>
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
            onChange={(e) => { setSelectedDate(new Date(parseInt(e.target.value))) }}
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
          Legend - {selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

export default AnticipatedTariffImpact