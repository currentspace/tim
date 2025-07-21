#!/usr/bin/env node

import { mkdir, copyFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const screenshotsDir = 'screenshots'
const comparisonDir = 'screenshot-comparisons'
const designImagesDir = 'src/images'

// Map captured screenshots to design images for comparison
const comparisonMap = [
  {
    captured: 'anticipated-tariff-impact-component.png',
    design: 'anticipated.png',
    name: 'Anticipated Tariff Impact'
  },
  {
    captured: 'country-exposure-component.png',
    design: 'exposure.png',
    name: 'Country Exposure'
  },
  {
    captured: 'tariff-rate-timeline-component.png',
    design: 'Screenshot 2025-07-21 at 12.06.07 PM.png',
    name: 'Tariff Rate Timeline'
  },
  {
    captured: 'country-tariff-timeline-component.png',
    design: 'company_timeline.png',
    name: 'Country Tariff Timeline'
  },
  {
    captured: 'startup-universe-component.png',
    design: 'Screenshot 2025-07-21 at 12.05.50 PM.png',
    name: 'Startup Universe'
  }
]

async function organizeScreenshots() {
  console.log('Organizing screenshots for comparison...\n')

  // Create comparison directory structure
  for (const item of comparisonMap) {
    const vizDir = join(comparisonDir, item.name.toLowerCase().replace(/\s+/g, '-'))
    await mkdir(vizDir, { recursive: true })

    // Copy captured screenshot
    const capturedPath = join(screenshotsDir, item.captured)
    if (existsSync(capturedPath)) {
      await copyFile(capturedPath, join(vizDir, 'captured.png'))
      console.log(`✓ Copied captured screenshot for ${item.name}`)
    } else {
      console.log(`✗ Missing captured screenshot: ${capturedPath}`)
    }

    // Copy design image
    const designPath = join(designImagesDir, item.design)
    if (existsSync(designPath)) {
      await copyFile(designPath, join(vizDir, 'design.png'))
      console.log(`✓ Copied design image for ${item.name}`)
    } else {
      console.log(`✗ Missing design image: ${designPath}`)
    }

    console.log(`  → Comparison folder: ${vizDir}\n`)
  }

  // Create an HTML comparison page
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Comparisons</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .comparison { 
      margin: 30px 0; 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .images { display: flex; gap: 20px; margin-top: 15px; }
    .image-container { 
      flex: 1; 
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .image-container h3 { 
      margin: 0; 
      padding: 10px; 
      background: #f0f0f0;
      border-bottom: 1px solid #ddd;
    }
    img { 
      max-width: 100%; 
      height: auto; 
      display: block;
    }
  </style>
</head>
<body>
  <h1>Visualization Screenshot Comparisons</h1>
  ${comparisonMap.map(item => {
    const vizDir = item.name.toLowerCase().replace(/\s+/g, '-')
    return `
    <div class="comparison">
      <h2>${item.name}</h2>
      <div class="images">
        <div class="image-container">
          <h3>Design</h3>
          <img src="${vizDir}/design.png" alt="${item.name} Design">
        </div>
        <div class="image-container">
          <h3>Captured</h3>
          <img src="${vizDir}/captured.png" alt="${item.name} Captured">
        </div>
      </div>
    </div>
    `
  }).join('')}
</body>
</html>
  `

  await writeFile(join(comparisonDir, 'index.html'), html)
  console.log(`\n✓ Created comparison page at: ${join(comparisonDir, 'index.html')}`)
  console.log('\nTo view comparisons, open the index.html file in your browser.')
}

// Run the script
organizeScreenshots().catch(console.error)