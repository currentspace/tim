import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders headline', () => {
    render(<App />)
    expect(screen.getByText('Charles - Data Visualization App')).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Startup Universe/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tariff Impact/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Country Exposure/i })).toBeInTheDocument()
  })

  it('switches between views on button click', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initially shows Tariff Impact
    expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()

    // Click Startup Universe
    const startupUniverseButton = screen.getByRole('button', { name: /Startup Universe/i })
    await user.click(startupUniverseButton)

    // Should show Startup Universe (wait for it to load)
    expect(await screen.findByText('The Startup Universe')).toBeInTheDocument()

    // Click Country Exposure
    const countryExposureButton = screen.getByRole('button', { name: /Country Exposure/i })
    await user.click(countryExposureButton)

    // Should show Country Exposure
    expect(screen.getByText('HP TIM Dashboard')).toBeInTheDocument()

    // Click back to Tariff Impact
    const tariffImpactButton = screen.getByRole('button', { name: /Tariff Impact/i })
    await user.click(tariffImpactButton)

    // Should show Tariff Impact again
    expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
  })
})
