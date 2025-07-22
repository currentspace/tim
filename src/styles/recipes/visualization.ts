import { defineRecipe } from '@pandacss/dev'

export const visualization = defineRecipe({
  className: 'visualization',
  description: 'Container styles for data visualizations and charts',
  base: {
    width: '100%',
    display: 'block',
    position: 'relative',
  },

  variants: {
    background: {
      white: { background: 'white' },
      gray: { background: 'bg.secondary' },
      transparent: { background: 'transparent' },
    },

    height: {
      auto: { height: 'auto' },
      full: { height: '100%' },
      sm: { height: '200px' },
      md: { height: '400px' },
      lg: { height: '600px' },
      screen: { height: '100vh' },
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
      true: {
        border: '1px solid',
        borderColor: 'border.DEFAULT',
      },
    },

    rounded: {
      true: {
        borderRadius: 'md',
      },
    },

    shadow: {
      true: {
        boxShadow: 'DEFAULT',
      },
    },

    centered: {
      true: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },

  defaultVariants: {
    background: 'white',
    height: 'auto',
    padding: 'none',
  },
})
