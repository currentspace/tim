import { useRef, useState } from 'react'
import * as d3 from 'd3'
import { NetworkData } from '../types/network'
import './NetworkGraph.css'

interface NetworkGraphProps {
  data: NetworkData
  width?: number
  height?: number
  linkDistance: number
  chargeStrength: number
  collisionRadius: number
  centerStrength: number
}

// Initialize D3 visualization outside of component lifecycle
class D3NetworkVisualization {
  private simulation: d3.Simulation<any, any> | null = null
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
  private g: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
  private nodes: any[] = []
  private links: any[] = []
  private nodeElements: d3.Selection<any, any, any, any> | null = null
  private linkElements: d3.Selection<any, any, any, any> | null = null

  initialize(
    svgElement: SVGSVGElement,
    data: NetworkData,
    width: number,
    height: number,
    params: {
      linkDistance: number
      chargeStrength: number
      collisionRadius: number
      centerStrength: number
    },
    callbacks: {
      onHover: (nodeId: string | null) => void
    }
  ) {
    if (this.simulation) return // Already initialized

    this.svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)

    // Create main group for zoom/pan
    this.g = this.svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        this.g?.attr('transform', event.transform)
      })

    this.svg.call(zoom)

    // Create a copy of nodes and links
    this.nodes = data.nodes.map(d => ({ ...d }))
    this.links = data.links.map(d => ({ ...d }))

    // Define positions for different node types
    const vcX = width * 0.15
    const startupX = width * 0.5
    const founderX = width * 0.85

    // Initialize node positions
    this.nodes.forEach((node: any) => {
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
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links)
        .id((d: any) => d.id)
        .distance(params.linkDistance)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(params.chargeStrength))
      .force('x', d3.forceX()
        .x((d: any) => {
          if (d.type === 'vc') return vcX
          if (d.type === 'startup') return startupX
          if (d.type === 'founder') return founderX
          return width / 2
        })
        .strength(0.2))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(params.collisionRadius))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(params.centerStrength))

    // Create gradients
    const defs = this.svg.append('defs')
    this.links.forEach((link: any, i) => {
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
    this.linkElements = this.g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(this.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('stroke', (_, i) => `url(#gradient-${i})`)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value / 10000000))
      .attr('fill', 'none')
      .attr('opacity', 0.4)

    // Create nodes
    this.nodeElements = this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)))

    // Add circles
    this.nodeElements.append('circle')
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
        callbacks.onHover(d.id)
        this.highlightConnections(d.id)
      })
      .on('mouseout', () => {
        callbacks.onHover(null)
        this.resetHighlight()
      })

    // Add labels
    this.nodeElements.append('text')
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
    this.simulation.on('tick', () => {
      this.linkElements?.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy) * 2
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })

      this.links.forEach((link: any, i) => {
        d3.select(`#gradient-${i}`)
          .attr('x1', link.source.x)
          .attr('y1', link.source.y)
          .attr('x2', link.target.x)
          .attr('y2', link.target.y)
      })

      this.nodeElements?.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })
  }

  updateParams(params: {
    linkDistance: number
    chargeStrength: number
    collisionRadius: number
    centerStrength: number
  }) {
    if (!this.simulation) return

    this.simulation
      .force('link', d3.forceLink(this.links)
        .id((d: any) => d.id)
        .distance(params.linkDistance)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(params.chargeStrength))
      .force('collision', d3.forceCollide().radius(params.collisionRadius))
      .alpha(0.3)
      .restart()
  }

  private highlightConnections(nodeId: string) {
    this.linkElements?.attr('opacity', (l: any) => 
      l.source.id === nodeId || l.target.id === nodeId ? 0.8 : 0.1
    )
    this.nodeElements?.attr('opacity', (n: any) => {
      const isConnected = this.links.some((l: any) => 
        (l.source.id === nodeId && l.target.id === n.id) ||
        (l.target.id === nodeId && l.source.id === n.id) ||
        n.id === nodeId
      )
      return isConnected ? 1 : 0.3
    })
  }

  private resetHighlight() {
    this.linkElements?.attr('opacity', 0.4)
    this.nodeElements?.attr('opacity', 1)
  }

  private dragstarted(event: any, d: any) {
    if (!event.active) this.simulation?.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  private dragged(event: any, d: any) {
    d.fx = event.x
    d.fy = event.y
  }

  private dragended(event: any, d: any) {
    if (!event.active) this.simulation?.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  destroy() {
    this.simulation?.stop()
    this.svg?.selectAll('*').remove()
  }
}

function NetworkGraphV3({
  data,
  width = 1200,
  height = 800,
  linkDistance,
  chargeStrength,
  collisionRadius,
  centerStrength,
}: NetworkGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const visualizationRef = useRef<D3NetworkVisualization | null>(null)
  const isInitializedRef = useRef(false)

  // Use callback ref to initialize when DOM is ready
  const svgRefCallback = (node: SVGSVGElement | null) => {
    if (node && !isInitializedRef.current) {
      isInitializedRef.current = true
      
      if (!visualizationRef.current) {
        visualizationRef.current = new D3NetworkVisualization()
      }
      
      visualizationRef.current.initialize(
        node,
        data,
        width,
        height,
        { linkDistance, chargeStrength, collisionRadius, centerStrength },
        { onHover: setHoveredNode }
      )
    }
  }

  // Update parameters when they change
  if (visualizationRef.current && isInitializedRef.current) {
    visualizationRef.current.updateParams({ linkDistance, chargeStrength, collisionRadius, centerStrength })
  }

  return (
    <div className="network-graph-container">
      <svg ref={svgRefCallback} className="network-graph">
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

export default NetworkGraphV3