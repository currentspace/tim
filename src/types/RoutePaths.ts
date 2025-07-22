export const RoutePaths = {
  ROOT: '/',
  ANTICIPATED_TARIFF: '/anticipated-tariff',
  COUNTRY_EXPOSURE: '/country-exposure',
  COMPANY_TIMELINE: '/company-timeline',
  COUNTRY_TIMELINE: '/country-timeline',
  STARTUP_UNIVERSE: '/startup-universe',
  NOTIFICATIONS: '/notifications',
} as const

export type RoutePath = (typeof RoutePaths)[keyof typeof RoutePaths]

export function isValidRoute(route: string): route is RoutePath {
  return Object.values(RoutePaths).includes(route as RoutePath)
}
