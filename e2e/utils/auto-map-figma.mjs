#!/usr/bin/env node

import { readdir } from 'fs/promises'
import { join } from 'path'

async function getFigmaFiles() {
  const figmaDir = join(process.cwd(), 'figma')
  const files = await readdir(figmaDir)
  const pngFiles = files.filter((f) => f.endsWith('.png'))

  console.log('Found Figma files:')
  pngFiles.forEach((file, i) => {
    console.log(`${i + 1}. "${file}"`)
  })

  // Try to auto-map based on content
  const mapping = {
    anticipated: pngFiles.find((f) => f.includes('12.06.20')),
    exposure: pngFiles.find((f) => f.includes('12.06.36')),
    companyTimeline: pngFiles.find((f) => f.includes('company_timeline')),
    countryTimeline: pngFiles.find((f) => f.includes('12.07.07')),
    universe: pngFiles.find((f) => f.includes('12.05.50')),
  }

  console.log('\nSuggested mapping:')
  console.log('Anticipated Tariff Impact:', mapping.anticipated || 'NOT FOUND')
  console.log('Country Exposure:', mapping.exposure || 'NOT FOUND')
  console.log('Company Timeline:', mapping.companyTimeline || 'NOT FOUND')
  console.log('Country Timeline:', mapping.countryTimeline || 'NOT FOUND')
  console.log('Startup Universe:', mapping.universe || 'NOT FOUND')

  return mapping
}

getFigmaFiles().catch(console.error)
