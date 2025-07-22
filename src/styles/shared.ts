import { css } from '../../styled-system/css'

// ===== TYPOGRAPHY PATTERNS =====
export const typographyStyles = {
  // Editorial display text
  editorialDisplay: css({
    fontFamily: 'editorial',
    fontSize: '2xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    textTransform: 'uppercase',
  }),

  // Section headers
  sectionHeader: css({
    fontFamily: 'editorial',
    fontSize: 'sm',
    fontWeight: 'bold',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
    color: 'text.primary',
  }),

  // Data values
  dataValue: css({
    fontFamily: 'data',
    fontSize: 'base',
    fontWeight: 'semibold',
    fontVariantNumeric: 'tabular-nums',
    color: 'text.primary',
  }),

  // Small data labels
  dataLabel: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'text.muted',
  }),

  // Muted text
  mutedText: css({
    fontFamily: 'data',
    fontSize: 'sm',
    color: 'text.muted',
  }),
}

// ===== LAYOUT PATTERNS =====
export const layoutStyles = {
  // Main container for visualizations
  visualizationContainer: css({
    background: 'white',
    padding: '3rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }),

  // Visualization container with min height
  visualizationContainerMinHeight: css({
    background: 'white',
    padding: '3rem',
    margin: 0,
    minHeight: '600px',
  }),

  // Header sections
  headerSection: css({
    background: 'bg.primary',
    padding: '2rem 3rem 1rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  }),

  // Card container
  card: css({
    background: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  }),

  // Timeline container for the timeline sections
  timelineContainer: css({
    background: 'white',
    padding: '2rem',
    borderTop: '1px solid #e0e0e0',
    position: 'relative',
  }),

  // Timeline wrapper
  timelineWrapper: css({
    position: 'relative',
    padding: '0.5rem 0',
  }),

  // Chart header
  chartHeader: css({
    background: 'white',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e0e0e0',
  }),

  // Main page container
  pageContainer: css({
    minHeight: '100vh',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  }),

  // Page container with background
  pageContainerGray: css({
    background: '#f5f5f5',
    minHeight: '100vh',
    padding: 0,
    margin: 0,
  }),
}

// ===== BADGE PATTERNS =====
export const badgeStyles = {
  base: css({
    padding: '0.375rem 1rem',
    borderRadius: '20px',
    fontFamily: 'editorial',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    lineHeight: '1',
    display: 'inline-block',
  }),

  anticipated: css({
    background: '#ff8a00',
    color: 'white',
    boxShadow: '0 2px 4px rgba(255, 138, 0, 0.2)',
  }),

  timeline: css({
    background: 'accent',
    color: 'white',
    boxShadow: '0 2px 4px rgba(100, 108, 255, 0.2)',
  }),

  exposure: css({
    background: '#00b4d8',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 180, 216, 0.2)',
  }),
}

// ===== NAVIGATION PATTERNS =====
export const navigationStyles = {
  navLink: css({
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
  }),

  navLinkActive: css({
    color: 'white',
    background: '#ff8a00',
    fontWeight: 'semibold',
    boxShadow: '0 2px 4px rgba(255, 138, 0, 0.25)',
    '&:hover': {
      background: '#ff7a00',
    },
  }),
}

// ===== FORM PATTERNS =====
export const formStyles = {
  toggleSwitch: css({
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '28px',
    flexShrink: 0,
  }),

  toggleSlider: css({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    borderRadius: '28px',
    '&:before': {
      position: 'absolute',
      content: '""',
      height: '20px',
      width: '20px',
      left: '4px',
      bottom: '4px',
      background: 'white',
      transition: 'all 0.3s ease',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
  }),

  rangeSlider: css({
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#e0e0e0',
    borderRadius: '2px',
    cursor: 'pointer',
    margin: '1rem 0',
  }),

  inlineSelect: css({
    appearance: 'none',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid',
    borderColor: 'text.muted',
    padding: '0.25rem 1.5rem 0.25rem 0.5rem',
    fontFamily: 'data',
    fontSize: 'sm',
    color: 'text.primary',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundImage:
      'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2714%27%20height%3D%278%27%20viewBox%3D%270%200%2014%208%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M1%201l6%206%206-6%27%20stroke%3D%27%23666%27%20stroke-width%3D%271.5%27%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '12px',
    '&:hover': {
      borderColor: 'text.primary',
    },
    '&:focus': {
      outline: 'none',
      borderColor: 'accent',
    },
  }),

  timelineSlider: css({
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#e0e0e0',
    borderRadius: '2px',
    cursor: 'pointer',
    margin: '2rem 0 1rem',
  }),
}

// ===== TOOLTIP PATTERNS =====
export const tooltipStyles = {
  container: css({
    fontFamily: 'data',
    fontSize: 'sm',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  }),

  title: css({
    fontFamily: 'editorial',
    fontSize: 'base',
    fontWeight: 'semibold',
    marginBottom: '4px',
    color: 'text.primary',
  }),

  value: css({
    fontFamily: 'data',
    fontSize: 'sm',
    fontWeight: 'medium',
    fontVariantNumeric: 'tabular-nums',
    color: 'text.secondary',
  }),
}

// ===== ANIMATION PATTERNS =====
export const animationStyles = {
  fadeIn: css({
    animation: 'fadeIn 0.3s ease-out',
  }),

  slideIn: css({
    animation: 'slideIn 0.3s ease-out',
  }),
}

// ===== RESPONSIVE PATTERNS =====
export const responsiveStyles = {
  hideOnMobile: css({
    '@media (max-width: 768px)': {
      display: 'none',
    },
  }),

  stackOnMobile: css({
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1rem',
    },
  }),
}

// ===== TIMELINE PATTERNS =====
export const timelineStyles = {
  // Timeline title
  timelineTitle: css({
    margin: '0 0 1rem 0',
    fontFamily: 'editorial',
    fontSize: 'sm',
    fontWeight: 'semibold',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
    color: 'text.primary',
  }),

  // Timeline subtitle for AnticipatedTariffImpact
  timelineSubtitle: css({
    position: 'absolute',
    right: '3rem',
    top: '2rem',
    fontFamily: 'data',
    fontSize: 'sm',
    color: 'text.muted',
  }),

  // Timeline slider base
  timelineSlider: css({
    position: 'relative',
    width: '100%',
    height: '4px',
    background: '#e0e0e0',
    borderRadius: '2px',
    cursor: 'pointer',
    margin: '2rem 0 1rem',
  }),

  // Timeline labels container
  timelineLabels: css({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    padding: '0 0.5rem',
  }),
}

// ===== NOTIFICATION SETTINGS PATTERNS =====
export const settingsStyles = {
  // Settings container
  settingsContainer: css({
    flex: 1,
    background: 'white',
    margin: '2rem',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  }),

  // Settings header
  settingsHeader: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  }),

  // View toggle
  viewToggle: css({
    display: 'flex',
    background: '#f0f0f0',
    borderRadius: '20px',
    padding: '4px',
  }),

  // Toggle button
  toggleBtn: css({
    padding: '0.5rem 1.5rem',
    border: 'none',
    background: 'none',
    fontFamily: 'data',
    fontSize: 'sm',
    color: 'text.muted',
    cursor: 'pointer',
    borderRadius: '16px',
    transition: 'all 0.2s ease',
  }),

  // Active toggle button
  toggleBtnActive: css({
    background: 'white',
    color: 'text.primary',
    fontWeight: 'semibold',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }),

  // Settings content grid
  settingsContent: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    minHeight: '400px',
  }),

  // Selection panel
  selectionPanel: css({
    display: 'flex',
    flexDirection: 'column',
  }),

  // Selection list
  selectionList: css({
    flex: 1,
    overflowY: 'auto',
    maxHeight: '400px',
  }),

  // Category group
  categoryGroup: css({
    marginBottom: '1.5rem',
  }),

  // Category items
  categoryItems: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }),

  // Selection item
  selectionItem: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f8f8',
    },
  }),

  // Color dot
  colorDot: css({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0,
  }),

  // Item name
  itemName: css({
    fontFamily: 'data',
    fontSize: 'sm',
    color: 'text.primary',
    flex: 1,
  }),

  // Item category
  itemCategory: css({
    fontFamily: 'data',
    fontSize: 'xs',
    color: 'text.muted',
    textTransform: 'capitalize',
  }),

  // Selected list
  selectedList: css({
    flex: 1,
    background: '#f8f8f8',
    borderRadius: '4px',
    padding: '1rem',
    minHeight: '200px',
    overflowY: 'auto',
  }),

  // Selected item
  selectedItem: css({
    padding: '0.75rem',
    background: 'white',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  }),

  // Send button
  sendButton: css({
    width: '100%',
    padding: '1rem',
    marginTop: '1.5rem',
    background: 'text.primary',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontFamily: 'data',
    fontSize: 'base',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover:not(:disabled)': {
      background: '#2a2a2a',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    '&:disabled': {
      background: '#ccc',
      cursor: 'not-allowed',
    },
  }),
}

// ===== UTILITY FUNCTIONS =====
export const cx = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Common component compositions
export const composeStyles = {
  badge: (variant: 'anticipated' | 'timeline' | 'exposure') =>
    cx(badgeStyles.base, badgeStyles[variant]),

  navLink: (isActive: boolean) =>
    cx(navigationStyles.navLink, isActive && navigationStyles.navLinkActive),
}
