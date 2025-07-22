import { use, useState, Suspense, startTransition } from 'react'
import NetworkGraph from './NetworkGraph'
import LoadingSpinner from './LoadingSpinner'
import ErrorBoundary from './ErrorBoundary'
import getNetworkData from '../data/networkDataProvider'
import { css, cx } from '../../styled-system/css'
import { typography, flexLayout, pageContainer, spacing } from '../../styled-system/recipes'
import { formStyles } from '../styles/shared'
import { D3_COLORS } from '../constants/colors'

// NetworkVisualization component that uses React 19's use hook
interface NetworkVisualizationProps {
  dataLoader?: () => Promise<import('../types/network').NetworkData>
}

function NetworkVisualization({ dataLoader = getNetworkData }: NetworkVisualizationProps) {
  // React 19's use hook automatically handles Suspense
  const data = use(dataLoader())

  const [linkDistance, setLinkDistance] = useState(150)
  const [chargeStrength, setChargeStrength] = useState(-300)
  const [collisionRadius, setCollisionRadius] = useState(30)
  const [centerStrength, setCenterStrength] = useState(0.05)

  // Use startTransition to avoid replacing visible content with loading state
  const updateParam =
    (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        setter(Number(e.target.value))
      })
    }

  return (
    <>
      <div
        className={cx(
          pageContainer({ background: 'gray', padding: 'md' }),
          css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
            borderRadius: 'lg',
          }),
        )}
      >
        <div className={flexLayout({ direction: 'column' })}>
          <label
            className={cx(
              typography({ variant: 'dataLabel', weight: 'medium' }),
              flexLayout({ direction: 'column', gap: 'sm' }),
              css({ fontSize: '0.9rem' }),
            )}
          >
            Link Distance: {linkDistance}
            <input
              type="range"
              min="50"
              max="300"
              value={linkDistance}
              onChange={updateParam(setLinkDistance)}
              className={formStyles.rangeSlider}
            />
          </label>
        </div>

        <div className={flexLayout({ direction: 'column' })}>
          <label
            className={cx(
              typography({ variant: 'dataLabel', weight: 'medium' }),
              flexLayout({ direction: 'column', gap: 'sm' }),
              css({ fontSize: '0.9rem' }),
            )}
          >
            Force Strength: {chargeStrength}
            <input
              type="range"
              min="-500"
              max="-100"
              value={chargeStrength}
              onChange={updateParam(setChargeStrength)}
              className={formStyles.rangeSlider}
            />
          </label>
        </div>

        <div className={flexLayout({ direction: 'column' })}>
          <label
            className={cx(
              typography({ variant: 'dataLabel', weight: 'medium' }),
              flexLayout({ direction: 'column', gap: 'sm' }),
              css({ fontSize: '0.9rem' }),
            )}
          >
            Collision Radius: {collisionRadius}
            <input
              type="range"
              min="10"
              max="50"
              value={collisionRadius}
              onChange={updateParam(setCollisionRadius)}
              className={formStyles.rangeSlider}
            />
          </label>
        </div>

        <div className={flexLayout({ direction: 'column' })}>
          <label
            className={cx(
              typography({ variant: 'dataLabel', weight: 'medium' }),
              flexLayout({ direction: 'column', gap: 'sm' }),
              css({ fontSize: '0.9rem' }),
            )}
          >
            Center Gravity: {centerStrength.toFixed(2)}
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={centerStrength}
              onChange={updateParam(setCenterStrength)}
              className={formStyles.rangeSlider}
            />
          </label>
        </div>
      </div>

      <div className={flexLayout({ gap: 'xl', justify: 'center' })}>
        <div className={flexLayout({ align: 'center', gap: 'sm' })}>
          <span
            className={css({
              width: '12px',
              height: '12px',
              borderRadius: 'full',
              display: 'inline-block',
              backgroundColor: D3_COLORS.CHART_BLUE,
            })}
          ></span>
          <span className={typography({ variant: 'dataLabel', color: 'muted' })}>
            Venture Capitalists
          </span>
        </div>
        <div className={flexLayout({ align: 'center', gap: 'sm' })}>
          <span
            className={css({
              width: '12px',
              height: '12px',
              borderRadius: 'full',
              display: 'inline-block',
              backgroundColor: D3_COLORS.CHART_PURPLE,
            })}
          ></span>
          <span className={typography({ variant: 'dataLabel', color: 'muted' })}>Startups</span>
        </div>
        <div className={flexLayout({ align: 'center', gap: 'sm' })}>
          <span
            className={css({
              width: '12px',
              height: '12px',
              borderRadius: 'full',
              display: 'inline-block',
              backgroundColor: D3_COLORS.CHART_GREEN,
            })}
          ></span>
          <span className={typography({ variant: 'dataLabel', color: 'muted' })}>Founders</span>
        </div>
      </div>

      <NetworkGraph
        data={data}
        linkDistance={linkDistance}
        chargeStrength={chargeStrength}
        collisionRadius={collisionRadius}
        centerStrength={centerStrength}
      />
    </>
  )
}

interface StartupUniverseProps {
  dataLoader?: () => Promise<import('../types/network').NetworkData>
}

function StartupUniverse({ dataLoader }: StartupUniverseProps = {}) {
  return (
    <div
      className={cx(
        pageContainer({ variant: 'section' }),
        css({
          maxWidth: '1400px',
          margin: '0 auto',
        }),
      )}
    >
      <h2
        className={typography({
          variant: 'editorialDisplay',
          size: '3xl',
          mb: 'sm',
          transform: 'none',
        })}
      >
        The Startup Universe
      </h2>
      <p
        className={typography({
          variant: 'dataLabel',
          size: 'lg',
          mb: 'xl',
        })}
      >
        A Visual Guide to Startups, Founders & Venture Capitalists
      </p>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <NetworkVisualization dataLoader={dataLoader} />
        </Suspense>
      </ErrorBoundary>

      <div
        className={cx(
          pageContainer({ background: 'gray', padding: 'md' }),
          spacing({ mt: 'xl' }),
          css({
            borderRadius: 'md',
            textAlign: 'center',
          }),
        )}
      >
        <p
          className={typography({
            variant: 'dataLabel',
            align: 'center',
            mt: 'sm',
            mb: 'sm',
            size: 'sm',
          })}
        >
          Hover over nodes to see connections. Drag nodes to reposition them. Zoom and pan to
          explore.
        </p>
        <p
          className={typography({
            variant: 'dataLabel',
            align: 'center',
            mt: 'sm',
            mb: 'sm',
            size: 'sm',
          })}
        >
          Node size represents: VCs (number of investments), Startups (funding amount), Founders
          (companies founded)
        </p>
      </div>
    </div>
  )
}

export default StartupUniverse
