import { select, axisLeft, axisBottom } from 'd3'
import type { Selection, ScaleLinear, ScaleTime } from 'd3'
// Common transition duration for animations
export const TRANSITION_DURATION = 200

// Create a debounced function for timeline updates
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: number | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
}

// Format currency values
export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

// Format percentage values
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Create responsive SVG dimensions
export interface Dimensions {
  width: number
  height: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  innerWidth: number
  innerHeight: number
}

export function getResponsiveDimensions(
  containerWidth: number,
  aspectRatio = 16 / 9,
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
): Dimensions {
  const width = containerWidth
  const height = containerWidth / aspectRatio
  return {
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }
}

// Create a tooltip div
export function createTooltip(): Selection<HTMLDivElement, unknown, HTMLElement, unknown> {
  return select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('opacity', '0')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.9)')
    .style('color', 'white')
    .style('padding', '12px')
    .style('border-radius', '8px')
    .style('pointer-events', 'none')
    .style('font-family', 'Inter, system-ui, -apple-system, sans-serif')
    .style('font-size', '14px')
    .style('line-height', '1.5')
    .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
}

// Show tooltip with content
export function showTooltip(
  tooltip: Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
  content: string,
  event: MouseEvent,
) {
  tooltip.transition().duration(200).style('opacity', '0.95')

  tooltip
    .html(content)
    .style('left', `${String(event.pageX + 10)}px`)
    .style('top', `${String(event.pageY - 28)}px`)
}

// Hide tooltip
export function hideTooltip(tooltip: Selection<HTMLDivElement, unknown, HTMLElement, unknown>) {
  tooltip.transition().duration(500).style('opacity', '0')
}

// Create grid lines for axes
export function createGridLines(
  scale: ScaleLinear<number, number> | ScaleTime<number, number>,
  tickCount: number,
  isHorizontal: boolean,
) {
  if (isHorizontal) {
    return axisLeft(scale)
      .tickSize(0)
      .tickFormat(() => '')
      .ticks(tickCount)
  } else {
    return axisBottom(scale)
      .tickSize(0)
      .tickFormat(() => '')
      .ticks(tickCount)
  }
}

// Wrap text for long labels
export function wrapText(
  text: Selection<SVGTextElement, unknown, SVGElement, unknown>,
  width: number,
): void {
  text.each(function () {
    const textElement = select(this)
    const words = textElement.text().split(/\s+/).reverse()
    const lineHeight = 1.1
    const y = textElement.attr('y')
    const dy = parseFloat(textElement.attr('dy') || '0')
    let line: string[] = []
    let lineNumber = 0
    let tspan = textElement
      .text(null)
      .append('tspan')
      .attr('x', '0')
      .attr('y', y)
      .attr('dy', `${String(dy)}em`)

    let word: string | undefined
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))
      const node = tspan.node()
      if (node && node.getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = textElement
          .append('tspan')
          .attr('x', '0')
          .attr('y', y)
          .attr('dy', `${String(++lineNumber * lineHeight + dy)}em`)
          .text(word)
      }
    }
  })
}

// Create a resource for Suspense pattern
export interface Resource<T> {
  read(): T
}

export function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T
  let error: unknown

  const suspender = promise.then(
    (data) => {
      status = 'success'
      result = data
    },
    (err: unknown) => {
      status = 'error'
      error = err
    },
  )

  return {
    read() {
      switch (status) {
        case 'pending':
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw suspender // Suspense: intentionally throwing a Promise
        case 'error':
          if (error instanceof Error) {
            throw error
          }
          throw new Error(String(error))
        case 'success':
          return result
      }
    },
  }
}
