/**
 * Font constants for use in D3 visualizations and other JavaScript contexts
 * where CSS variables cannot be used directly
 */

export const FONTS = {
  EDITORIAL: 'ABC Monument Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  DATA: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const

export const FONT_WEIGHTS = {
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
} as const

export const FONT_SIZES = {
  XS: '0.75rem', // 12px
  SM: '0.875rem', // 14px
  BASE: '1rem', // 16px
  LG: '1.125rem', // 18px
  XL: '1.25rem', // 20px
  '2XL': '1.5rem', // 24px
  '3XL': '1.875rem', // 30px
  '4XL': '2.25rem', // 36px
} as const
