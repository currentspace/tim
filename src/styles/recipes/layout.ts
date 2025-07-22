import { defineRecipe } from '@pandacss/dev'

export const flexLayout = defineRecipe({
  className: 'flex-layout',
  description: 'Flexible box layout with common patterns',
  base: {
    display: 'flex',
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      rowReverse: { flexDirection: 'row-reverse' },
      columnReverse: { flexDirection: 'column-reverse' },
    },

    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },

    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },

    wrap: {
      wrap: { flexWrap: 'wrap' },
      nowrap: { flexWrap: 'nowrap' },
      reverse: { flexWrap: 'wrap-reverse' },
    },

    gap: {
      none: { gap: 0 },
      xs: { gap: 'xs' },
      sm: { gap: 'sm' },
      md: { gap: 'md' },
      lg: { gap: 'lg' },
      xl: { gap: 'xl' },
      '2xl': { gap: '2xl' },
    },

    grow: {
      '0': { flexGrow: 0 },
      '1': { flexGrow: 1 },
    },

    shrink: {
      '0': { flexShrink: 0 },
      '1': { flexShrink: 1 },
    },
  },

  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
  },
})

export const pageContainer = defineRecipe({
  className: 'page-container',
  description: 'Container layouts for pages and sections',
  base: {
    width: '100%',
  },
  variants: {
    variant: {
      page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      section: {
        padding: '3rem',
      },
      header: {
        padding: '1.5rem 3rem',
        borderBottom: '1px solid',
        borderColor: 'border.DEFAULT',
        minHeight: '80px',
      },
      visualization: {
        background: 'white',
        padding: '3rem',
        minHeight: '650px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    background: {
      white: { background: 'bg.primary' },
      gray: { background: 'bg.secondary' },
      transparent: { background: 'transparent' },
    },

    padding: {
      none: { padding: 0 },
      sm: { padding: 'sm' },
      md: { padding: 'md' },
      lg: { padding: 'lg' },
      xl: { padding: 'xl' },
      '2xl': { padding: '2xl' },
    },

    border: {
      none: {},
      bottom: { borderBottom: '1px solid', borderColor: 'border.DEFAULT' },
      top: { borderTop: '1px solid', borderColor: 'border.DEFAULT' },
      all: { border: '1px solid', borderColor: 'border.DEFAULT' },
    },
  },

  defaultVariants: {
    background: 'white',
    padding: 'none',
    border: 'none',
  },
})

export const stackLayout = defineRecipe({
  className: 'stack-layout',
  description: 'Vertical stack layout with consistent spacing',
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    spacing: {
      none: { gap: 0 },
      xs: { gap: 'xs' },
      sm: { gap: 'sm' },
      md: { gap: 'md' },
      lg: { gap: 'lg' },
      xl: { gap: 'xl' },
      '2xl': { gap: '2xl' },
    },

    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
  },

  defaultVariants: {
    spacing: 'md',
    align: 'stretch',
  },
})
