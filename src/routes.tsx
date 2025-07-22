import { createRootRoute, createRoute, createRouter, RouteComponent } from '@tanstack/react-router'
import App from './App'
import AnticipatedTariffImpact from './components/AnticipatedTariffImpact'
import CountryExposure from './components/CountryExposure'
import TariffRateTimeline from './components/TariffRateTimeline'
import CountryTariffTimeline from './components/CountryTariffTimeline'
import StartupUniverse from './components/StartupUniverse'
import NotificationSettings from './components/NotificationSettings'
import { RoutePaths, RoutePath } from './types/RoutePaths'

// Type for route configuration
export interface RouteConfig {
  path: RoutePath
  component: RouteComponent
  label: string
  view: string
}

// Centralized route configuration - single source of truth
export const ROUTE_CONFIG: readonly RouteConfig[] = [
  {
    path: RoutePaths.ROOT,
    component: AnticipatedTariffImpact,
    label: 'Anticipated Tariff Impact',
    view: 'ANTICIPATED',
  },
  {
    path: RoutePaths.COUNTRY_EXPOSURE,
    component: CountryExposure,
    label: 'Country Exposure',
    view: 'EXPOSURE',
  },
  {
    path: RoutePaths.COMPANY_TIMELINE,
    component: TariffRateTimeline,
    label: 'Company Timeline',
    view: 'TIMELINE',
  },
  {
    path: RoutePaths.COUNTRY_TIMELINE,
    component: CountryTariffTimeline,
    label: 'Country Timeline',
    view: 'TIMELINE',
  },
  {
    path: RoutePaths.STARTUP_UNIVERSE,
    component: StartupUniverse,
    label: 'Startup Universe',
    view: 'UNIVERSE',
  },
  {
    path: RoutePaths.NOTIFICATIONS,
    component: NotificationSettings,
    label: 'Notifications',
    view: 'NOTIFICATIONS',
  },
] as const

// Create the root route
export const rootRoute = createRootRoute({
  component: App,
})

// Create routes dynamically from config
const routes = ROUTE_CONFIG.map((config) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: config.path,
    component: config.component,
  }),
)

// Export individual route references for backwards compatibility
export const rootIndexRoute = routes[0]
export const countryExposureRoute =
  routes.find((r) => r.path === RoutePaths.COUNTRY_EXPOSURE) ?? routes[0]
export const companyTimelineRoute =
  routes.find((r) => r.path === RoutePaths.COMPANY_TIMELINE) ?? routes[0]
export const countryTimelineRoute =
  routes.find((r) => r.path === RoutePaths.COUNTRY_TIMELINE) ?? routes[0]
export const startupUniverseRoute =
  routes.find((r) => r.path === RoutePaths.STARTUP_UNIVERSE) ?? routes[0]
export const notificationSettingsRoute =
  routes.find((r) => r.path === RoutePaths.NOTIFICATIONS) ?? routes[0]

// Create the route tree
export const routeTree = rootRoute.addChildren(routes)

// Create the router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
