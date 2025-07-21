import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Navigation from './Navigation'

describe('Navigation', () => {
  const mockOnViewChange = vi.fn()

  beforeEach(() => {
    mockOnViewChange.mockClear()
  })

  it('renders navigation header', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    expect(screen.getByText('Staples Technology Solutions')).toBeInTheDocument()
    expect(screen.getByText('TIM Dashboard')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    // Visualizations
    expect(screen.getByText('Anticipated Tariff Impact')).toBeInTheDocument()
    expect(screen.getByText('Company Tariff Timeline')).toBeInTheDocument()
    expect(screen.getByText('Country Tariff Timeline')).toBeInTheDocument()
    expect(screen.getByText('Country Exposure')).toBeInTheDocument()
    expect(screen.getByText('Startup Universe')).toBeInTheDocument()

    // Settings
    expect(screen.getByText('Notification Settings')).toBeInTheDocument()
  })

  it('shows section titles', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    expect(screen.getByText('Visualizations')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    const tariffButton = screen.getByRole('button', { name: /Anticipated Tariff Impact/i })
    expect(tariffButton).toHaveClass('active')

    const exposureButton = screen.getByRole('button', { name: /Country Exposure/i })
    expect(exposureButton).not.toHaveClass('active')
  })

  it('calls onViewChange when item is clicked', async () => {
    const user = userEvent.setup()
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    const exposureButton = screen.getByRole('button', { name: /Country Exposure/i })
    await user.click(exposureButton)

    expect(mockOnViewChange).toHaveBeenCalledWith('exposure')
  })

  it('sets aria-current on active item', () => {
    render(<Navigation currentView="timeline" onViewChange={mockOnViewChange} />)

    const timelineButton = screen.getByRole('button', { name: /Company Tariff Timeline/i })
    expect(timelineButton).toHaveAttribute('aria-current', 'page')

    const otherButton = screen.getByRole('button', { name: /Country Exposure/i })
    expect(otherButton).not.toHaveAttribute('aria-current')
  })

  it('renders version in footer', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    expect(screen.getByText('Version 1.0.0')).toBeInTheDocument()
  })

  it('renders item descriptions', () => {
    render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    expect(screen.getByText('View anticipated tariff impact by company')).toBeInTheDocument()
    expect(screen.getByText('Track tariff rates over time by company')).toBeInTheDocument()
    expect(screen.getByText('Configure alerts and notifications')).toBeInTheDocument()
  })

  it('handles all view types correctly', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Navigation currentView="tariff" onViewChange={mockOnViewChange} />)

    // Test each view type
    const viewTypes = ['startup', 'timeline', 'country-timeline', 'exposure', 'notifications']

    for (const viewType of viewTypes) {
      mockOnViewChange.mockClear()
      rerender(<Navigation currentView={viewType as any} onViewChange={mockOnViewChange} />)

      // Find the corresponding button and verify it's active
      let buttonText = ''
      switch (viewType) {
        case 'startup':
          buttonText = 'Startup Universe'
          break
        case 'timeline':
          buttonText = 'Company Tariff Timeline'
          break
        case 'country-timeline':
          buttonText = 'Country Tariff Timeline'
          break
        case 'exposure':
          buttonText = 'Country Exposure'
          break
        case 'notifications':
          buttonText = 'Notification Settings'
          break
      }

      const button = screen.getByRole('button', { name: new RegExp(buttonText, 'i') })
      expect(button).toHaveClass('active')
    }
  })
})
