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
    expect(screen.getByRole('button', { name: /Sample Charts/i })).toBeInTheDocument()
  })

  it('switches between views on button click', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Initially shows Startup Universe
    expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    
    // Click Sample Charts
    const sampleChartsButton = screen.getByRole('button', { name: /Sample Charts/i })
    await user.click(sampleChartsButton)
    
    // Should show coming soon message
    expect(screen.getByText('More visualizations coming soon!')).toBeInTheDocument()
    
    // Click back to Startup Universe
    const startupUniverseButton = screen.getByRole('button', { name: /Startup Universe/i })
    await user.click(startupUniverseButton)
    
    // Should show Startup Universe again
    expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
  })
})