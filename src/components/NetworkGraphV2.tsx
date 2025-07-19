import { useRef, useState, use } from 'react'
import * as d3 from 'd3'
import { NetworkData } from '../types/network'
import './NetworkGraph.css'

interface NetworkGraphProps {
  dataPromise: Promise<NetworkData>
  width?: number
  height?: number
  linkDistance: number
  chargeStrength: number
  collisionRadius: number
  centerStrength: number
}

function NetworkGraphV2({
  dataPromise,
  width = 1200,
  height = 800,
  linkDistance,
  chargeStrength,
  collisionRadius,
  centerStrength,
}: NetworkGraphProps) {
  const data = use(dataPromise)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null)
  const isInitialized = useRef(false)

  // Setup D3 visualization on mount
  if (svgRef.current && !isInitialized.current) {
    isInitialized.current = true
    setupVisualization()
  }

  // Update simulation parameters when props change
  if (simulationRef.current) {
    simulationRef.current
      .force('link', d3.forceLink()
        .id((d: any) => d.id)
        .distance(linkDistance)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('collision', d3.forceCollide().radius(collisionRadius))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
      .alpha(0.3)
      .restart()
  }

  function setupVisualization() {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Create main group for zoom/pan
    const g = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create a copy of nodes and links to avoid mutating original data
    const nodes = data.nodes.map(d => ({ ...d }))
    const links = data.links.map(d => ({ ...d }))

    // Define positions for different node types
    const vcX = width * 0.15
    const startupX = width * 0.5
    const founderX = width * 0.85

    // Initialize node positions based on type
    nodes.forEach((node: any) => {
      if (node.type === 'vc') {
        node.x = vcX + (Math.random() - 0.5) * 100
        node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
      } else if (node.type === 'startup') {
        node.x = startupX + (Math.random() - 0.5) * 200
        node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
      } else if (node.type === 'founder') {
        node.x = founderX + (Math.random() - 0.5) * 100
        node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
      }
    })

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any)
        .id((d: any) => d.id)
        .distance(linkDistance)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('x', d3.forceX()
        .x((d: any) => {
          if (d.type === 'vc') return vcX
          if (d.type === 'startup') return startupX
          if (d.type === 'founder') return founderX
          return width / 2
        })
        .strength(0.2))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(collisionRadius))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))

    simulationRef.current = simulation

    // Create gradient definitions for links
    const defs = svg.append('defs')

    // Add gradients for each link
    links.forEach((link: any, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', link.type === 'investment' ? '#646cff' : '#82ca9d')
        .attr('stop-opacity', 0.6)

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', link.type === 'investment' ? '#8884d8' : '#82ca9d')
        .attr('stop-opacity', 0.2)
    })

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('stroke', (_, i) => `url(#gradient-${i})`)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value / 10000000))
      .attr('fill', 'none')
      .attr('opacity', 0.4)

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add circles for nodes
    node.append('circle')
      .attr('r', (d: any) => {
        if (d.type === 'vc') return 8 + Math.sqrt(d.investments)
        if (d.type === 'startup') return 10 + Math.sqrt(d.fundingAmount / 10000000)
        if (d.type === 'founder') return 6 + d.companies * 2
        return 10
      })
      .attr('fill', (d: any) => {
        if (d.type === 'vc') return '#646cff'
        if (d.type === 'startup') return '#8884d8'
        if (d.type === 'founder') return '#82ca9d'
        return '#666'
      })
      .attr('opacity', 0.8)
      .on('mouseover', (_, d: any) => {
        setHoveredNode(d.id)
        // Highlight connected nodes
        link.attr('opacity', (l: any) => 
          l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
        )
        node.attr('opacity', (n: any) => {
          const isConnected = links.some((l: any) => 
            (l.source.id === d.id && l.target.id === n.id) ||
            (l.target.id === d.id && l.source.id === n.id) ||
            n.id === d.id
          )
          return isConnected ? 1 : 0.3
        })
      })
      .on('mouseout', () => {
        setHoveredNode(null)
        link.attr('opacity', 0.4)
        node.attr('opacity', 1)
      })

    // Add labels for nodes
    node.append('text')
      .text((d: any) => d.name)
      .attr('x', (d: any) => {
        if (d.type === 'vc') return -15
        if (d.type === 'founder') return 15
        return 0
      })
      .attr('y', 4)
      .attr('text-anchor', (d: any) => {
        if (d.type === 'vc') return 'end'
        if (d.type === 'founder') return 'start'
        return 'middle'
      })
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .attr('pointer-events', 'none')

    // Update positions on tick
    simulation.on('tick', () => {
      // Update link positions with curves
      link.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy) * 2
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })

      // Update link gradients
      links.forEach((link: any, i) => {
        d3.select(`#gradient-${i}`)
          .attr('x1', link.source.x)
          .attr('y1', link.source.y)
          .attr('x2', link.target.x)
          .attr('y2', link.target.y)
      })

      // Update node positions
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }

  return (
    <div className="network-graph-container">
      <svg ref={svgRef} className="network-graph">
        <rect width={width} height={height} fill="#fafafa" />
      </svg>
      {hoveredNode && (
        <div className="tooltip">
          {data.nodes.find(n => n.id === hoveredNode)?.name}
        </div>
      )}
    </div>
  )
}

export default NetworkGraphV2