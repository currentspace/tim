import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'
import TariffRateTimeline from './components/TariffRateTimeline'
import CountryTariffTimeline from './components/CountryTariffTimeline'
import StartupUniverse from './components/StartupUniverse'
import NotificationSettings from './components/NotificationSettings'

// Create the root route
export const rootRoute = createRootRoute({
  component: App,
})

// Create individual routes
export const anticipatedTariffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AnticipatedTariffImpact,
})

export const countryExposureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/country-exposure',
  component: CountryExposure,
})

export const companyTimelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/company-timeline',
  component: TariffRateTimeline,
})

export const countryTimelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/country-timeline',
  component: CountryTariffTimeline,
})

export const startupUniverseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/startup-universe',
  component: StartupUniverse,
})

export const notificationSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationSettings,
})

// Create the route tree
export const routeTree = rootRoute.addChildren([
  anticipatedTariffRoute,
  countryExposureRoute,
  companyTimelineRoute,
  countryTimelineRoute,
  startupUniverseRoute,
  notificationSettingsRoute,
])

// Create the router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
