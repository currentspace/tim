import { useState } from 'react'
import { techCompanies } from '../data/techCompanies'
import { COMPANY_COLORS, COUNTRY_COLORS, D3_COLORS } from '../constants/colors'
import { css, cx } from '../../styled-system/css'
import { settingsStyles, layoutStyles, typographyStyles } from '../styles/shared'

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
      color: COMPANY_COLORS[company.id] ?? D3_COLORS.DEFAULT_GRAY,
      category: company.category,
      selected: false,
    })),
  )

  // Initialize country selections
  const [countrySelections, setCountrySelections] = useState<SelectionItem[]>(
    getUniqueCountries().map((country) => ({
      id: country.toLowerCase().replace(/\s+/g, '-'),
      name: country,
      color: COUNTRY_COLORS[country] ?? D3_COLORS.DEFAULT_GRAY,
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
    <div className={layoutStyles.pageContainer}>
      <div className={settingsStyles.settingsContainer}>
        <div className={settingsStyles.settingsHeader}>
          <h3
            className={css({
              margin: 0,
              fontFamily: 'editorial',
              fontSize: 'xl',
              fontWeight: 'semibold',
              color: 'text.primary',
            })}
          >
            Notification Settings
          </h3>
          <div className={settingsStyles.viewToggle}>
            <button
              className={cx(
                settingsStyles.toggleBtn,
                activeView === 'country' && settingsStyles.toggleBtnActive,
              )}
              onClick={() => {
                setActiveView('country')
              }}
            >
              Country
            </button>
            <button
              className={cx(
                settingsStyles.toggleBtn,
                activeView === 'company' && settingsStyles.toggleBtnActive,
              )}
              onClick={() => {
                setActiveView('company')
              }}
            >
              Company
            </button>
          </div>
        </div>

        <div className={settingsStyles.settingsContent}>
          <div className={settingsStyles.selectionPanel}>
            <h4
              className={css({
                margin: '0 0 1.5rem 0',
                fontFamily: 'editorial',
                fontSize: 'base',
                fontWeight: 'semibold',
                color: 'text.primary',
              })}
            >
              {activeView === 'company' ? 'Select Companies' : 'Select Countries'}
            </h4>

            <div className={settingsStyles.selectionList}>
              {activeView === 'company' ? (
                <>
                  {/* Group companies by category */}
                  {['hardware', 'software', 'services', 'semiconductor'].map((category) => {
                    const items = companySelections.filter((c) => c.category === category)
                    if (items.length === 0) return null

                    return (
                      <div key={category} className={settingsStyles.categoryGroup}>
                        <div className={settingsStyles.categoryItems}>
                          {items.map((company) => (
                            <label key={company.id} className={settingsStyles.selectionItem}>
                              <input
                                type="checkbox"
                                checked={company.selected}
                                onChange={() => {
                                  handleCompanyToggle(company.id)
                                }}
                              />
                              <span
                                className={cx(
                                  settingsStyles.colorDot,
                                  css({ backgroundColor: company.color }),
                                )}
                              ></span>
                              <span className={settingsStyles.itemName}>{company.name}</span>
                              <span className={settingsStyles.itemCategory}>{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className={settingsStyles.categoryItems}>
                  {countrySelections.map((country) => (
                    <label key={country.id} className={settingsStyles.selectionItem}>
                      <input
                        type="checkbox"
                        checked={country.selected}
                        onChange={() => {
                          handleCountryToggle(country.id)
                        }}
                      />
                      <span
                        className={cx(
                          settingsStyles.colorDot,
                          css({ backgroundColor: country.color }),
                        )}
                      ></span>
                      <span className={settingsStyles.itemName}>{country.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={settingsStyles.selectionPanel}>
            <h4
              className={css({
                margin: '0 0 1.5rem 0',
                fontFamily: 'editorial',
                fontSize: 'base',
                fontWeight: 'semibold',
                color: 'text.primary',
              })}
            >
              Selected Items
            </h4>
            <div className={settingsStyles.selectedList}>
              {currentSelections.length === 0 ? (
                <p className={typographyStyles.mutedText}>
                  {activeView === 'company' ? 'Products: None selected' : 'No countries selected'}
                </p>
              ) : (
                currentSelections.map((item) => (
                  <div key={item.id} className={settingsStyles.selectedItem}>
                    <span
                      className={css({
                        display: 'block',
                        fontFamily: 'data',
                        fontSize: 'sm',
                        color: 'text.primary',
                        fontWeight: 'medium',
                      })}
                    >
                      {item.name}
                    </span>
                    {item.category && (
                      <span
                        className={css({
                          display: 'block',
                          fontFamily: 'data',
                          fontSize: 'xs',
                          color: 'text.muted',
                          marginTop: '0.25rem',
                        })}
                      >
                        Products: {item.category}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              className={settingsStyles.sendButton}
              onClick={sendNotifications}
              disabled={selectedCompanies.length === 0 && selectedCountries.length === 0}
            >
              Send notifications to...
            </button>
          </div>
        </div>
      </div>

      <div
        className={css({
          padding: '1rem 2rem',
          textAlign: 'center',
          background: 'white',
          borderTop: '1px solid #e0e0e0',
        })}
      >
        <p
          className={css({
            margin: 0,
            fontFamily: 'data',
            fontSize: 'xs',
            color: 'text.muted',
          })}
        >
          Proprietary and Confidential: Copyright Staples Technology Solutions 2025
        </p>
      </div>
    </div>
  )
}

export default NotificationSettings
