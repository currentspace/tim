import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/testRouter'
import { RoutePaths } from '../types/RoutePaths'

describe('CountryExposure', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)

    expect(screen.getByText('Current View')).toBeInTheDocument()
  })

  it('displays the main components', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)

    // Check current view section in navigation
    expect(screen.getByText('Current View')).toBeInTheDocument()
    const exposureTexts = screen.getAllByText('EXPOSURE')
    expect(exposureTexts.length).toBeGreaterThan(0)

    // Check timeline section - there may be multiple "Timeline" text elements
    const timelineElements = screen.getAllByText('Timeline')
    expect(timelineElements.length).toBeGreaterThan(0)
  })

  it('displays company selector', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    expect(screen.getByText('Company:')).toBeInTheDocument()
    const selector = screen.getByRole('combobox')
    expect(selector).toBeInTheDocument()
  })

  it('renders company selector', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const selector = screen.getByRole('combobox')
    expect(selector).toBeInTheDocument()
    expect(selector.tagName).toBe('SELECT')
  })

  it('has HP selected by default', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const selector = screen.getByRole('combobox')
    expect((selector as HTMLSelectElement).value).toBe('hp')
  })

  it('allows company selection', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const selector = screen.getByRole('combobox')

    // Change to Apple
    fireEvent.change(selector, { target: { value: 'apple' } })

    await waitFor(() => {
      expect((selector as HTMLSelectElement).value).toBe('apple')
    })
  })

  it('renders the timeline slider', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const slider = screen.getByRole('slider', { name: /date slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
    expect(screen.getByText('Dec 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const slider = screen.getByRole('slider', { name: /date slider/i })

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

  it('renders SVG container for visualization', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const svgContainer = screen.getByTestId('country-exposure-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', async () => {
    const { container } = await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)

    expect(container.querySelector('.country-exposure')).toBeInTheDocument()
    expect(container.querySelector('.controls-section')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('displays total revenue', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const totalText = screen.getByText(/Total:/i)
    expect(totalText).toBeInTheDocument()
    // Check that it shows a dollar amount with M suffix
    expect(totalText.textContent).toMatch(/Total: \$\d+M/)
  })

  it('shows company options in selector', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const selector = screen.getByRole('combobox')

    // Check for options
    const options = selector.querySelectorAll('option')
    expect(options.length).toBeGreaterThan(1)

    // Check for specific companies
    const optionTexts = Array.from(options).map((opt) => opt.textContent)
    expect(optionTexts).toContain('All Companies')
    expect(optionTexts.some((text) => text?.includes('HP'))).toBe(true)
    expect(optionTexts.some((text) => text?.includes('Apple'))).toBe(true)
    expect(optionTexts.some((text) => text?.includes('Dell'))).toBe(true)
  })

  it('has proper accessibility attributes', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)

    const slider = screen.getByRole('slider', { name: /date slider/i })
    expect(slider).toHaveAttribute('id', 'date-slider')
  })

  it('displays view subtitle in navigation', async () => {
    await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    // View subtitle is now in the navigation header
    const viewSubtitles = screen.getAllByText('EXPOSURE')
    // Should find at least one
    expect(viewSubtitles.length).toBeGreaterThan(0)
  })

  it('shows company info section', async () => {
    const { container } = await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const companyInfo = container.querySelector('.company-info')
    expect(companyInfo).toBeInTheDocument()
    expect(companyInfo?.textContent).toContain('Company:')
  })

  it('has timeline info section', async () => {
    const { container } = await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const timelineInfo = container.querySelector('.timeline-info')
    expect(timelineInfo).toBeInTheDocument()
    expect(timelineInfo?.textContent).toContain('Legend')
  })

  it('displays controls section', async () => {
    const { container } = await renderWithRouter(RoutePaths.COUNTRY_EXPOSURE)
    const controlsSection = container.querySelector('.controls-section')
    expect(controlsSection).toBeInTheDocument()
  })
})
