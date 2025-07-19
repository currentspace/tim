import { useRef, useState } from 'react'
import * as d3 from 'd3'
import { NetworkData } from '../types/network'
import { SimulationNode, SimulationLink } from '../types/d3-network'
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

// Type guard to check if source/target is a node
function isNode(value: SimulationNode | string): value is SimulationNode {
  return typeof value === 'object'
}

// Initialize D3 visualization outside of component lifecycle
class D3NetworkVisualization {
  private simulation: d3.Simulation<SimulationNode, SimulationLink> | null = null
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
  private g: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
  private nodes: SimulationNode[] = []
  private links: SimulationLink[] = []
  private nodeElements: d3.Selection<SVGGElement, SimulationNode, SVGGElement, unknown> | null =
    null
  private linkElements: d3.Selection<SVGPathElement, SimulationLink, SVGGElement, unknown> | null =
    null

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
    },
  ) {
    if (this.simulation) return // Already initialized

    this.svg = d3.select(svgElement).attr('width', width).attr('height', height)

    // Create main group for zoom/pan
    this.g = this.svg.append('g')

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.g?.attr('transform', event.transform.toString())
      })

    this.svg.call(zoom)

    // Create a copy of nodes and links
    this.nodes = data.nodes.map((d) => ({ ...d })) as SimulationNode[]
    this.links = data.links.map((d) => ({ ...d })) as SimulationLink[]

    // Define positions for different node types
    const vcX = width * 0.15
    const startupX = width * 0.5
    const founderX = width * 0.85

    // Initialize node positions
    this.nodes.forEach((node) => {
      switch (node.type) {
        case 'vc':
          node.x = vcX + (Math.random() - 0.5) * 100
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
          break
        case 'startup':
          node.x = startupX + (Math.random() - 0.5) * 200
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
          break
        case 'founder':
          node.x = founderX + (Math.random() - 0.5) * 100
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.6
          break
      }
    })

    // Create force simulation
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(this.links)
          .id((d) => d.id)
          .distance(params.linkDistance)
          .strength(0.5),
      )
      .force('charge', d3.forceManyBody<SimulationNode>().strength(params.chargeStrength))
      .force(
        'x',
        d3
          .forceX<SimulationNode>()
          .x((d) => {
            switch (d.type) {
              case 'vc':
                return vcX
              case 'startup':
                return startupX
              case 'founder':
                return founderX
            }
          })
          .strength(0.2),
      )
      .force('y', d3.forceY<SimulationNode>(height / 2).strength(0.05))
      .force('collision', d3.forceCollide<SimulationNode>().radius(params.collisionRadius))
      .force(
        'center',
        d3.forceCenter<SimulationNode>(width / 2, height / 2).strength(params.centerStrength),
      )

    // Create gradients
    const defs = this.svg.append('defs')
    this.links.forEach((link, i) => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', `gradient-${String(i)}`)
        .attr('gradientUnits', 'userSpaceOnUse')

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', link.type === 'investment' ? '#646cff' : '#82ca9d')
        .attr('stop-opacity', 0.6)

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', link.type === 'investment' ? '#8884d8' : '#82ca9d')
        .attr('stop-opacity', 0.2)
    })

    // Create links
    this.linkElements = this.g
      .append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(this.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('stroke', (_, i) => `url(#gradient-${String(i)})`)
      .attr('stroke-width', (d) => Math.sqrt(d.value / 10000000))
      .attr('fill', 'none')
      .attr('opacity', 0.4)

    // Create nodes
    this.nodeElements = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on('start', this.dragstarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragended.bind(this)),
      )

    // Add circles
    this.nodeElements
      .append('circle')
      .attr('r', (d) => {
        switch (d.type) {
          case 'vc':
            return 8 + Math.sqrt(d.investments)
          case 'startup':
            return 10 + Math.sqrt(d.fundingAmount / 10000000)
          case 'founder':
            return 6 + d.companies * 2
          default:
            return 10
        }
      })
      .attr('fill', (d) => {
        switch (d.type) {
          case 'vc':
            return '#646cff'
          case 'startup':
            return '#8884d8'
          case 'founder':
            return '#82ca9d'
        }
      })
      .attr('opacity', 0.8)
      .on('mouseover', (_, d) => {
        callbacks.onHover(d.id)
        this.highlightConnections(d.id)
      })
      .on('mouseout', () => {
        callbacks.onHover(null)
        this.resetHighlight()
      })

    // Add labels
    this.nodeElements
      .append('text')
      .text((d) => d.name)
      .attr('x', (d) => {
        if (d.type === 'vc') return -15
        if (d.type === 'founder') return 15
        return 0
      })
      .attr('y', 4)
      .attr('text-anchor', (d) => {
        if (d.type === 'vc') return 'end'
        if (d.type === 'founder') return 'start'
        return 'middle'
      })
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .attr('pointer-events', 'none')

    // Update positions on tick
    this.simulation.on('tick', () => {
      this.linkElements?.attr('d', (d) => {
        const source = d.source as SimulationNode
        const target = d.target as SimulationNode
        const dx = (target.x ?? 0) - (source.x ?? 0)
        const dy = (target.y ?? 0) - (source.y ?? 0)
        const dr = Math.sqrt(dx * dx + dy * dy) * 2
        return `M${String(source.x ?? 0)},${String(source.y ?? 0)}A${String(dr)},${String(dr)} 0 0,1 ${String(target.x ?? 0)},${String(target.y ?? 0)}`
      })

      this.links.forEach((link, i) => {
        const source = link.source as SimulationNode
        const target = link.target as SimulationNode
        if (isNode(source) && isNode(target)) {
          d3.select(`#gradient-${String(i)}`)
            .attr('x1', source.x ?? 0)
            .attr('y1', source.y ?? 0)
            .attr('x2', target.x ?? 0)
            .attr('y2', target.y ?? 0)
        }
      })

      this.nodeElements?.attr(
        'transform',
        (d) => `translate(${String(d.x ?? 0)},${String(d.y ?? 0)})`,
      )
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
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(this.links)
          .id((d) => d.id)
          .distance(params.linkDistance)
          .strength(0.5),
      )
      .force('charge', d3.forceManyBody().strength(params.chargeStrength))
      .force('collision', d3.forceCollide().radius(params.collisionRadius))
      .alpha(0.3)
      .restart()
  }

  private highlightConnections(nodeId: string) {
    this.linkElements?.attr('opacity', (l) => {
      const sourceId = isNode(l.source) ? l.source.id : l.source
      const targetId = isNode(l.target) ? l.target.id : l.target
      return sourceId === nodeId || targetId === nodeId ? 0.8 : 0.1
    })
    this.nodeElements?.attr('opacity', (n) => {
      const isConnected = this.links.some((l) => {
        const sourceId = isNode(l.source) ? l.source.id : l.source
        const targetId = isNode(l.target) ? l.target.id : l.target
        return (
          (sourceId === nodeId && targetId === n.id) ||
          (targetId === nodeId && sourceId === n.id) ||
          n.id === nodeId
        )
      })
      return isConnected ? 1 : 0.3
    })
  }

  private resetHighlight() {
    this.linkElements?.attr('opacity', 0.4)
    this.nodeElements?.attr('opacity', 1)
  }

  private dragstarted(
    event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
    d: SimulationNode,
  ) {
    if (!event.active) this.simulation?.alphaTarget(0.3).restart()
    d.fx = d.x ?? 0
    d.fy = d.y ?? 0
  }

  private dragged(
    event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
    d: SimulationNode,
  ) {
    d.fx = event.x
    d.fy = event.y
  }

  private dragended(
    event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
    d: SimulationNode,
  ) {
    if (!event.active) this.simulation?.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  destroy() {
    this.simulation?.stop()
    this.svg?.selectAll('*').remove()
  }
}

function NetworkGraph({
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

      visualizationRef.current ??= new D3NetworkVisualization()

      visualizationRef.current.initialize(
        node,
        data,
        width,
        height,
        { linkDistance, chargeStrength, collisionRadius, centerStrength },
        { onHover: setHoveredNode },
      )
    }
  }

  // Update parameters when they change
  if (visualizationRef.current && isInitializedRef.current) {
    visualizationRef.current.updateParams({
      linkDistance,
      chargeStrength,
      collisionRadius,
      centerStrength,
    })
  }

  return (
    <div className="network-graph-container">
      <svg ref={svgRefCallback} className="network-graph">
        <rect width={width} height={height} fill="#fafafa" />
      </svg>
      {hoveredNode && (
        <div className="tooltip">{data.nodes.find((n) => n.id === hoveredNode)?.name}</div>
      )}
    </div>
  )
}

export default NetworkGraph
