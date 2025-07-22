import { css, cx } from '../../styled-system/css'
import {
  typography,
  flexLayout,
  pageContainer,
  navItem,
  spacing,
} from '../../styled-system/recipes'

export type ViewType =
  | 'startup'
  | 'tariff'
  | 'exposure'
  | 'timeline'
  | 'notifications'
  | 'country-timeline'

interface NavigationItem {
  id: ViewType
  label: string
  description: string
  category: 'visualization' | 'settings'
}

const navigationItems: NavigationItem[] = [
  {
    id: 'tariff',
    label: 'Anticipated Tariff Impact',
    description: 'View anticipated tariff impact by company',
    category: 'visualization',
  },
  {
    id: 'timeline',
    label: 'Company Tariff Timeline',
    description: 'Track tariff rates over time by company',
    category: 'visualization',
  },
  {
    id: 'country-timeline',
    label: 'Country Tariff Timeline',
    description: 'Track tariff rates over time by country',
    category: 'visualization',
  },
  {
    id: 'exposure',
    label: 'Country Exposure',
    description: 'Analyze revenue exposure by country',
    category: 'visualization',
  },
  {
    id: 'startup',
    label: 'Startup Universe',
    description: 'Explore the startup ecosystem network',
    category: 'visualization',
  },
  {
    id: 'notifications',
    label: 'Notification Settings',
    description: 'Configure alerts and notifications',
    category: 'settings',
  },
]

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

function Navigation({ currentView, onViewChange }: NavigationProps) {
  const visualizations = navigationItems.filter((item) => item.category === 'visualization')
  const settings = navigationItems.filter((item) => item.category === 'settings')

  const getNavItemStyles = (isActive: boolean) =>
    cx(navItem({ active: isActive }), isActive && 'active')

  return (
    <nav
      className={cx(
        flexLayout({ direction: 'column' }),
        css({
          background: 'bg.primary',
          borderRight: '1px solid',
          borderColor: 'border.DEFAULT',
          height: '100vh',
          width: '320px',
          overflowY: 'auto',

          '@media (max-width: 768px)': {
            position: 'fixed',
            left: '-320px',
            zIndex: 1000,
            transition: 'left 0.3s ease',
            '&.open': {
              left: 0,
            },
          },
        }),
      )}
    >
      <div
        className={cx(
          pageContainer({ padding: 'lg', border: 'bottom' }),
          css({ borderColor: 'border.DEFAULT' }),
        )}
      >
        <h1 className={typography({ variant: 'editorialDisplay', size: 'lg', m: '0' })}>
          Staples Technology Solutions
        </h1>
        <p className={typography({ variant: 'dataLabel', size: 'sm', mt: 'xs', mb: '0' })}>
          TIM Dashboard
        </p>
      </div>

      <div
        className={cx(flexLayout({ direction: 'column', grow: '1' }), css({ padding: '1.5rem 0' }))}
      >
        <div className={spacing({ mb: 'xl' })}>
          <h2
            className={cx(typography({ variant: 'sectionTitle', mb: 'sm' }), spacing({ ml: 'lg' }))}
          >
            Visualizations
          </h2>
          <div className={flexLayout({ direction: 'column' })}>
            {visualizations.map((item) => (
              <button
                key={item.id}
                className={getNavItemStyles(currentView === item.id)}
                onClick={() => {
                  onViewChange(item.id)
                }}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span
                  className={typography({
                    variant: 'dataValue',
                    size: 'sm',
                    mb: 'xs',
                    ...(currentView === item.id && { weight: 'semibold', color: 'accent' }),
                  })}
                >
                  {item.label}
                </span>
                <span
                  className={cx(
                    typography({ variant: 'dataLabel', size: 'xs' }),
                    css({
                      lineHeight: '1.4',
                      '@media (max-width: 768px)': {
                        display: 'none',
                      },
                    }),
                  )}
                >
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={spacing({ mb: 'xl' })}>
          <h2
            className={cx(typography({ variant: 'sectionTitle', mb: 'sm' }), spacing({ ml: 'lg' }))}
          >
            Settings
          </h2>
          <div className={flexLayout({ direction: 'column' })}>
            {settings.map((item) => (
              <button
                key={item.id}
                className={getNavItemStyles(currentView === item.id)}
                onClick={() => {
                  onViewChange(item.id)
                }}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span
                  className={typography({
                    variant: 'dataValue',
                    size: 'sm',
                    mb: 'xs',
                    ...(currentView === item.id && { weight: 'semibold', color: 'accent' }),
                  })}
                >
                  {item.label}
                </span>
                <span
                  className={cx(
                    typography({ variant: 'dataLabel', size: 'xs' }),
                    css({
                      lineHeight: '1.4',
                      '@media (max-width: 768px)': {
                        display: 'none',
                      },
                    }),
                  )}
                >
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cx(
          pageContainer({ padding: 'md', border: 'top' }),
          css({ borderColor: 'border.DEFAULT', marginTop: 'auto' }),
        )}
      >
        <p className={typography({ variant: 'dataLabel', size: 'xs', align: 'center', m: '0' })}>
          Version 1.0.0
        </p>
      </div>
    </nav>
  )
}

export default Navigation
