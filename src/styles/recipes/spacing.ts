import { defineRecipe } from '@pandacss/dev'

export const spacing = defineRecipe({
  className: 'spacing',
  description: 'Utility recipe for consistent spacing',

  variants: {
    // Margin all sides
    m: {
      0: { margin: 0 },
      xs: { margin: 'xs' },
      sm: { margin: 'sm' },
      md: { margin: 'md' },
      lg: { margin: 'lg' },
      xl: { margin: 'xl' },
      '2xl': { margin: '2xl' },
    },

    // Margin top
    mt: {
      0: { marginTop: 0 },
      xs: { marginTop: 'xs' },
      sm: { marginTop: 'sm' },
      md: { marginTop: 'md' },
      lg: { marginTop: 'lg' },
      xl: { marginTop: 'xl' },
      '2xl': { marginTop: '2xl' },
    },

    // Margin bottom
    mb: {
      0: { marginBottom: 0 },
      xs: { marginBottom: 'xs' },
      sm: { marginBottom: 'sm' },
      md: { marginBottom: 'md' },
      lg: { marginBottom: 'lg' },
      xl: { marginBottom: 'xl' },
      '2xl': { marginBottom: '2xl' },
    },

    // Margin left
    ml: {
      0: { marginLeft: 0 },
      xs: { marginLeft: 'xs' },
      sm: { marginLeft: 'sm' },
      md: { marginLeft: 'md' },
      lg: { marginLeft: 'lg' },
      xl: { marginLeft: 'xl' },
    },

    // Margin right
    mr: {
      0: { marginRight: 0 },
      xs: { marginRight: 'xs' },
      sm: { marginRight: 'sm' },
      md: { marginRight: 'md' },
      lg: { marginRight: 'lg' },
      xl: { marginRight: 'xl' },
    },

    // Margin horizontal
    mx: {
      0: { marginLeft: 0, marginRight: 0 },
      xs: { marginLeft: 'xs', marginRight: 'xs' },
      sm: { marginLeft: 'sm', marginRight: 'sm' },
      md: { marginLeft: 'md', marginRight: 'md' },
      lg: { marginLeft: 'lg', marginRight: 'lg' },
      xl: { marginLeft: 'xl', marginRight: 'xl' },
      auto: { marginLeft: 'auto', marginRight: 'auto' },
    },

    // Margin vertical
    my: {
      0: { marginTop: 0, marginBottom: 0 },
      xs: { marginTop: 'xs', marginBottom: 'xs' },
      sm: { marginTop: 'sm', marginBottom: 'sm' },
      md: { marginTop: 'md', marginBottom: 'md' },
      lg: { marginTop: 'lg', marginBottom: 'lg' },
      xl: { marginTop: 'xl', marginBottom: 'xl' },
    },

    // Padding all sides
    p: {
      0: { padding: 0 },
      xs: { padding: 'xs' },
      sm: { padding: 'sm' },
      md: { padding: 'md' },
      lg: { padding: 'lg' },
      xl: { padding: 'xl' },
      '2xl': { padding: '2xl' },
    },

    // Padding horizontal
    px: {
      0: { paddingLeft: 0, paddingRight: 0 },
      xs: { paddingLeft: 'xs', paddingRight: 'xs' },
      sm: { paddingLeft: 'sm', paddingRight: 'sm' },
      md: { paddingLeft: 'md', paddingRight: 'md' },
      lg: { paddingLeft: 'lg', paddingRight: 'lg' },
      xl: { paddingLeft: 'xl', paddingRight: 'xl' },
      '2xl': { paddingLeft: '2xl', paddingRight: '2xl' },
    },

    // Padding vertical
    py: {
      0: { paddingTop: 0, paddingBottom: 0 },
      xs: { paddingTop: 'xs', paddingBottom: 'xs' },
      sm: { paddingTop: 'sm', paddingBottom: 'sm' },
      md: { paddingTop: 'md', paddingBottom: 'md' },
      lg: { paddingTop: 'lg', paddingBottom: 'lg' },
      xl: { paddingTop: 'xl', paddingBottom: 'xl' },
    },
  },
})
