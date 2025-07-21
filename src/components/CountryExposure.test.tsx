import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CountryExposure from './CountryExposure'

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

describe('CountryExposure', () => {
  beforeEach(() => {
    // Reset any module state before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<CountryExposure />)
    expect(screen.getByText('Current View')).toBeInTheDocument()
  })

  it('displays the main components', () => {
    render(<CountryExposure />)
    
    // Check main header elements
    expect(screen.getByText('Staples Technology Solutions')).toBeInTheDocument()
    expect(screen.getByText('HP TIM Dashboard')).toBeInTheDocument()
    
    // Check current view section
    expect(screen.getByText('Current View')).toBeInTheDocument()
    // Use getAllByText since "Percentage Share" appears multiple times
    const percentageShareElements = screen.getAllByText('Percentage Share')
    expect(percentageShareElements.length).toBeGreaterThan(0)
    
    // Check timeline section
    expect(screen.getByText('Timeline')).toBeInTheDocument()
  })

  it('displays navigation buttons', () => {
    render(<CountryExposure />)
    expect(screen.getByText('← Back to Tariff View')).toBeInTheDocument()
    const dollarVolumeButtons = screen.getAllByText('Dollar Volume')
    expect(dollarVolumeButtons.length).toBeGreaterThan(0)
    // Check for active button
    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find(btn => btn.classList.contains('active'))
    expect(activeButton).toBeInTheDocument()
  })

  it('renders company selector', () => {
    render(<CountryExposure />)
    const selector = screen.getByRole('combobox')
    expect(selector).toBeInTheDocument()
    expect(selector.tagName).toBe('SELECT')
  })

  it('has HP selected by default', () => {
    render(<CountryExposure />)
    const selector = screen.getByRole('combobox') as HTMLSelectElement
    expect(selector.value).toBe('hp')
  })

  it('allows company selection', async () => {
    render(<CountryExposure />)
    const selector = screen.getByRole('combobox') as HTMLSelectElement
    
    // Change to Apple
    fireEvent.change(selector, { target: { value: 'apple' } })
    
    await waitFor(() => {
      expect(selector.value).toBe('apple')
    })
  })

  it('renders the timeline slider', () => {
    render(<CountryExposure />)
    const slider = screen.getByRole('slider', { name: /date slider/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('type', 'range')
  })

  it('displays timeline labels', () => {
    render(<CountryExposure />)
    expect(screen.getByText('Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('Jul 2025')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026')).toBeInTheDocument()
    expect(screen.getByText('Dec 2026')).toBeInTheDocument()
  })

  it('updates date when slider is moved', async () => {
    render(<CountryExposure />)
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

  it('renders SVG container for visualization', () => {
    render(<CountryExposure />)
    const svgContainer = screen.getByTestId('country-exposure-svg')
    expect(svgContainer).toBeInTheDocument()
    expect(svgContainer.tagName).toBe('svg')
  })

  it('has correct CSS classes applied', () => {
    const { container } = render(<CountryExposure />)
    
    expect(container.querySelector('.country-exposure')).toBeInTheDocument()
    expect(container.querySelector('.header')).toBeInTheDocument()
    expect(container.querySelector('.current-view')).toBeInTheDocument()
    expect(container.querySelector('.visualization-container')).toBeInTheDocument()
    expect(container.querySelector('.timeline-container')).toBeInTheDocument()
  })

  it('displays total revenue', () => {
    render(<CountryExposure />)
    const totalText = screen.getByText(/Total:/i)
    expect(totalText).toBeInTheDocument()
    // Check that it shows a dollar amount with M suffix
    expect(totalText.textContent).toMatch(/Total: \$\d+M/)
  })

  it('shows company options in selector', () => {
    render(<CountryExposure />)
    const selector = screen.getByRole('combobox')
    
    // Check for options
    const options = selector.querySelectorAll('option')
    expect(options.length).toBeGreaterThan(1)
    
    // Check for specific companies
    const optionTexts = Array.from(options).map(opt => opt.textContent)
    expect(optionTexts).toContain('All Companies')
    expect(optionTexts.some(text => text?.includes('HP'))).toBe(true)
    expect(optionTexts.some(text => text?.includes('Apple'))).toBe(true)
    expect(optionTexts.some(text => text?.includes('Dell'))).toBe(true)
  })

  it('has proper accessibility attributes', () => {
    render(<CountryExposure />)
    
    const slider = screen.getByRole('slider', { name: /date slider/i })
    expect(slider).toHaveAttribute('id', 'date-slider')
  })

  it('displays view subtitle', () => {
    render(<CountryExposure />)
    const subtitle = screen.getByText('Percentage Share', { selector: '.view-subtitle' })
    expect(subtitle).toBeInTheDocument()
  })

  it('shows company info section', () => {
    const { container } = render(<CountryExposure />)
    const companyInfo = container.querySelector('.company-info')
    expect(companyInfo).toBeInTheDocument()
    expect(companyInfo?.textContent).toContain('Company:')
  })

  it('has timeline info section', () => {
    const { container } = render(<CountryExposure />)
    const timelineInfo = container.querySelector('.timeline-info')
    expect(timelineInfo).toBeInTheDocument()
    expect(timelineInfo?.textContent).toContain('Legend')
  })

  it('navigation controls have proper structure', () => {
    const { container } = render(<CountryExposure />)
    const navControls = container.querySelector('.navigation-controls')
    expect(navControls).toBeInTheDocument()
    
    // Should have multiple buttons
    const buttons = navControls?.querySelectorAll('.nav-button')
    expect(buttons?.length).toBeGreaterThan(0)
  })
})