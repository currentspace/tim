import { css, cx } from '../../styled-system/css'
import { flexLayout, pageContainer } from '../../styled-system/recipes'

interface TopNavigationProps {
  leftSection?: React.ReactNode
  centerSection?: React.ReactNode
  rightSection?: React.ReactNode
}

const topNavigationStyles = cx(
  flexLayout({ align: 'center', justify: 'between' }),
  pageContainer({ variant: 'header', padding: 'none' }),
  css({
    px: '3rem',
    py: '1.5rem',
    minHeight: '90px',
    flexWrap: 'nowrap',
  }),
)

const navLeftStyles = flexLayout({ align: 'center', gap: 'md', grow: '1', justify: 'start' })
const navCenterStyles = flexLayout({ align: 'center', gap: 'md', shrink: '0' })
const navRightStyles = flexLayout({ align: 'center', gap: 'md', grow: '1', justify: 'end' })

function TopNavigation({ leftSection, centerSection, rightSection }: TopNavigationProps) {
  return (
    <header className={topNavigationStyles}>
      <div className={navLeftStyles}>{leftSection}</div>
      <div className={navCenterStyles}>{centerSection}</div>
      <div className={navRightStyles}>{rightSection}</div>
    </header>
  )
}

export default TopNavigation
