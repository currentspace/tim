import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartupUniverseV3 from './StartupUniverseV3'

describe('StartupUniverseV3', () => {
  it('renders title and subtitle', () => {
    render(<StartupUniverseV3 />)
    expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    expect(screen.getByText('A Visual Guide to Startups, Founders & Venture Capitalists')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<StartupUniverseV3 />)
    expect(screen.getByText('Loading visualization data...')).toBeInTheDocument()
  })

  it('renders info panel', () => {
    render(<StartupUniverseV3 />)
    expect(screen.getByText(/Hover over nodes to see connections/)).toBeInTheDocument()
  })
})