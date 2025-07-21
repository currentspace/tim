import './Navigation.css'

export type ViewType =
  | 'startup'
  | 'tariff'
  | 'exposure'
  | 'timeline'
  | 'notifications'
  | 'country-timeline'

interface NavigationItem {
  id: ViewType
  label: string
  description: string
  category: 'visualization' | 'settings'
}

const navigationItems: NavigationItem[] = [
  {
    id: 'tariff',
    label: 'Anticipated Tariff Impact',
    description: 'View anticipated tariff impact by company',
    category: 'visualization',
  },
  {
    id: 'timeline',
    label: 'Company Tariff Timeline',
    description: 'Track tariff rates over time by company',
    category: 'visualization',
  },
  {
    id: 'country-timeline',
    label: 'Country Tariff Timeline',
    description: 'Track tariff rates over time by country',
    category: 'visualization',
  },
  {
    id: 'exposure',
    label: 'Country Exposure',
    description: 'Analyze revenue exposure by country',
    category: 'visualization',
  },
  {
    id: 'startup',
    label: 'Startup Universe',
    description: 'Explore the startup ecosystem network',
    category: 'visualization',
  },
  {
    id: 'notifications',
    label: 'Notification Settings',
    description: 'Configure alerts and notifications',
    category: 'settings',
  },
]

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

function Navigation({ currentView, onViewChange }: NavigationProps) {
  const visualizations = navigationItems.filter((item) => item.category === 'visualization')
  const settings = navigationItems.filter((item) => item.category === 'settings')

  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h1>Staples Technology Solutions</h1>
        <p className="navigation-subtitle">TIM Dashboard</p>
      </div>

      <div className="navigation-sections">
        <div className="navigation-section">
          <h2 className="navigation-section-title">Visualizations</h2>
          <div className="navigation-items">
            {visualizations.map((item) => (
              <button
                key={item.id}
                className={`navigation-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => {
                  onViewChange(item.id)
                }}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="navigation-item-label">{item.label}</span>
                <span className="navigation-item-description">{item.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="navigation-section">
          <h2 className="navigation-section-title">Settings</h2>
          <div className="navigation-items">
            {settings.map((item) => (
              <button
                key={item.id}
                className={`navigation-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => {
                  onViewChange(item.id)
                }}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="navigation-item-label">{item.label}</span>
                <span className="navigation-item-description">{item.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation-footer">
        <p className="navigation-version">Version 1.0.0</p>
      </div>
    </nav>
  )
}

export default Navigation
