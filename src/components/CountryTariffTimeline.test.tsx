import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/testRouter'
import { RoutePaths } from '../types/RoutePaths'

describe('CountryTariffTimeline', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()
  })

  it('displays the main components', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)

    // Check chart header
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()

    // Check timeline section
    expect(screen.getByText('Timeline')).toBeInTheDocument()
  })

  it('renders the timeline slider', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
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
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    const svgContainer = screen.getByTestId('country-timeline-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', () => {
    const { container } = renderWithRouter(RoutePaths.COUNTRY_TIMELINE)

    expect(container.querySelector('.country-tariff-timeline')).toBeInTheDocument()
    expect(container.querySelector('.chart-header')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('timeline slider has correct date range', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    const minDate = new Date('2025-01-01').getTime()
    const maxDate = new Date('2026-01-01').getTime()

    expect(slider).toHaveAttribute('min', minDate.toString())
    expect(slider).toHaveAttribute('max', maxDate.toString())
  })

  it('displays timeline heading', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    expect(screen.getByRole('heading', { name: 'Timeline' })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)

    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toHaveAttribute('aria-label')
  })

  it('displays timeline date', () => {
    const { container } = renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    const timelineContainer = container.querySelector('.timeline-container')
    expect(timelineContainer).toBeInTheDocument()

    // Check that date labels exist
    const timelineLabels = container.querySelector('.timeline-labels')
    expect(timelineLabels).toBeInTheDocument()
  })

  it('initializes with correct selected date', () => {
    renderWithRouter(RoutePaths.COUNTRY_TIMELINE)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    // Should start with June 2025
    const expectedDate = new Date('2025-06-01').getTime()
    expect(slider.getAttribute('value')).toBe(expectedDate.toString())
  })
})
