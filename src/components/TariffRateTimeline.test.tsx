import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/testRouter'
import { RoutePaths } from '../types/RoutePaths'

describe('TariffRateTimeline', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()
  })

  it('displays the main components', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    // Check chart header
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()

    // Check timeline section - use getAllByText since "Timeline" appears multiple times
    const timelineTexts = screen.getAllByText('Timeline')
    expect(timelineTexts.length).toBeGreaterThan(0)
  })

  it('renders the timeline slider', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
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
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const svgContainer = screen.getByTestId('tariff-timeline-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', () => {
    const { container } = renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    expect(container.querySelector('.tariff-rate-timeline')).toBeInTheDocument()
    expect(container.querySelector('.chart-header')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('timeline slider has correct date range', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    const minDate = new Date('2025-01-01').getTime()
    const maxDate = new Date('2026-01-01').getTime()

    expect(slider).toHaveAttribute('min', minDate.toString())
    expect(slider).toHaveAttribute('max', maxDate.toString())
  })
  it('has proper accessibility attributes', () => {
    renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toHaveAttribute('aria-label')
  })
})
