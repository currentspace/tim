import { defineRecipe } from '@pandacss/dev'

export const navLink = defineRecipe({
  className: 'nav-link',
  description: 'Navigation link styles',
  base: {
    fontFamily: 'data',
    fontSize: '12px',
    color: 'text.muted',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '18px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    lineHeight: '1.2',

    '&:hover': {
      color: 'text.primary',
      background: 'rgba(0, 0, 0, 0.04)',
    },
  },

  variants: {
    active: {
      true: {
        color: 'white',
        background: '#ff8a00',
        fontWeight: 'semibold',
        boxShadow: '0 2px 4px rgba(255, 138, 0, 0.25)',

        '&:hover': {
          background: '#ff7a00',
          color: 'white',
        },
      },
    },
  },

  defaultVariants: {
    active: false,
  },
})
