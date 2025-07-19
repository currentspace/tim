import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartupUniverse from './StartupUniverse'

describe('StartupUniverse', () => {
  it('renders title and subtitle', () => {
    render(<StartupUniverse />)
    expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
    expect(screen.getByText('A Visual Guide to Startups, Founders & Venture Capitalists')).toBeInTheDocument()
  })

  it('renders control sliders', () => {
    render(<StartupUniverse />)
    expect(screen.getByText(/Link Distance:/)).toBeInTheDocument()
    expect(screen.getByText(/Force Strength:/)).toBeInTheDocument()
    expect(screen.getByText(/Collision Radius:/)).toBeInTheDocument()
    expect(screen.getByText(/Center Gravity:/)).toBeInTheDocument()
  })

  it('renders legend items', () => {
    render(<StartupUniverse />)
    expect(screen.getByText('Venture Capitalists')).toBeInTheDocument()
    expect(screen.getByText('Startups')).toBeInTheDocument()
    expect(screen.getByText('Founders')).toBeInTheDocument()
  })

  it('renders info panel', () => {
    render(<StartupUniverse />)
    expect(screen.getByText(/Hover over nodes to see connections/)).toBeInTheDocument()
  })
})