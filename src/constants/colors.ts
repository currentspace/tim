// Company colors based on the screenshots
export const COMPANY_COLORS: Record<string, string> = {
  hp: '#00b8a9', // Teal
  apple: '#ff8c1a', // Orange
  canon: '#ff66b3', // Pink
  dell: '#8b5cf6', // Purple
  microsoft: '#3b82f6', // Light Blue
  amazon: '#ff9500', // Orange variant
  nvidia: '#76c043', // Green
  intel: '#0071c5', // Intel Blue
  lenovo: '#e60012', // Red
  cisco: '#00bceb', // Cyan
  ibm: '#0f62fe', // IBM Blue
  samsung: '#1428a0', // Samsung Blue
  tsmc: '#0066cc', // Blue
  foxconn: '#ee7624', // Orange
  oracle: '#c74634', // Oracle Red
  meta: '#0084ff', // Facebook Blue
  tencent: '#00a0e9', // Light Blue
  qualcomm: '#3253dc', // Blue
  broadcom: '#cc0000', // Red
  amd: '#00a88f', // Teal
  salesforce: '#00a1e0', // Salesforce Blue
  sap: '#0070f3', // SAP Blue
  accenture: '#a100ff', // Purple
  sony: '#000000', // Black
  panasonic: '#0046b8', // Blue
}

// Country colors based on the screenshots
export const COUNTRY_COLORS: Record<string, string> = {
  China: '#ff4d4d',
  Vietnam: '#ff8c1a',
  Mexico: '#ffcc00',
  EU: '#4dff4d',
  Taiwan: '#1affe6',
  Japan: '#1a75ff',
  Malaysia: '#6666ff',
  'South Korea': '#b366ff',
  Philippines: '#ff66ff',
  Thailand: '#ff66b3',
  USA: '#4d94ff',
  India: '#ff9933',
  Israel: '#0066cc',
  Ireland: '#009900',
  Germany: '#ffcc00',
  Singapore: '#ff0000',
  Canada: '#ff0000',
}

// Chart background and grid colors
export const CHART_COLORS = {
  background: '#ffffff',
  grid: '#e0e0e0',
  gridLight: '#f5f5f5',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#dddddd',
  borderLight: '#eeeeee',
}

// D3 visualization colors - matching our design system
export const D3_COLORS = {
  // Text colors
  TEXT_PRIMARY: '#213547', // --color-ink
  TEXT_SECONDARY: 'rgba(33, 53, 71, 0.87)', // --color-ink-light
  TEXT_MUTED: '#666', // --color-ink-muted

  // Background colors
  BG_PRIMARY: '#ffffff', // --color-paper
  BG_SECONDARY: '#f5f5f5',
  BG_HOVER: '#fafafa',

  // Border colors
  BORDER_DEFAULT: 'rgba(0, 0, 0, 0.08)',
  BORDER_SUBTLE: 'rgba(0, 0, 0, 0.04)',
  BORDER_STRONG: 'rgba(0, 0, 0, 0.15)',

  // Grid and axis
  GRID_LINE: '#e0e0e0',
  AXIS_LINE: '#999',

  // Brand colors
  ACCENT: '#646cff', // --color-accent
  DATA_ORANGE: '#ff8800', // --color-data
  ALERT: '#ff4d4d', // --color-alert

  // Chart colors
  CHART_BLUE: '#646cff',
  CHART_GREEN: '#82ca9d',
  CHART_PURPLE: '#8884d8',

  // Default fallback
  DEFAULT_GRAY: '#888888',

  // Tooltip and shadow
  TOOLTIP_BG: 'rgba(0, 0, 0, 0.9)',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
} as const

// Status colors
export const STATUS_COLORS = {
  active: '#4caf50',
  paused: '#ff9800',
  blocked: '#f44336',
  proposed: '#2196f3',
}

// Gradient definitions for special effects
export const GRADIENTS = {
  tariffImpact: {
    low: '#82ca9d', // Green
    medium: '#FFA500', // Orange
    high: '#DC143C', // Red
  },
  revenue: {
    positive: '#4caf50',
    neutral: '#2196f3',
    negative: '#f44336',
  },
}

// Get company color with fallback
export function getCompanyColor(companyId: string): string {
  return COMPANY_COLORS[companyId] || '#888888'
}

// Get country color with fallback
export function getCountryColor(country: string): string {
  return COUNTRY_COLORS[country] || '#888888'
}

// Create a color scale for numeric values
export function createColorScale(
  domain: [number, number],
  range: string[],
): (value: number) => string {
  const scale = (value: number): string => {
    const normalized = (value - domain[0]) / (domain[1] - domain[0])
    const index = Math.floor(normalized * (range.length - 1))
    const remainder = normalized * (range.length - 1) - index

    if (index >= range.length - 1) return range[range.length - 1]
    if (index < 0) return range[0]

    // Interpolate between colors
    const color1 = range[index]
    const color2 = range[index + 1]

    // Simple RGB interpolation
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)

    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)

    const r = Math.round(r1 + (r2 - r1) * remainder)
    const g = Math.round(g1 + (g2 - g1) * remainder)
    const b = Math.round(b1 + (b2 - b1) * remainder)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return scale
}
