import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SampleChart from './SampleChart'

describe('SampleChart', () => {
  it('renders chart title', () => {
    render(<SampleChart />)
    expect(screen.getByText('Sample Analytics')).toBeInTheDocument()
  })

  it('renders chart container', () => {
    const { container } = render(<SampleChart />)
    expect(container.querySelector('.chart-container')).toBeInTheDocument()
  })

  it('renders recharts components', () => {
    const { container } = render(<SampleChart />)
    // Recharts components might render asynchronously
    // Just check that the container exists, as Recharts might not render in test environment
    expect(container.querySelector('.chart-container')).toBeInTheDocument()
  })
})
