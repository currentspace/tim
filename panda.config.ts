import { defineConfig } from '@pandacss/dev'
import {
  typography,
  flexLayout,
  pageContainer,
  stackLayout,
  button,
  badge,
  toggle,
  navLink,
  spacing,
  navItem,
  visualization,
} from './src/styles/recipes'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Use the Park UI preset
  presets: ['@pandacss/preset-base', '@park-ui/panda-preset'],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Conditions for responsive design
  conditions: {
    extend: {
      light: '[data-color-mode=light] &',
      dark: '[data-color-mode=dark] &',
    },
  },

  // Extend the theme with our existing design tokens
  theme: {
    extend: {
      tokens: {
        fonts: {
          editorial: {
            value:
              'ABC Monument Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
          data: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
        },
        fontSizes: {
          xs: { value: '0.8125rem' }, // 13px
          sm: { value: '0.9375rem' }, // 15px
          base: { value: '1.0625rem' }, // 17px
          lg: { value: '1.1875rem' }, // 19px
          xl: { value: '1.375rem' }, // 22px
          '2xl': { value: '1.625rem' }, // 26px
          '3xl': { value: '2rem' }, // 32px
          '4xl': { value: '2.5rem' }, // 40px
        },
        fontWeights: {
          regular: { value: '400' },
          medium: { value: '500' },
          semibold: { value: '600' },
          bold: { value: '700' },
        },
        lineHeights: {
          tight: { value: '1.15' },
          snug: { value: '1.35' },
          normal: { value: '1.5' },
          relaxed: { value: '1.75' },
        },
        letterSpacings: {
          tight: { value: '-0.02em' },
          snug: { value: '-0.01em' },
          normal: { value: '0' },
          wide: { value: '0.025em' },
          wider: { value: '0.05em' },
        },
        colors: {
          // Core palette
          ink: { value: '#1a1a1a' },
          paper: { value: '#ffffff' },
          'ink-light': { value: 'rgba(26, 26, 26, 0.87)' },
          'ink-muted': { value: '#666666' },
          accent: { value: '#646cff' },
          data: { value: '#ff8800' },
          alert: {
            DEFAULT: { value: '#ff4d4d' },
            hover: { value: '#e63939' },
          },

          // Brand colors from Figma
          orange: {
            DEFAULT: { value: '#ff8a00' },
            hover: { value: '#ff7a00' },
          },
          blue: {
            DEFAULT: { value: '#00b4d8' },
            hover: { value: '#0096c7' },
          },

          // Figma specific colors
          purple: {
            DEFAULT: { value: '#8B5CF6' },
            hover: { value: '#7C3AED' },
          },
          cyan: {
            DEFAULT: { value: '#06B6D4' },
            hover: { value: '#0891B2' },
          },

          // Gray scale from Figma
          gray: {
            50: { value: '#f9fafb' },
            100: { value: '#f3f4f6' },
            200: { value: '#e5e7eb' },
            300: { value: '#d1d5db' },
            400: { value: '#9ca3af' },
            500: { value: '#6b7280' },
            600: { value: '#4b5563' },
            700: { value: '#374151' },
            800: { value: '#1f2937' },
            900: { value: '#111827' },
          },
        },
        spacing: {
          '0': { value: '0' },
          '1': { value: '8px' }, // 8px
          '2': { value: '16px' }, // 16px
          '3': { value: '24px' }, // 24px
          '4': { value: '32px' }, // 32px
          '5': { value: '40px' }, // 40px
          '6': { value: '48px' }, // 48px
          '7': { value: '56px' }, // 56px
          '8': { value: '64px' }, // 64px
          '9': { value: '72px' }, // 72px
          '10': { value: '80px' }, // 80px
          // Keep some legacy values for compatibility
          xs: { value: '8px' }, // 8px
          sm: { value: '16px' }, // 16px
          md: { value: '24px' }, // 24px
          lg: { value: '32px' }, // 32px
          xl: { value: '48px' }, // 48px
          '2xl': { value: '64px' }, // 64px
          '3xl': { value: '80px' }, // 80px
        },
        radii: {
          sm: { value: '4px' },
          md: { value: '8px' },
          lg: { value: '12px' },
          xl: { value: '18px' },
          '2xl': { value: '24px' },
          full: { value: '9999px' },
        },
        shadows: {
          sm: { value: '0 1px 2px rgba(0, 0, 0, 0.05)' },
          DEFAULT: { value: '0 2px 4px rgba(0, 0, 0, 0.05)' },
          md: { value: '0 4px 6px rgba(0, 0, 0, 0.07)' },
          lg: { value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
          xl: { value: '0 20px 25px rgba(0, 0, 0, 0.1)' },
          brand: {
            orange: { value: '0 2px 4px rgba(255, 138, 0, 0.25)' },
            blue: { value: '0 2px 4px rgba(0, 180, 216, 0.2)' },
            accent: { value: '0 2px 4px rgba(100, 108, 255, 0.2)' },
          },
        },
        durations: {
          fast: { value: '0.15s' },
          base: { value: '0.2s' },
          slow: { value: '0.3s' },
          slower: { value: '0.4s' },
        },
        easings: {
          default: { value: 'ease' },
          in: { value: 'ease-in' },
          out: { value: 'ease-out' },
          inOut: { value: 'ease-in-out' },
        },
      },
      semanticTokens: {
        colors: {
          text: {
            primary: { value: { base: '{colors.ink}', _dark: 'rgba(255, 255, 255, 0.87)' } },
            secondary: {
              value: { base: '{colors.ink-light}', _dark: 'rgba(255, 255, 255, 0.87)' },
            },
            muted: { value: { base: '{colors.ink-muted}', _dark: '#999' } },
          },
          bg: {
            primary: { value: { base: '{colors.paper}', _dark: '#242424' } },
            secondary: { value: { base: '#f5f5f5', _dark: '#1a1a1a' } },
            hover: { value: 'rgba(0, 0, 0, 0.04)' },
          },
          border: {
            DEFAULT: { value: 'rgba(0, 0, 0, 0.08)' },
            subtle: { value: 'rgba(0, 0, 0, 0.04)' },
            strong: { value: 'rgba(0, 0, 0, 0.15)' },
          },
        },
      },
      recipes: {
        typography,
        flexLayout,
        pageContainer,
        stackLayout,
        button,
        badge,
        toggle,
        navLink,
        spacing,
        navItem,
        visualization,
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})
