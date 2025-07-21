import { useState, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import './NavigationMenu.css'

interface NavigationMenuProps {
  currentView: string
}

function NavigationMenu({ currentView }: NavigationMenuProps) {
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
    { path: '/notifications', label: 'Notification Settings' }
  ]

  return (
    <div className="navigation-menu" ref={menuRefCallback}>
      <button className="menu-trigger" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
        <span className="menu-label">Menu</span>
      </button>
      
      {isOpen && (
        <div className="menu-dropdown">
          <div className="menu-header">
            <h3>Navigation</h3>
            <button className="menu-close" onClick={closeMenu}>×</button>
          </div>
          <nav className="menu-items">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
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