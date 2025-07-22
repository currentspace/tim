import { defineRecipe } from '@pandacss/dev'

export const typography = defineRecipe({
  className: 'typography',
  description: 'Typography styles matching Figma specifications',
  base: {
    margin: 0,
  },
  variants: {
    variant: {
      // ABC Monument Grotesk styles
      editorialDisplay: {
        fontFamily: 'editorial',
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: '1.2',
        letterSpacing: 'tight',
      },
      pageTitle: {
        fontFamily: 'editorial',
        fontSize: '24px',
        fontWeight: 'bold',
        lineHeight: '1.2',
        letterSpacing: 'tight',
      },
      sectionHeader: {
        fontFamily: 'editorial',
        fontSize: '18px',
        fontWeight: 'semibold',
        lineHeight: '1.3',
        letterSpacing: 'snug',
      },
      sectionTitle: {
        fontFamily: 'editorial',
        fontSize: '16px',
        fontWeight: 'bold',
        lineHeight: '1.3',
        letterSpacing: 'snug',
      },
      companyTitle: {
        fontFamily: 'editorial',
        fontSize: '16px',
        fontWeight: 'semibold',
        lineHeight: '1.3',
        letterSpacing: 'normal',
      },

      // Inter data styles
      dataValue: {
        fontFamily: 'data',
        fontSize: '16px',
        fontWeight: 'semibold',
        color: 'text.primary',
        lineHeight: '1.4',
        fontVariantNumeric: 'tabular-nums',
      },
      dataLabel: {
        fontFamily: 'data',
        fontSize: '14px',
        fontWeight: 'medium',
        color: 'text.muted',
        lineHeight: '1.4',
      },
      captionText: {
        fontFamily: 'data',
        fontSize: '12px',
        fontWeight: 'regular',
        color: 'text.muted',
        lineHeight: '1.3',
      },
      timelineLabel: {
        fontFamily: 'data',
        fontSize: '11px',
        fontWeight: 'regular',
        color: 'text.muted',
        lineHeight: '1.3',
      },

      // Navigation and UI
      navTab: {
        fontFamily: 'data',
        fontSize: '14px',
        fontWeight: 'medium',
        lineHeight: '1.3',
        color: 'text.secondary',
      },
      badgeText: {
        fontFamily: 'editorial',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        lineHeight: '1.2',
        color: 'white',
      },
      toggleLabel: {
        fontFamily: 'data',
        fontSize: '14px',
        fontWeight: 'medium',
        lineHeight: '1.3',
        color: 'text.muted',
      },
      backButton: {
        fontFamily: 'data',
        fontSize: '14px',
        fontWeight: 'medium',
        lineHeight: '1.3',
        color: 'text.secondary',
      },
    },

    // Size overrides (for flexibility)
    size: {
      xs: { fontSize: '11px' },
      sm: { fontSize: '12px' },
      base: { fontSize: '14px' },
      lg: { fontSize: '16px' },
      xl: { fontSize: '18px' },
      '2xl': { fontSize: '24px' },
      '3xl': { fontSize: '32px' },
    },

    weight: {
      regular: { fontWeight: 'regular' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },

    color: {
      primary: { color: 'text.primary' },
      secondary: { color: 'text.secondary' },
      muted: { color: 'text.muted' },
      accent: { color: 'accent' },
      orange: { color: 'orange.DEFAULT' },
      white: { color: 'white' },
      alert: { color: 'alert.DEFAULT' },
    },

    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },

    // Margin variants (8px grid)
    m: {
      0: { margin: 0 },
      1: { margin: '8px' },
      2: { margin: '16px' },
      3: { margin: '24px' },
      4: { margin: '32px' },
      xs: { margin: '8px' },
      sm: { margin: '16px' },
      md: { margin: '24px' },
      lg: { margin: '32px' },
      xl: { margin: '48px' },
    },

    mb: {
      0: { marginBottom: 0 },
      1: { marginBottom: '8px' },
      2: { marginBottom: '16px' },
      3: { marginBottom: '24px' },
      4: { marginBottom: '32px' },
      xs: { marginBottom: '8px' },
      sm: { marginBottom: '16px' },
      md: { marginBottom: '24px' },
      lg: { marginBottom: '32px' },
      xl: { marginBottom: '48px' },
    },

    mt: {
      0: { marginTop: 0 },
      1: { marginTop: '8px' },
      2: { marginTop: '16px' },
      3: { marginTop: '24px' },
      4: { marginTop: '32px' },
      xs: { marginTop: '8px' },
      sm: { marginTop: '16px' },
      md: { marginTop: '24px' },
      lg: { marginTop: '32px' },
      xl: { marginTop: '48px' },
    },

    // Text transform
    transform: {
      none: { textTransform: 'none' },
      uppercase: { textTransform: 'uppercase' },
      lowercase: { textTransform: 'lowercase' },
      capitalize: { textTransform: 'capitalize' },
    },
  },

  defaultVariants: {
    variant: 'dataValue',
    color: 'primary',
  },
})
