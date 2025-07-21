import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { createRouter, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from './routes'

// Create a test router with the route tree
function createTestRouter(initialPath = '/') {
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialPath],
  })

  return createRouter({
    routeTree,
    history: memoryHistory,
  })
}

describe('App', () => {
  it('renders the app container', async () => {
    const router = createTestRouter()
    const { container } = render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(container.querySelector('.app-no-sidebar')).toBeInTheDocument()
    })
  })

  it('renders default view (Anticipated Tariff Impact)', async () => {
    const router = createTestRouter()
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      // There are multiple ANTICIPATED elements, check for at least one
      expect(screen.getAllByText('ANTICIPATED').length).toBeGreaterThan(0)
      // Also multiple Staples Technology Solutions elements
      expect(screen.getAllByText('Staples Technology Solutions').length).toBeGreaterThan(0)
    })
  })

  it('has the correct initial view', async () => {
    const router = createTestRouter()
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      // Check for elements specific to AnticipatedTariffImpact
      // Multiple elements have this text due to header and component content
      expect(screen.getAllByText('Dollar Volume').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Tariff Exposure & Rate').length).toBeGreaterThan(0)
    })
  })

  it('renders without errors', () => {
    const router = createTestRouter()
    expect(() => render(<RouterProvider router={router} />)).not.toThrow()
  })
})
