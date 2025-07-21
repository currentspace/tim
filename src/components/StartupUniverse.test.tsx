import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import StartupUniverse from './StartupUniverse'

describe('StartupUniverse', () => {
  // Note: These tests verify basic component rendering with Suspense.
  // For comprehensive Suspense state testing (loading/error states),
  // see docs/TESTING_SUSPENSE.md for recommended patterns using
  // dependency injection or module mocking without polluting production code.
  
  it('renders title and subtitle', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<StartupUniverse />)
    })

    await waitFor(() => {
      expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
      expect(
        screen.getByText('A Visual Guide to Startups, Founders & Venture Capitalists'),
      ).toBeInTheDocument()
    })
  })

  it('shows loading state initially', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<StartupUniverse />)
    })

    expect(screen.getByText('Loading visualization data...')).toBeInTheDocument()
  })

  it('renders info panel', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<StartupUniverse />)
    })

    await waitFor(() => {
      expect(screen.getByText(/Hover over nodes to see connections/)).toBeInTheDocument()
    })
  })
})
