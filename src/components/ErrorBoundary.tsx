import { Component, ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { typography, button, spacing } from '../../styled-system/recipes'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className={cx(
              spacing({ p: 'xl' }),
              css({
                textAlign: 'center',
                color: 'alert.DEFAULT',
              }),
            )}
          >
            <h2
              className={typography({
                variant: 'editorialDisplay',
                size: '2xl',
                weight: 'semibold',
                mb: 'md',
                color: 'alert',
              })}
            >
              Something went wrong
            </h2>
            <p
              className={typography({
                variant: 'dataValue',
                size: 'base',
                color: 'secondary',
                mb: 'lg',
              })}
            >
              {this.state.error?.message}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
              }}
              className={button({ variant: 'danger', size: 'md' })}
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
