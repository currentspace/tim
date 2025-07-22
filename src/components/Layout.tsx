import { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { css, cx } from '../../styled-system/css'
import {
  typography,
  flexLayout,
  pageContainer,
  button,
  badge as badgeRecipe,
  toggle,
} from '../../styled-system/recipes'

interface LayoutProps {
  children: ReactNode
  showBackButton?: boolean
  currentView?: string
  badge?: 'ANTICIPATED' | 'TIMELINE' | 'EXPOSURE'
  toggleOptions?: {
    left: string
    right: string
    onToggle: (value: 'left' | 'right') => void
    current: 'left' | 'right'
  }
}

const appLayoutStyles = cx(pageContainer({ variant: 'page', background: 'gray' }))

const appHeaderStyles = cx(
  flexLayout({ align: 'center' }),
  pageContainer({ variant: 'header', background: 'white' }),
  css({
    padding: '24px 48px',
    minHeight: '80px',
  }),
)

const headerLeftStyles = flexLayout({ align: 'center', gap: 'xl', grow: '1' })
const headerCenterStyles = flexLayout({ align: 'center', justify: 'center', gap: 'sm', grow: '1' })
const headerRightStyles = flexLayout({ justify: 'end', grow: '1' })

const backButtonStyles = cx(
  button({ variant: 'ghost', size: 'md' }),
  typography({ variant: 'backButton' }),
  css({
    gap: '8px',
    textDecoration: 'none',
    '&:hover': {
      color: 'text.primary',
    },
  }),
)

const toggleContainerStyles = cx(
  flexLayout({ align: 'center', gap: 'sm' }),
  css({
    padding: '12px 20px',
    background: 'bg.secondary',
    borderRadius: '32px',
    whiteSpace: 'nowrap',
  }),
)

const toggleLabelStyles = cx(
  typography({ variant: 'toggleLabel' }),
  css({
    transition: 'all token(durations.base) token(easings.default)',
    padding: '0 4px',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&[data-active="true"]': {
      color: 'text.primary',
      fontWeight: 'semibold',
    },
  }),
)

const toggleSwitchStyles = toggle({ size: 'md' })

function Layout({ children, showBackButton, currentView, badge, toggleOptions }: LayoutProps) {
  return (
    <div className={appLayoutStyles}>
      <header className={appHeaderStyles}>
        <div className={headerLeftStyles}>
          {showBackButton && (
            <Link to="/" className={backButtonStyles}>
              ← Back to Tariff View
            </Link>
          )}
          {toggleOptions && (
            <div className={flexLayout({ align: 'center', gap: 'xl' })}>
              <div className={toggleContainerStyles}>
                <span className={toggleLabelStyles} data-active={toggleOptions.current === 'left'}>
                  {toggleOptions.left}
                </span>
                <button
                  className={cx(
                    toggleSwitchStyles,
                    css({
                      background: toggleOptions.current === 'right' ? 'accent' : '#e5e7eb',
                    }),
                  )}
                  data-checked={toggleOptions.current === 'right'}
                  onClick={() => {
                    toggleOptions.onToggle(toggleOptions.current === 'right' ? 'left' : 'right')
                  }}
                />
                <span
                  className={toggleLabelStyles}
                  data-active={toggleOptions.current === 'right'}
                  title="Tariff Exposure & Rate"
                >
                  {toggleOptions.right}
                </span>
              </div>

              <nav className={flexLayout({ gap: 'sm' })}>
                <Link
                  to="/"
                  className={cx(
                    button({ variant: 'tab' }),
                    typography({ variant: 'navTab' }),
                    css({
                      textDecoration: 'none',
                    }),
                  )}
                >
                  Timeline
                </Link>
                <span
                  className={cx(
                    button({ variant: 'tab' }),
                    typography({ variant: 'navTab' }),
                    css({
                      borderBottomColor: 'accent',
                      color: 'text.primary',
                    }),
                  )}
                  data-active="true"
                >
                  Chart
                </span>
              </nav>
            </div>
          )}
        </div>

        <div className={headerCenterStyles}>
          {currentView && (
            <h1 className={cx(typography({ variant: 'pageTitle' }), css({ margin: 0 }))}>
              {currentView}
            </h1>
          )}
          {badge && (
            <span
              className={badgeRecipe({
                variant: badge.toLowerCase() as 'anticipated' | 'timeline' | 'exposure',
              })}
            >
              {badge}
            </span>
          )}
        </div>

        <div className={headerRightStyles}>
          <div className={css({ textAlign: 'right' })}>
            <span
              className={cx(
                typography({ variant: 'companyTitle' }),
                css({
                  display: 'block',
                }),
              )}
            >
              Staples Technology Solutions
            </span>
            <span
              className={cx(
                typography({ variant: 'captionText' }),
                css({ display: 'block', marginTop: '2px' }),
              )}
            >
              TIM Dashboard
            </span>
          </div>
        </div>
      </header>

      <main className={css({ flex: 1, width: '100%' })}>{children}</main>
    </div>
  )
}

export default Layout
