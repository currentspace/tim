import { css, cx } from '../../styled-system/css'
import { flexLayout, typography } from '../../styled-system/recipes'

const loadingContainerStyles = cx(
  flexLayout({ justify: 'center', align: 'center' }),
  css({ minHeight: '400px' }),
)

const loadingSpinnerStyles = css({
  textAlign: 'center',
})

const spinnerStyles = css({
  width: '50px',
  height: '50px',
  margin: '0 auto 1rem',
  border: '3px solid',
  borderColor: 'bg.secondary',
  borderTopColor: 'accent',
  borderRadius: 'full',
  animation: 'spin 1s linear infinite',
})

const loadingTextStyles = typography({ variant: 'dataValue', color: 'muted' })

function LoadingSpinner() {
  return (
    <div className={loadingContainerStyles}>
      <div className={loadingSpinnerStyles}>
        <div className={spinnerStyles}></div>
        <p className={loadingTextStyles}>Loading visualization data...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
