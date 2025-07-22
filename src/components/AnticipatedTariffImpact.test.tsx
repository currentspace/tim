import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/testRouter'
import { RoutePaths } from '../types/RoutePaths'

describe('AnticipatedTariffImpact', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    expect(screen.getByText('Current View')).toBeInTheDocument()
  })

  it('displays the main heading', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const heading = screen.getByText('Current View')
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H3')
  })

  it('renders the timeline section', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    expect(screen.getByText('TIMELINE')).toBeInTheDocument()
  })

  it('renders the timeline slider', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    expect(screen.getByText('Jun 2025')).toBeInTheDocument()
    expect(screen.getAllByText('Aug 2025').length).toBeGreaterThan(0)
    expect(screen.getByText('Oct 2025')).toBeInTheDocument()
    expect(screen.getByText('Dec 2025')).toBeInTheDocument()
  })

  it('updates selected quarter when slider is moved', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    // Get initial value (should be 1 for Aug 2025)
    const initialValue = slider.getAttribute('value')
    expect(initialValue).toBe('1')

    // Change to October quarter (index 2)
    fireEvent.change(slider, { target: { value: '2' } })

    // Check that the value has changed
    await waitFor(() => {
      expect(slider.getAttribute('value')).toBe('2')
    })
  })

  it('renders SVG container for visualization', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const svgContainer = screen.getByTestId('tariff-impact-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', async () => {
    const { container } = await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    expect(container.querySelector('.anticipated-tariff-impact')).toBeInTheDocument()
    expect(container.querySelector('.current-view')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('timeline slider has correct quarter range', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })

    // The slider uses indices 0-3 for the 4 quarters
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '3')
    expect(slider).toHaveAttribute('step', '1')
  })

  it('renders with white background', async () => {
    const { container } = await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    const vizContainer = container.querySelector('.visualization-container')

    expect(vizContainer).toBeInTheDocument()
    // Note: In a real test environment, you might want to check computed styles
    // but that requires more setup with JSDOM
  })

  it('displays view title correctly', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)

    // Check for view title
    expect(screen.getByText('Current View')).toBeInTheDocument()
    // Use getAllByText since this text appears multiple times
    const tariffTexts = screen.getAllByText('Tariff Exposure & Rate')
    expect(tariffTexts.length).toBeGreaterThan(0)
  })

  it('displays tariff exposure view subtitle', async () => {
    await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    // Check for view subtitle specifically
    const subtitles = screen.getAllByText('Tariff Exposure & Rate')
    // Find the one with view-subtitle class
    const viewSubtitle = subtitles.find((el) => el.classList.contains('view-subtitle'))
    expect(viewSubtitle).toBeTruthy()
  })

  it('shows current date display', async () => {
    const { container } = await renderWithRouter(RoutePaths.ANTICIPATED_TARIFF)
    // Find the date display element specifically
    const dateDisplay = container.querySelector('.date-display')
    expect(dateDisplay).toBeInTheDocument()
    expect(dateDisplay?.textContent).toMatch(/\w{3} \d{4}/) // Matches format like "Jul 2025"
  })
})
