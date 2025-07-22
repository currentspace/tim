/* eslint-disable no-console */

import { rename } from 'fs/promises'
import { join } from 'path'

const figmaDir = join(process.cwd(), 'figma')

async function fixFigmaNames() {
  const renamings = [
    // Current name → Correct name based on actual content
    { from: 'anticipated_tariff_impact.png', to: 'tariff_timeline.png' },
    { from: 'company_timeline.png', to: 'anticipated_tariff_impact_expanded.png' },
    { from: 'country_exposure.png', to: 'notification_settings_companies.png' },
    { from: 'startup_universe.png', to: 'anticipated_tariff_impact.png' },
    { from: 'screenshot_unused_1.png', to: 'notification_settings_countries.png' },
    { from: 'screenshot_unused_2.png', to: 'country_exposure.png' },
    { from: 'screenshot_unused_3.png', to: 'anticipated_tariff_impact_alt.png' },
    // Keep these as-is
    { from: 'country_timeline.png', to: 'country_timeline.png' },
    { from: 'tariff_rate_timeline.png', to: 'tariff_rate_timeline.png' },
  ]

  for (const { from, to } of renamings) {
    if (from !== to) {
      try {
        await rename(join(figmaDir, from), join(figmaDir, to))
        console.log(`✓ Renamed: ${from} → ${to}`)
      } catch (err) {
        console.error(`✗ Failed to rename ${from}: ${String((err as Error).message)}`)
      }
    }
  }

  console.log('\nDone! Figma files have been renamed to match their actual content.')
}

fixFigmaNames().catch(console.error)
