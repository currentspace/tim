import { defineRecipe } from '@pandacss/dev'

export const navItem = defineRecipe({
  className: 'nav-item',
  description: 'Navigation item styles',
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    padding: '1rem 2rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all token(durations.base) token(easings.default)',
    position: 'relative',
    textAlign: 'left',

    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      background: 'accent',
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.2s ease',
    },

    '&:hover': {
      background: 'bg.secondary',
    },
  },

  variants: {
    active: {
      true: {
        background: 'rgba(100, 108, 255, 0.08)',

        '&::before': {
          transform: 'scaleX(1)',
        },

        '&:hover': {
          background: 'rgba(100, 108, 255, 0.12)',
        },
      },
    },
  },

  defaultVariants: {
    active: false,
  },
})
