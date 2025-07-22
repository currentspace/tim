import { defineRecipe } from '@pandacss/dev'

export const badge = defineRecipe({
  className: 'badge',
  description: 'Badge styles for status indicators',
  base: {
    padding: '8px 20px',
    borderRadius: '16px',
    fontFamily: 'editorial',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '1.2',
    display: 'inline-flex',
    alignItems: 'center',
    height: '32px',
    minHeight: '32px',
  },

  variants: {
    variant: {
      anticipated: {
        background: '#ff8a00',
        color: 'white',
        boxShadow: '0 2px 4px rgba(255, 138, 0, 0.2)',
      },

      timeline: {
        background: 'accent',
        color: 'white',
        boxShadow: '0 2px 4px rgba(100, 108, 255, 0.2)',
      },

      exposure: {
        background: '#00b4d8',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0, 180, 216, 0.2)',
      },
    },
  },

  defaultVariants: {
    variant: 'anticipated',
  },
})
