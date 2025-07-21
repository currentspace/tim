import './TopNavigation.css'

interface TopNavigationProps {
  leftSection?: React.ReactNode
  centerSection?: React.ReactNode
  rightSection?: React.ReactNode
}

function TopNavigation({ leftSection, centerSection, rightSection }: TopNavigationProps) {
  return (
    <header className="top-navigation">
      <div className="nav-section nav-left">
        {leftSection}
      </div>
      <div className="nav-section nav-center">
        {centerSection}
      </div>
      <div className="nav-section nav-right">
        {rightSection}
      </div>
    </header>
  )
}

export default TopNavigation