import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartupUniverse from './StartupUniverse'

describe('StartupUniverse', () => {
  it('renders title and subtitle', () => {
    render(<StartupUniverse />)
    expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    expect(screen.getByText('A Visual Guide to Startups, Founders & Venture Capitalists')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<StartupUniverse />)
    expect(screen.getByText('Loading visualization data...')).toBeInTheDocument()
  })

  it('renders info panel', () => {
    render(<StartupUniverse />)
    expect(screen.getByText(/Hover over nodes to see connections/)).toBeInTheDocument()
  })
})