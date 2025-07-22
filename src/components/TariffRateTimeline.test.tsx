import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TariffRateTimeline from './TariffRateTimeline'

// Mock D3 to avoid issues with JSDOM
vi.mock('d3', async () => {
  const actual = await vi.importActual<typeof import('d3')>('d3')

  const createMockSelection = () => ({
    attr: vi.fn().mockReturnThis(),
    style: vi.fn().mockReturnThis(),
    selectAll: vi.fn(() => createMockSelection()),
    select: vi.fn(() => createMockSelection()),
    data: vi.fn().mockReturnThis(),
    enter: vi.fn().mockReturnThis(),
    append: vi.fn(() => createMockSelection()),
    text: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    transition: vi.fn().mockReturnThis(),
    duration: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    call: vi.fn().mockReturnThis(),
    node: vi.fn(() => document.createElement('svg')),
    filter: vi.fn().mockReturnThis(),
    each: vi.fn().mockReturnThis(),
  })

  return {
    ...actual,
    select: vi.fn(() => createMockSelection()),
    selectAll: vi.fn(() => createMockSelection()),
  }
})

describe('TariffRateTimeline', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<TariffRateTimeline />)
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()
  })

  it('displays the main components', () => {
    render(<TariffRateTimeline />)

    // Check chart header
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()

    // Check timeline section - use getAllByText since "Timeline" appears multiple times
    const timelineTexts = screen.getAllByText('Timeline')
    expect(timelineTexts.length).toBeGreaterThan(0)
  })

  it('renders the timeline slider', () => {
    render(<TariffRateTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', () => {
    render(<TariffRateTimeline />)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    render(<TariffRateTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    // Get initial value
    const initialValue = slider.getAttribute('value')

    // Change the slider value
    const newDate = new Date('2025-10-01').getTime()
    fireEvent.change(slider, { target: { value: newDate.toString() } })

    // Check that the value has changed
    await waitFor(() => {
      expect(slider.getAttribute('value')).not.toBe(initialValue)
    })
  })

  it('renders SVG container for visualization', () => {
    render(<TariffRateTimeline />)
    const svgContainer = screen.getByTestId('tariff-timeline-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', () => {
    const { container } = render(<TariffRateTimeline />)

    expect(container.querySelector('.tariff-rate-timeline')).toBeInTheDocument()
    expect(container.querySelector('.chart-header')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('timeline slider has correct date range', () => {
    render(<TariffRateTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    const minDate = new Date('2025-01-01').getTime()
    const maxDate = new Date('2026-01-01').getTime()

    expect(slider).toHaveAttribute('min', minDate.toString())
    expect(slider).toHaveAttribute('max', maxDate.toString())
  })
  it('has proper accessibility attributes', () => {
    render(<TariffRateTimeline />)

    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toHaveAttribute('aria-label')
  })
})
