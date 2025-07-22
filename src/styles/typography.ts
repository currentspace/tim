import { css } from '../../styled-system/css'

/**
 * Centralized typography system using Panda CSS
 * This replaces all scattered font-family declarations
 */

// Base typography mixins
export const editorialFont = css({
  fontFamily: 'editorial',
})

export const dataFont = css({
  fontFamily: 'data',
})

// Complete typography patterns
export const typography = {
  // Editorial/Heading styles
  h1: css({
    fontFamily: 'editorial',
    fontSize: '4xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    textTransform: 'uppercase',
  }),

  h2: css({
    fontFamily: 'editorial',
    fontSize: '3xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'snug',
  }),

  h3: css({
    fontFamily: 'editorial',
    fontSize: '2xl',
    fontWeight: 'semibold',
    lineHeight: 'snug',
  }),

  h4: css({
    fontFamily: 'editorial',
    fontSize: 'xl',
    fontWeight: 'semibold',
    lineHeight: 'snug',
  }),

  h5: css({
    fontFamily: 'editorial',
    fontSize: 'lg',
    fontWeight: 'medium',
    lineHeight: 'normal',
  }),

  h6: css({
    fontFamily: 'editorial',
    fontSize: 'base',
    fontWeight: 'medium',
    letterSpacing: 'wide',
    textTransform: 'uppercase',
  }),

  // Data styles
  body: css({
    fontFamily: 'data',
    fontSize: 'base',
    fontWeight: 'regular',
    lineHeight: 'normal',
  }),

  bodySmall: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'regular',
    lineHeight: 'normal',
  }),

  label: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
    letterSpacing: 'wide',
    textTransform: 'uppercase',
  }),

  dataValue: css({
    fontFamily: 'data',
    fontSize: 'base',
    fontWeight: 'semibold',
    fontVariantNumeric: 'tabular-nums',
  }),

  dataValueLarge: css({
    fontFamily: 'data',
    fontSize: 'lg',
    fontWeight: 'semibold',
    fontVariantNumeric: 'tabular-nums',
  }),

  caption: css({
    fontFamily: 'data',
    fontSize: 'xs',
    fontWeight: 'regular',
    color: 'text.muted',
  }),

  // Special styles
  badge: css({
    fontFamily: 'editorial',
    fontSize: 'xs',
    fontWeight: 'bold',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
  }),

  chartTitle: css({
    fontFamily: 'editorial',
    fontSize: '2xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  }),

  chartLabel: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
  }),

  tooltip: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: 'snug',
  }),
}

// Utility function to get font family string for D3
export const getFontFamily = (type: 'editorial' | 'data') => {
  return type === 'editorial'
    ? 'ABC Monument Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
}
