// Park UI Theme Configuration
// Maps our design tokens to Park UI components

export const parkUITheme = {
  // Typography
  fonts: {
    heading: 'var(--font-editorial)',
    body: 'var(--font-data)',
    mono: 'Menlo, monospace',
  },

  // Component specific overrides
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: '8px',
        transition: 'all 0.25s ease',
        _hover: {
          transform: 'translateY(-1px)',
        },
      },
    },
    Link: {
      baseStyle: {
        fontWeight: 'medium',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'var(--font-editorial)',
        fontWeight: 'bold',
        letterSpacing: 'snug',
      },
    },
  },
}

// Motion variants for Framer Motion
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.15 },
  },
}
