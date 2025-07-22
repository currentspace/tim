#!/usr/bin/env node

import { readdir, rename } from 'fs/promises'
import { join } from 'path'

const figmaDir = join(process.cwd(), 'figma')

async function renameFigmaFiles() {
  const files = await readdir(figmaDir)
  
  // Mapping based on the patterns we identified
  const renamings = [
    { pattern: '12.05.50', newName: 'startup_universe.png' },
    { pattern: '12.06.07', newName: 'tariff_rate_timeline.png' },
    { pattern: '12.06.20', newName: 'anticipated_tariff_impact.png' },
    { pattern: '12.06.36', newName: 'country_exposure.png' },
    { pattern: '12.06.51', newName: 'screenshot_unused_1.png' },
    { pattern: '12.07.07', newName: 'country_timeline.png' },
    { pattern: '12.07.16', newName: 'screenshot_unused_2.png' },
    { pattern: '12.07.51', newName: 'screenshot_unused_3.png' },
  ]
  
  for (const { pattern, newName } of renamings) {
    const oldFile = files.find(f => f.includes(pattern))
    if (oldFile && oldFile !== newName) {
      const oldPath = join(figmaDir, oldFile)
      const newPath = join(figmaDir, newName)
      
      try {
        await rename(oldPath, newPath)
        console.log(`✓ Renamed: ${oldFile} → ${newName}`)
      } catch (err) {
        console.error(`✗ Failed to rename ${oldFile}: ${err.message}`)
      }
    }
  }
  
  console.log('\nFinal file listing:')
  const finalFiles = await readdir(figmaDir)
  finalFiles.forEach(f => console.log(`  - ${f}`))
}

renameFigmaFiles().catch(console.error)