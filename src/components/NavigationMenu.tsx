import { useState, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { css, cx } from '../../styled-system/css'
import { typography, flexLayout, button, pageContainer } from '../../styled-system/recipes'

interface NavigationMenuProps {
  currentView: string
}

function NavigationMenu({ currentView: _currentView }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Close menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  // Set up click outside listener using callback ref
  const menuRefCallback = (node: HTMLDivElement | null) => {
    if (node) {
      menuRef.current = node
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }

  const menuItems = [
    { path: '/', label: 'Anticipated Tariff Impact' },
    { path: '/country-exposure', label: 'Country Exposure' },
    { path: '/company-timeline', label: 'Company Timeline' },
    { path: '/country-timeline', label: 'Country Timeline' },
    { path: '/startup-universe', label: 'Startup Universe' },
    { path: '/notifications', label: 'Notification Settings' },
  ]

  return (
    <div className={css({ position: 'relative' })} ref={menuRefCallback}>
      <button
        className={cx(
          button({ variant: 'outline', size: 'sm' }),
          flexLayout({ align: 'center', gap: 'sm' }),
          css({
            borderColor: 'border.subtle',
            color: 'text.muted',

            '&:hover': {
              background: 'bg.hover',
              borderColor: 'border.strong',
              color: 'text.primary',
            },
          }),
        )}
        onClick={toggleMenu}
      >
        <span className={css({ fontSize: '18px', lineHeight: 1 })}>☰</span>
        <span className={typography({ variant: 'dataValue', size: 'sm' })}>Menu</span>
      </button>

      {isOpen && (
        <div
          className={css({
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '280px',
            background: 'bg.primary',
            borderRadius: 'md',
            boxShadow: 'lg',
            zIndex: 1000,
            overflow: 'hidden',

            '@media (max-width: 768px)': {
              position: 'fixed',
              top: '80px',
              left: '1rem',
              right: '1rem',
              width: 'auto',
            },
          })}
        >
          <div
            className={cx(
              flexLayout({ align: 'center', justify: 'between' }),
              pageContainer({ padding: 'md', border: 'bottom' }),
              css({ borderColor: 'border.DEFAULT' }),
            )}
          >
            <h3
              className={cx(
                typography({ variant: 'editorialDisplay', size: 'base' }),
                css({ margin: 0 }),
              )}
            >
              Navigation
            </h3>
            <button
              className={cx(
                button({ variant: 'icon', size: 'md' }),
                css({
                  fontSize: '24px',
                  color: 'text.muted',
                  width: '32px',
                  height: '32px',

                  '&:hover': {
                    background: 'bg.hover',
                    color: 'text.primary',
                  },
                }),
              )}
              onClick={closeMenu}
            >
              ×
            </button>
          </div>
          <nav className={css({ padding: '0.5rem 0' })}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cx(
                  typography({ variant: 'dataValue', size: 'sm', color: 'muted' }),
                  css({
                    display: 'block',
                    padding: '0.75rem 1.5rem',
                    textDecoration: 'none',
                    transition: 'all token(durations.base) token(easings.default)',

                    '&:hover': {
                      background: 'bg.hover',
                      color: 'text.primary',
                    },

                    ...(location.pathname === item.path && {
                      background: 'rgba(255, 138, 0, 0.1)',
                      color: 'orange.DEFAULT',
                      fontWeight: 'semibold',
                    }),
                  }),
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export default NavigationMenu
