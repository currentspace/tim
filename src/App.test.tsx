import { it, expect, describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from './test/testRouter'

describe('App', () => {
  it('renders without crashing', async () => {
    await renderWithRouter()

    // Check for company branding - there are multiple instances
    const companyNames = screen.getAllByText('Staples Technology Solutions')
    expect(companyNames.length).toBeGreaterThan(0)
  })

  it('renders the navigation', async () => {
    await renderWithRouter()

    // Check for company branding - there are multiple instances
    const companyNames = screen.getAllByText('Staples Technology Solutions')
    expect(companyNames.length).toBeGreaterThan(0)
    const dashboards = screen.getAllByText('TIM Dashboard')
    expect(dashboards.length).toBeGreaterThan(0)
  })

  it('renders the main navigation links', async () => {
    await renderWithRouter()

    // Check for navigation links
    expect(screen.getByText('Anticipated Tariff Impact')).toBeInTheDocument()
    expect(screen.getByText('Country Exposure')).toBeInTheDocument()
    expect(screen.getByText('Company Timeline')).toBeInTheDocument()
    expect(screen.getByText('Country Timeline')).toBeInTheDocument()
    expect(screen.getByText('Startup Universe')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders the badge', async () => {
    await renderWithRouter()

    // The default badge should be ANTICIPATED - appears multiple times
    const badges = screen.getAllByText('ANTICIPATED')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('renders the anticipated tariff view by default', async () => {
    await renderWithRouter()

    // Check for elements specific to AnticipatedTariffImpact
    expect(screen.getByText('Current View')).toBeInTheDocument()
    // Use getAllByText since this text appears in multiple places
    const tariffElements = screen.getAllByText('Tariff Exposure & Rate')
    expect(tariffElements.length).toBeGreaterThan(0)
  })
})
