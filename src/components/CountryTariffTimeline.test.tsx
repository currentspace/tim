import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CountryTariffTimeline from './CountryTariffTimeline'

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
    invert: vi.fn(() => new Date()),
    pointer: vi.fn(() => [100]),
  })

  return {
    ...actual,
    select: vi.fn(() => createMockSelection()),
    selectAll: vi.fn(() => createMockSelection()),
  }
})

describe('CountryTariffTimeline', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<CountryTariffTimeline />)
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()
  })

  it('displays the main components', () => {
    render(<CountryTariffTimeline />)
    
    // Check main header elements
    expect(screen.getByText('Staples Technology Solutions')).toBeInTheDocument()
    expect(screen.getByText('TIM Dashboard')).toBeInTheDocument()
    
    // Check chart header
    expect(screen.getByText('Tariff Rate Increases Over Time')).toBeInTheDocument()
    
    // Check timeline section
    expect(screen.getByText('Timeline')).toBeInTheDocument()
  })

  it('displays toggle switch labels', () => {
    render(<CountryTariffTimeline />)
    const dollarVolumeSpans = screen.getAllByText('Dollar Volume')
    expect(dollarVolumeSpans.length).toBeGreaterThan(0)
    expect(screen.getByText('Tariff Exposure & Rate')).toBeInTheDocument()
  })

  it('shows country navigation tabs', () => {
    render(<CountryTariffTimeline />)
    const countryElements = screen.getAllByText('Country')
    expect(countryElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Company')).toBeInTheDocument()
  })

  it('country tab is active by default', () => {
    const { container } = render(<CountryTariffTimeline />)
    const tabs = container.querySelectorAll('.nav-item')
    const countryTab = Array.from(tabs).find(el => el.textContent === 'Country')
    expect(countryTab).toHaveClass('active')
  })

  it('renders the timeline slider', () => {
    render(<CountryTariffTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', () => {
    render(<CountryTariffTimeline />)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    render(<CountryTariffTimeline />)
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
    render(<CountryTariffTimeline />)
    const svgContainer = screen.getByTestId('country-timeline-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', () => {
    const { container } = render(<CountryTariffTimeline />)
    
    expect(container.querySelector('.country-tariff-timeline')).toBeInTheDocument()
    expect(container.querySelector('.header')).toBeInTheDocument()
    expect(container.querySelector('.chart-header')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('timeline slider has correct date range', () => {
    render(<CountryTariffTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    
    const minDate = new Date('2025-01-01').getTime()
    const maxDate = new Date('2026-01-01').getTime()
    
    expect(slider).toHaveAttribute('min', minDate.toString())
    expect(slider).toHaveAttribute('max', maxDate.toString())
  })

  it('renders toggle switch', () => {
    const { container } = render(<CountryTariffTimeline />)
    const toggleSwitch = container.querySelector('.toggle-switch input[type="checkbox"]')
    expect(toggleSwitch).toBeInTheDocument()
    expect(toggleSwitch).toBeChecked()
  })

  it('displays timeline heading', () => {
    render(<CountryTariffTimeline />)
    expect(screen.getByRole('heading', { name: 'Timeline' })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<CountryTariffTimeline />)
    
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    expect(slider).toHaveAttribute('aria-label')
  })

  it('displays timeline date', () => {
    const { container } = render(<CountryTariffTimeline />)
    const timelineContainer = container.querySelector('.timeline-container')
    expect(timelineContainer).toBeInTheDocument()
    
    // Check that date labels exist
    const timelineLabels = container.querySelector('.timeline-labels')
    expect(timelineLabels).toBeInTheDocument()
  })

  it('has proper header structure', () => {
    const { container } = render(<CountryTariffTimeline />)
    
    // Check header structure
    const header = container.querySelector('.header')
    expect(header).toBeInTheDocument()
    
    const headerContent = container.querySelector('.header-content')
    expect(headerContent).toBeInTheDocument()
    
    const titleSection = container.querySelector('.title-section')
    expect(titleSection).toBeInTheDocument()
    
    const companyTitle = container.querySelector('.company-title')
    expect(companyTitle).toBeInTheDocument()
  })

  it('initializes with correct selected date', () => {
    render(<CountryTariffTimeline />)
    const slider = screen.getByRole('slider', { name: /timeline slider/i })
    
    // Should start with June 2025
    const expectedDate = new Date('2025-06-01').getTime()
    expect(slider.getAttribute('value')).toBe(expectedDate.toString())
  })
})