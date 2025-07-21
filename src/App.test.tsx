import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders headline', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Data Visualization App')).toBeInTheDocument()
    })
  })

  it('shows navigation buttons', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Startup Universe/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Tariff Impact/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Country Exposure/i })).toBeInTheDocument()
    })
  })

  it('switches between views on button click', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initially shows Tariff Impact
    await waitFor(() => {
      expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
    })

    // Click Startup Universe
    const startupUniverseButton = screen.getByRole('button', { name: /Startup Universe/i })
    await user.click(startupUniverseButton)

    // Should show Startup Universe (wait for it to load)
    await waitFor(() => {
      expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    })

    // Click Country Exposure
    const countryExposureButton = screen.getByRole('button', { name: /Country Exposure/i })
    await user.click(countryExposureButton)

    // Should show Country Exposure
    await waitFor(() => {
      expect(screen.getByText('HP TIM Dashboard')).toBeInTheDocument()
    })

    // Click back to Tariff Impact
    const tariffImpactButton = screen.getByRole('button', { name: /Tariff Impact/i })
    await user.click(tariffImpactButton)

    // Should show Tariff Impact again
    await waitFor(() => {
      expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
    })
  })
})
