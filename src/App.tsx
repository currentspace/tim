import { Outlet, useLocation, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TopNavigation from './components/TopNavigation'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { ROUTE_CONFIG } from './routes'
import { css, cx } from '../styled-system/css'
import { typography, flexLayout, navLink, badge, pageContainer } from '../styled-system/recipes'

const appStyles = cx(
  pageContainer({ variant: 'page', background: 'gray' }),
  flexLayout({ direction: 'column' }),
)

const appContentStyles = css({
  flex: '1',
  overflow: 'auto',
})

function App() {
  const location = useLocation()

  // Find current route info from config
  const currentRoute =
    ROUTE_CONFIG.find((route) => route.path === location.pathname) ?? ROUTE_CONFIG[0]

  return (
    <div className={appStyles}>
      <TopNavigation
        leftSection={
          <div className={css({ minWidth: '140px' })}>
            <h3 className={typography({ variant: 'dataLabel', size: 'xs' })}>Current View</h3>
            <p className={typography({ variant: 'dataValue', size: 'base' })}>
              {currentRoute.view}
            </p>
          </div>
        }
        centerSection={
          <div className={flexLayout({ direction: 'column', align: 'center', gap: 'sm' })}>
            <nav className={flexLayout({ gap: 'sm' })}>
              {ROUTE_CONFIG.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={navLink({ active: location.pathname === path })}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <motion.div
              className={badge({
                variant: currentRoute.view.toLowerCase() as 'anticipated' | 'timeline' | 'exposure',
              })}
              key={currentRoute.view}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {currentRoute.view}
            </motion.div>
          </div>
        }
        rightSection={
          <div className={css({ textAlign: 'right', minWidth: '200px' })}>
            <h1
              className={typography({
                variant: 'editorialDisplay',
                size: 'base',
                transform: 'none',
              })}
            >
              Staples Technology Solutions
            </h1>
            <p
              className={typography({
                variant: 'dataLabel',
                size: 'xs',
                mt: 'xs',
              })}
            >
              TIM Dashboard
            </p>
          </div>
        }
      />
      <main className={appContentStyles}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
