import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app container', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.app-no-sidebar')).toBeInTheDocument()
  })

  it('renders default view (Anticipated Tariff Impact)', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('ANTICIPATED')).toBeInTheDocument()
      expect(screen.getByText('Staples Technology Solutions')).toBeInTheDocument()
    })
  })

  it('has the correct initial view', () => {
    render(<App />)
    
    // Check for elements specific to AnticipatedTariffImpact
    expect(screen.getByText('Dollar Volume')).toBeInTheDocument()
    // Multiple elements have this text, so check for at least one
    expect(screen.getAllByText('Tariff Exposure & Rate').length).toBeGreaterThan(0)
  })

  it('renders without errors', () => {
    expect(() => render(<App />)).not.toThrow()
  })
})
