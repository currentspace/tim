import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'button',
  description: 'Button styles with variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all token(durations.base) token(easings.default)',
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
    border: 'none',
    outline: 'none',
    userSelect: 'none',
    textDecoration: 'none',

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },

  variants: {
    variant: {
      solid: {
        background: 'accent',
        color: 'white',

        '&:hover:not(:disabled)': {
          background: 'accent',
          filter: 'brightness(1.1)',
        },
      },

      outline: {
        background: 'transparent',
        border: '1px solid',
        borderColor: 'border.DEFAULT',
        color: 'text.primary',

        '&:hover:not(:disabled)': {
          background: 'bg.hover',
          borderColor: 'border.strong',
        },
      },

      ghost: {
        background: 'transparent',
        color: 'text.primary',

        '&:hover:not(:disabled)': {
          background: 'bg.hover',
        },
      },

      icon: {
        background: 'transparent',
        border: 'none',
        padding: 0,
        width: '32px',
        height: '32px',
        borderRadius: 'sm',

        '&:hover:not(:disabled)': {
          background: 'bg.hover',
        },
      },

      nav: {
        background: 'transparent',
        color: 'text.muted',

        '&:hover:not(:disabled)': {
          color: 'text.primary',
          background: 'bg.hover',
        },

        '&[data-active="true"]': {
          color: 'accent',
          fontWeight: 'semibold',
        },
      },

      tab: {
        background: 'transparent',
        color: 'text.secondary',
        fontSize: '14px',
        fontWeight: 'medium',
        padding: '12px 24px',
        borderRadius: 'none',
        borderBottom: '2px solid transparent',

        '&:hover:not(:disabled)': {
          color: 'text.primary',
          background: 'transparent',
        },

        '&[data-active="true"]': {
          color: 'text.primary',
          fontWeight: 'medium',
          borderBottomColor: 'accent',
        },
      },

      danger: {
        background: 'alert.DEFAULT',
        color: 'white',

        '&:hover:not(:disabled)': {
          background: 'alert.hover',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },

      primary: {
        background: 'text.primary',
        color: 'white',

        '&:hover:not(:disabled)': {
          background: '#2a2a2a',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },
    },

    size: {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: 'sm',
        height: '32px',
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: 'base',
        height: '40px',
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: 'lg',
        height: '48px',
      },
    },

    shape: {
      rectangle: {
        borderRadius: 'md',
      },
      rounded: {
        borderRadius: 'full',
      },
      square: {
        borderRadius: 'none',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  compoundVariants: [
    {
      variant: 'icon',
      size: 'sm',
      css: {
        width: '24px',
        height: '24px',
      },
    },
    {
      variant: 'icon',
      size: 'md',
      css: {
        width: '32px',
        height: '32px',
      },
    },
    {
      variant: 'icon',
      size: 'lg',
      css: {
        width: '40px',
        height: '40px',
      },
    },
  ],

  defaultVariants: {
    variant: 'solid',
    size: 'md',
    shape: 'rectangle',
  },
})
