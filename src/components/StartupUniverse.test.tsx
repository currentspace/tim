import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import StartupUniverse from './StartupUniverse'
import { createDeferredPromise } from '../test/testUtils'
import type { NetworkData } from '../types/network'

// Mock network data for testing
const mockNetworkData: NetworkData = {
  nodes: [
    {
      id: '1',
      name: 'Test Startup',
      type: 'startup',
      fundingAmount: 5000000,
      founded: 2020,
      category: 'Technology',
    },
    {
      id: '2',
      name: 'Test VC',
      type: 'vc',
      investments: 25,
    },
    {
      id: '3',
      name: 'Test Founder',
      type: 'founder',
      companies: 3,
    },
  ],
  links: [
    {
      source: '1',
      target: '2',
      value: 5000000,
      type: 'investment',
    },
    {
      source: '1',
      target: '3',
      value: 1,
      type: 'founded',
    },
  ],
}

describe('StartupUniverse', () => {
  // Note: These tests verify basic component rendering with Suspense.
  // For comprehensive Suspense state testing (loading/error states),
  // see docs/TESTING_SUSPENSE.md for recommended patterns using
  // dependency injection or module mocking without polluting production code.

  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('shows loading state and then content with deferred data', async () => {
    // Using dependency injection pattern as recommended in docs/TESTING_SUSPENSE.md
    const { promise, resolve } = createDeferredPromise<NetworkData>()

    // Create a loader that returns our controlled promise
    const testLoader = () => promise

    // Render within act but don't await the promise resolution
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<StartupUniverse dataLoader={testLoader} />)
    })

    // Verify loading state is shown immediately
    expect(screen.getByText('Loading visualization data...')).toBeInTheDocument()
    // The info panel is outside Suspense boundary, so it's always visible
    expect(screen.getByText(/Hover over nodes to see connections/)).toBeInTheDocument()
    // But the controls should not be visible yet
    expect(screen.queryByText(/Link Distance:/)).not.toBeInTheDocument()

    // Simulate data loading after a delay
    await act(async () => {
      // Use setTimeout to simulate network delay
      await new Promise<void>((resolveTimeout) => {
        setTimeout(() => {
          resolve(mockNetworkData)
          resolveTimeout()
        }, 100)
      })
    })

    // Verify content is shown after data loads
    await waitFor(() => {
      expect(screen.queryByText('Loading visualization data...')).not.toBeInTheDocument()
      expect(screen.getByText('The Startup Universe')).toBeInTheDocument()
      // Controls should now be visible
      expect(screen.getByText(/Link Distance:/)).toBeInTheDocument()
    })
  })

  it('shows error state when data loading fails', async () => {
    // Using dependency injection pattern with error scenario
    const { promise, reject } = createDeferredPromise<NetworkData>()

    // Create a loader that returns our controlled promise
    const testLoader = () => promise

    // Render within act
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<StartupUniverse dataLoader={testLoader} />)
    })

    // Verify loading state is shown initially
    expect(screen.getByText('Loading visualization data...')).toBeInTheDocument()
    // Silence React error boundary log noise for this test only
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const errorMessage = 'Failed to load network data'
    // Simulate error after a delay
    await act(async () => {
      await new Promise<void>((resolveTimeout) => {
        setTimeout(() => {
          reject(new Error(errorMessage))
          resolveTimeout()
        }, 100)
      })
    })

    // Verify error state is shown
    await waitFor(() => {
      expect(screen.queryByText('Loading visualization data...')).not.toBeInTheDocument()
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
      expect(screen.getByText(/Failed to load network data/)).toBeInTheDocument()
    })

    // Assert that React called console.error (which means the error boundary ran)
    expect(errorSpy.mock.calls.flat().some((arg) => String(arg).includes(errorMessage))).toBe(true)
    errorSpy.mockRestore()
  })
})
