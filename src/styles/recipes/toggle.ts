import { defineRecipe } from '@pandacss/dev'

export const toggle = defineRecipe({
  className: 'toggle',
  description: 'Toggle switch component styles matching Figma specifications',
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',

    '&:focus': {
      boxShadow: '0 0 0 2px rgba(100, 108, 255, 0.2)',
    },

    // Toggle handle (the moving circle)
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s ease',
      left: '2px',
      top: '2px',
    },
  },

  variants: {
    checked: {
      true: {
        background: 'accent',

        '&::after': {
          transform: 'translateX(20px)',
        },
      },
      false: {
        background: '#e5e7eb',

        '&:hover': {
          background: '#d1d5db',
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',

        '&:hover': {
          background: 'inherit',
        },
      },
    },

    size: {
      sm: {
        width: '36px',
        height: '20px',
        borderRadius: '10px',

        '&::after': {
          width: '16px',
          height: '16px',
          left: '2px',
          top: '2px',
        },

        '&[data-checked="true"]::after': {
          transform: 'translateX(16px)',
        },
      },

      md: {
        width: '44px',
        height: '24px',
        borderRadius: '12px',

        '&::after': {
          width: '20px',
          height: '20px',
          left: '2px',
          top: '2px',
        },

        '&[data-checked="true"]::after': {
          transform: 'translateX(20px)',
        },
      },

      lg: {
        width: '52px',
        height: '28px',
        borderRadius: '14px',

        '&::after': {
          width: '24px',
          height: '24px',
          left: '2px',
          top: '2px',
        },

        '&[data-checked="true"]::after': {
          transform: 'translateX(24px)',
        },
      },
    },
  },

  defaultVariants: {
    checked: false,
    size: 'md',
  },
})
