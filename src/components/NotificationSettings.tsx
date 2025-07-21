import { useState } from 'react'
import { techCompanies } from '../data/techCompanies'
import { COMPANY_COLORS, COUNTRY_COLORS } from '../constants/colors'
import './NotificationSettings.css'

type ViewType = 'company' | 'country'

interface SelectionItem {
  id: string
  name: string
  color: string
  category?: string
  selected: boolean
}

// Get unique countries from tech companies data
const getUniqueCountries = () => {
  const countries = new Set<string>()
  techCompanies.forEach((company) => {
    Object.keys(company.revenueByCountry).forEach((country) => {
      countries.add(country)
    })
  })
  return Array.from(countries).sort()
}

function NotificationSettings() {
  const [activeView, setActiveView] = useState<ViewType>('company')

  // Initialize company selections
  const [companySelections, setCompanySelections] = useState<SelectionItem[]>(
    techCompanies.map((company) => ({
      id: company.id,
      name: company.name,
      color: COMPANY_COLORS[company.id] ?? '#888888',
      category: company.category,
      selected: false,
    })),
  )

  // Initialize country selections
  const [countrySelections, setCountrySelections] = useState<SelectionItem[]>(
    getUniqueCountries().map((country) => ({
      id: country.toLowerCase().replace(/\s+/g, '-'),
      name: country,
      color: COUNTRY_COLORS[country] ?? '#888888',
      selected: false,
    })),
  )

  const handleCompanyToggle = (id: string) => {
    setCompanySelections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    )
  }

  const handleCountryToggle = (id: string) => {
    setCountrySelections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    )
  }

  const selectedCompanies = companySelections.filter((c) => c.selected)
  const selectedCountries = countrySelections.filter((c) => c.selected)
  const currentSelections = activeView === 'company' ? selectedCompanies : selectedCountries

  const sendNotifications = () => {
    // In a real app, this would send notifications
    // For now, we'll just track the selection
    const selections = {
      companies: selectedCompanies.map((c) => c.name),
      countries: selectedCountries.map((c) => c.name),
    }
    // TODO: Implement actual notification sending
    void selections
  }

  return (
    <div className="notification-settings">
      <div className="header">
        <div className="header-content">
          <div className="title-section">
            <span className="dollar-volume">Dollar Volume</span>
            <label className="toggle-switch">
              <input type="checkbox" checked readOnly />
              <span className="slider"></span>
            </label>
            <span className="exposure-rate">Tariff Exposure & Rate</span>
          </div>
          <div className="company-title">
            <h2>Staples Technology Solutions</h2>
            <p>TIM Dashboard</p>
          </div>
          <div className="navigation-tabs">
            <button className="nav-tab">Timeline</button>
            <button className="nav-tab">Chart</button>
            <button className="nav-tab active">Notifications</button>
          </div>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-header">
          <h3>Notification Settings</h3>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${activeView === 'country' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('country')
              }}
            >
              Country
            </button>
            <button
              className={`toggle-btn ${activeView === 'company' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('company')
              }}
            >
              Company
            </button>
          </div>
        </div>

        <div className="settings-content">
          <div className="selection-panel">
            <h4>{activeView === 'company' ? 'Select Companies' : 'Select Countries'}</h4>

            <div className="selection-list">
              {activeView === 'company' ? (
                <>
                  {/* Group companies by category */}
                  {['hardware', 'software', 'services', 'semiconductor'].map((category) => {
                    const items = companySelections.filter((c) => c.category === category)
                    if (items.length === 0) return null

                    return (
                      <div key={category} className="category-group">
                        <div className="category-items">
                          {items.map((company) => (
                            <label key={company.id} className="selection-item">
                              <input
                                type="checkbox"
                                checked={company.selected}
                                onChange={() => {
                                  handleCompanyToggle(company.id)
                                }}
                              />
                              <span
                                className="color-dot"
                                style={{ backgroundColor: company.color }}
                              ></span>
                              <span className="item-name">{company.name}</span>
                              <span className="item-category">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="category-items">
                  {countrySelections.map((country) => (
                    <label key={country.id} className="selection-item">
                      <input
                        type="checkbox"
                        checked={country.selected}
                        onChange={() => {
                          handleCountryToggle(country.id)
                        }}
                      />
                      <span className="color-dot" style={{ backgroundColor: country.color }}></span>
                      <span className="item-name">{country.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="selected-panel">
            <h4>Selected Items</h4>
            <div className="selected-list">
              {currentSelections.length === 0 ? (
                <p className="no-selection">
                  {activeView === 'company' ? 'Products: None selected' : 'No countries selected'}
                </p>
              ) : (
                currentSelections.map((item) => (
                  <div key={item.id} className="selected-item">
                    <span className="item-name">{item.name}</span>
                    {item.category && (
                      <span className="item-subtitle">Products: {item.category}</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              className="send-button"
              onClick={sendNotifications}
              disabled={selectedCompanies.length === 0 && selectedCountries.length === 0}
            >
              Send notifications to...
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Proprietary and Confidential: Copyright Staples Technology Solutions 2025</p>
      </div>
    </div>
  )
}

export default NotificationSettings

