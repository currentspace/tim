import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { routeTree } from '../routes'
import { isValidRoute } from '../types/RoutePaths'

// For full app tests - uses the real route tree
export function renderWithRouter(initialPath = '/') {
  if (!isValidRoute(initialPath)) {
    throw new Error(`Invalid route path ${initialPath}`)
  }
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialPath],
  })

  const router = createRouter({
    routeTree,
    history: memoryHistory,
  })

  return {
    ...render(<RouterProvider router={router} />),
    router,
  }
}
