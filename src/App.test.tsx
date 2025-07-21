import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders navigation', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      // Check for navigation subtitle specifically
      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveTextContent('TIM Dashboard')
    })
  })

  it('shows navigation items', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Anticipated Tariff Impact')).toBeInTheDocument()
      expect(screen.getByText('Country Exposure')).toBeInTheDocument()
      expect(screen.getByText('Startup Universe')).toBeInTheDocument()
    })
  })

  it('switches between views on navigation click', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initially shows Tariff Impact
    await waitFor(() => {
      expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
    })

    // Click Startup Universe
    const startupButton = screen.getByRole('button', { name: /Startup Universe/i })
    await user.click(startupButton)

    // Should show Startup Universe (wait for it to load)
    await waitFor(() => {
      expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    })

    // Click Country Exposure
    const exposureButton = screen.getByRole('button', { name: /Country Exposure/i })
    await user.click(exposureButton)

    // Should show Country Exposure
    await waitFor(() => {
      expect(screen.getByText('HP TIM Dashboard')).toBeInTheDocument()
    })

    // Click back to Tariff Impact
    const tariffButton = screen.getByRole('button', { name: /Anticipated Tariff Impact/i })
    await user.click(tariffButton)

    // Should show Tariff Impact again
    await waitFor(() => {
      expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
    })
  })

  it('shows mobile menu toggle on small screens', () => {
    // Mock window.matchMedia for mobile view
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<App />)
    const menuToggle = screen.getByLabelText('Toggle navigation menu')
    expect(menuToggle).toBeInTheDocument()
  })
})
