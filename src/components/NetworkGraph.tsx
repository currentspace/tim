import { useRef, useState, useEffect } from 'react'
import {
  select,
  forceCenter,
  forceCollide,
  forceManyBody,
  forceY,
  zoom,
  forceLink,
  forceSimulation,
  forceX,
  drag,
} from 'd3'
import { D3_COLORS } from '../constants/colors'
import { css, cx } from '../../styled-system/css'
import { visualization } from '../../styled-system/recipes'
import type {
  Selection,
  ZoomBehavior,
  ZoomTransform,
  Simulation,
  D3DragEvent,
  D3ZoomEvent,
  ForceLink,
} from 'd3'
import { NetworkData } from '../types/network'
import { SimulationNode, SimulationLink } from '../types/d3-network'

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
  private simulation: Simulation<SimulationNode, SimulationLink> | null = null
  private svg: Selection<SVGSVGElement, unknown, null, undefined> | null = null
  private g: Selection<SVGGElement, unknown, null, undefined> | null = null
  private nodes: SimulationNode[] = []
  private links: SimulationLink[] = []
  private nodeElements: Selection<SVGGElement, SimulationNode, SVGGElement, unknown> | null = null
  private linkElements: Selection<SVGPathElement, SimulationLink, SVGGElement, unknown> | null =
    null
  private width = 0
  private height = 0
  private callbacks: { onHover: (nodeId: string | null) => void } | null = null
  private storedTransform: ZoomTransform | null = null
  private zoom: ZoomBehavior<SVGSVGElement, unknown> | null = null

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

    this.width = width
    this.height = height
    this.callbacks = callbacks

    this.svg = select(svgElement).attr('width', width).attr('height', height)

    // Create main group for zoom/pan
    this.g = this.svg.append('g')

    // Add zoom behavior
    this.zoom = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.storedTransform = event.transform
        this.g?.attr('transform', event.transform.toString())
      })

    this.svg.call(this.zoom)

    // Initialize with data
    this.updateData(data)

    // Define positions for different node types
    const vcX = width * 0.15
    const startupX = width * 0.5
    const founderX = width * 0.85

    // Initialize node positions with tighter clustering
    this.nodes.forEach((node) => {
      switch (node.type) {
        case 'vc':
          node.x = vcX + (Math.random() - 0.5) * 60
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.4
          break
        case 'startup':
          node.x = startupX + (Math.random() - 0.5) * 120
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.4
          break
        case 'founder':
          node.x = founderX + (Math.random() - 0.5) * 60
          node.y = height / 2 + (Math.random() - 0.5) * height * 0.4
          break
      }
    })

    // Create force simulation
    this.simulation = forceSimulation(this.nodes)
      .force(
        'link',
        forceLink<SimulationNode, SimulationLink>(this.links)
          .id((d) => d.id)
          .distance(params.linkDistance)
          .strength(0.5),
      )
      .force('charge', forceManyBody<SimulationNode>().strength(params.chargeStrength))
      .force(
        'x',
        forceX<SimulationNode>()
          .x((d) => {
            const vcX = this.width * 0.15
            const startupX = this.width * 0.5
            const founderX = this.width * 0.85
            switch (d.type) {
              case 'vc':
                return vcX
              case 'startup':
                return startupX
              case 'founder':
                return founderX
            }
          })
          .strength(0.3),
      )
      .force('y', forceY<SimulationNode>(height / 2).strength(0.1))
      .force('collision', forceCollide<SimulationNode>().radius(params.collisionRadius))
      .force(
        'center',
        forceCenter<SimulationNode>(width / 2, height / 2).strength(params.centerStrength),
      )

    // Create initial SVG elements
    this.updateSVGElements()

    // Update positions on tick
    this.simulation.on('tick', () => {
      this.updatePositions()
    })
  }

  updateParams(params: {
    linkDistance: number
    chargeStrength: number
    collisionRadius: number
    centerStrength: number
  }) {
    if (!this.simulation) return

    const linkForce = this.simulation.force<ForceLink<SimulationNode, SimulationLink>>('link')
    if (linkForce) {
      linkForce.distance(params.linkDistance)
    }

    this.simulation
      .force('charge', forceManyBody<SimulationNode>().strength(params.chargeStrength))
      .force('collision', forceCollide<SimulationNode>().radius(params.collisionRadius))
      .force(
        'center',
        forceCenter<SimulationNode>(this.width / 2, this.height / 2).strength(
          params.centerStrength,
        ),
      )
      .alpha(0.3)
      .restart()
  }

  updateDimensions(width: number, height: number) {
    this.width = width
    this.height = height

    this.svg?.attr('width', width).attr('height', height)

    // Reapply stored zoom transform if it exists
    if (this.svg && this.zoom && this.storedTransform) {
      const transform = this.storedTransform
      const zoomBehavior = this.zoom
      this.svg.call((selection) => {
        zoomBehavior.transform(selection, transform)
      })
    }

    // Update force positions
    const vcX = width * 0.15
    const startupX = width * 0.5
    const founderX = width * 0.85

    this.simulation?.force(
      'x',
      forceX<SimulationNode>()
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

    this.simulation?.force('y', forceY<SimulationNode>(height / 2).strength(0.05))
    this.simulation?.force('center', forceCenter<SimulationNode>(width / 2, height / 2))

    this.simulation?.alpha(0.3).restart()
  }

  updateData(newData: NetworkData) {
    // Create new nodes and links, preserving existing positions
    const oldNodesMap = new Map(this.nodes.map((n) => [n.id, n]))

    this.nodes = newData.nodes.map((d) => {
      const oldNode = oldNodesMap.get(d.id)
      return {
        ...d,
        x: oldNode?.x,
        y: oldNode?.y,
        vx: oldNode?.vx,
        vy: oldNode?.vy,
      }
    }) as SimulationNode[]

    this.links = newData.links.map((d) => ({ ...d })) as SimulationLink[]

    if (this.simulation) {
      // Update simulation
      this.simulation.nodes(this.nodes)
      const linkForce = this.simulation.force<ForceLink<SimulationNode, SimulationLink>>('link')
      if (linkForce) {
        linkForce.links(this.links)
      }

      // Update SVG elements
      this.updateSVGElements()

      // Restart simulation
      this.simulation.alpha(0.3).restart()
    }
  }

  private updateSVGElements() {
    if (!this.g || !this.svg) return

    // Update gradients
    const defs = this.svg.select('defs').empty() ? this.svg.append('defs') : this.svg.select('defs')

    const gradients = (defs as Selection<SVGDefsElement, unknown, null, undefined>)
      .selectAll<SVGLinearGradientElement, SimulationLink>('linearGradient')
      .data(this.links, (d, i) => {
        // Use stable ID based on source and target
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id
        const targetId = typeof d.target === 'string' ? d.target : d.target.id
        return `${sourceId}-${targetId}-${String(i)}`
      })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(gradients.exit() as any).remove()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradientsEnter = (gradients.enter() as any).append('linearGradient') as Selection<
      SVGLinearGradientElement,
      SimulationLink,
      SVGDefsElement,
      unknown
    >

    gradientsEnter
      .attr('id', (d: SimulationLink, i) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id
        const targetId = typeof d.target === 'string' ? d.target : d.target.id
        return `gradient-${sourceId}-${targetId}-${String(i)}`
      })
      .attr('gradientUnits', 'userSpaceOnUse')
      .each(function (d: SimulationLink) {
        const gradient = select(this)
        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr(
            'stop-color',
            d.type === 'investment' ? D3_COLORS.CHART_BLUE : D3_COLORS.CHART_GREEN,
          )
          .attr('stop-opacity', 0.6)
        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr(
            'stop-color',
            d.type === 'investment' ? D3_COLORS.CHART_PURPLE : D3_COLORS.CHART_GREEN,
          )
          .attr('stop-opacity', 0.2)
      })

    // Update links
    const linkGroup = this.g.select('.links').empty()
      ? this.g.append('g').attr('class', 'links')
      : this.g.select('.links')

    this.linkElements = (linkGroup as Selection<SVGGElement, unknown, null, undefined>)
      .selectAll<SVGPathElement, SimulationLink>('path')
      .data(this.links, (d) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id
        const targetId = typeof d.target === 'string' ? d.target : d.target.id
        return `${sourceId}-${targetId}`
      })

    this.linkElements.exit().remove()

    const linkEnter = this.linkElements.enter().append('path').attr('class', 'link')

    this.linkElements = linkEnter.merge(this.linkElements)

    this.linkElements
      .attr('stroke', (d: SimulationLink, i) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id
        const targetId = typeof d.target === 'string' ? d.target : d.target.id
        return `url(#gradient-${sourceId}-${targetId}-${String(i)})`
      })
      .attr('stroke-width', (d) => Math.sqrt(d.value / 10000000))
      .attr('fill', 'none')
      .attr('opacity', 0.3)

    // Update nodes
    const nodeGroup = this.g.select('.nodes').empty()
      ? this.g.append('g').attr('class', 'nodes')
      : this.g.select('.nodes')

    this.nodeElements = (nodeGroup as Selection<SVGGElement, unknown, null, undefined>)
      .selectAll<SVGGElement, SimulationNode>('g')
      .data(this.nodes, (d) => d.id)

    this.nodeElements.exit().remove()

    const nodeEnter = this.nodeElements
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        drag<SVGGElement, SimulationNode>()
          .on('start', this.dragstarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragended.bind(this)),
      )

    // Add circles to new nodes
    nodeEnter
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
            return D3_COLORS.CHART_BLUE
          case 'startup':
            return D3_COLORS.CHART_PURPLE
          case 'founder':
            return D3_COLORS.CHART_GREEN
        }
      })
      .attr('opacity', 0.8)
      .on('mouseover', (_, d) => {
        this.callbacks?.onHover(d.id)
        this.highlightConnections(d.id)
      })
      .on('mouseout', () => {
        this.callbacks?.onHover(null)
        this.resetHighlight()
      })

    // Add labels to new nodes
    nodeEnter
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
      .attr('fill', D3_COLORS.TEXT_PRIMARY)
      .attr('pointer-events', 'none')

    this.nodeElements = nodeEnter.merge(this.nodeElements)
  }

  private updatePositions() {
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
        select(`#gradient-${source.id}-${target.id}-${String(i)}`)
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
    this.linkElements?.attr('opacity', 0.3)
    this.nodeElements?.attr('opacity', 1)
  }

  private dragstarted(
    event: D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
    d: SimulationNode,
  ) {
    if (!event.active) this.simulation?.alphaTarget(0.3).restart()
    d.fx = d.x ?? 0
    d.fy = d.y ?? 0
  }

  private dragged(
    event: D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
    d: SimulationNode,
  ) {
    d.fx = event.x
    d.fy = event.y
  }

  private dragended(
    event: D3DragEvent<SVGGElement, SimulationNode, SimulationNode>,
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

// Custom hook for D3 network visualization
function useD3NetworkVisualization(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: NetworkData,
  width: number,
  height: number,
  params: {
    linkDistance: number
    chargeStrength: number
    collisionRadius: number
    centerStrength: number
  },
  setHoveredNode: (nodeId: string | null) => void,
) {
  const visualizationRef = useRef<D3NetworkVisualization | null>(null)

  // Initialize D3 visualization ONLY on mount
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    visualizationRef.current = new D3NetworkVisualization()
    visualizationRef.current.initialize(svg, data, width, height, params, {
      onHover: setHoveredNode,
    })

    // Cleanup function
    return () => {
      visualizationRef.current?.destroy()
      visualizationRef.current = null
    }
    // Empty dependency array - only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update parameters when they change
  useEffect(() => {
    visualizationRef.current?.updateParams({
      linkDistance: params.linkDistance,
      chargeStrength: params.chargeStrength,
      collisionRadius: params.collisionRadius,
      centerStrength: params.centerStrength,
    })
  }, [params.linkDistance, params.chargeStrength, params.collisionRadius, params.centerStrength])

  // Update dimensions when they change
  useEffect(() => {
    visualizationRef.current?.updateDimensions(width, height)
  }, [width, height])

  // Update data when it changes
  useEffect(() => {
    visualizationRef.current?.updateData(data)
  }, [data])
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
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Use custom hook for D3 visualization
  useD3NetworkVisualization(
    svgRef,
    data,
    width,
    height,
    { linkDistance, chargeStrength, collisionRadius, centerStrength },
    setHoveredNode,
  )

  return (
    <div
      className={css({
        position: 'relative',
        background: 'bg.hover',
        borderRadius: 'lg',
        boxShadow: 'md',
        overflow: 'hidden',
      })}
    >
      <svg
        ref={svgRef}
        className={cx(
          visualization({ background: 'transparent' }),
          css({
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }),
        )}
      >
        <rect width={width} height={height} fill={D3_COLORS.BG_HOVER} />
      </svg>
      {hoveredNode && (
        <div
          className={css({
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: D3_COLORS.TOOLTIP_BG,
            color: 'white',
            padding: '8px 12px',
            borderRadius: 'md',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 1000,
          })}
        >
          {data.nodes.find((n) => n.id === hoveredNode)?.name}
        </div>
      )}
    </div>
  )
}

export default NetworkGraph
