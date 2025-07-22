import { css } from '../../styled-system/css'

// Main navigation styles
export const mainNavigationStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  bg: 'rgba(0, 0, 0, 0.03)',
  p: '0.375rem',
  borderRadius: '24px',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
})

export const navLinkStyles = css({
  fontFamily: 'data',
  fontSize: '12px',
  color: 'text.muted',
  textDecoration: 'none',
  fontWeight: 'medium',
  transition: 'all 0.2s ease',
  px: '1rem',
  py: '0.5rem',
  borderRadius: '18px',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  lineHeight: '1.2',
  _hover: {
    color: 'text.primary',
    bg: 'rgba(0, 0, 0, 0.04)',
  },
})

export const navLinkActiveStyles = css({
  color: 'white',
  fontWeight: 'semibold',
  bg: '#ff8a00',
  boxShadow: '0 2px 4px rgba(255, 138, 0, 0.25)',
  _hover: {
    bg: '#ff7a00',
  },
})

// Navigation center
export const navigationCenterStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  flexDirection: 'row',
})

// Tab badge
export const tabBadgeStyles = css({
  fontFamily: 'editorial',
  bg: '#ff8a00',
  color: 'white',
  px: '1.75rem',
  py: '0.375rem',
  fontWeight: 'bold',
  fontSize: '13px',
  letterSpacing: 'wider',
  borderRadius: '20px',
  textTransform: 'uppercase',
  boxShadow: '0 2px 4px rgba(255, 138, 0, 0.2)',
  minWidth: '140px',
  textAlign: 'center',
  lineHeight: '1.4',
})

// Current view header
export const currentViewHeaderStyles = css({
  py: '0.75rem',
  minWidth: '160px',
})

export const currentViewTitleStyles = css({
  margin: '0 0 0.375rem 0',
  fontFamily: 'editorial',
  fontSize: '11px',
  fontWeight: 'semibold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'text.secondary',
  lineHeight: '1.4',
})

export const currentViewSubtitleStyles = css({
  margin: '0',
  fontFamily: 'data',
  fontSize: '15px',
  fontWeight: 'medium',
  color: 'text.primary',
  lineHeight: '1.4',
})

// Company branding
export const companyBrandingStyles = css({
  textAlign: 'right',
  minWidth: '200px',
})

export const companyNameStyles = css({
  fontFamily: 'editorial',
  fontSize: '16px',
  fontWeight: 'semibold',
  letterSpacing: 'normal',
  margin: '0',
  color: 'text.primary',
  lineHeight: '1.3',
})

export const companySubtitleStyles = css({
  fontFamily: 'data',
  fontSize: '12px',
  color: 'text.muted',
  margin: '0',
  marginTop: '4px',
  lineHeight: '1.4',
})
