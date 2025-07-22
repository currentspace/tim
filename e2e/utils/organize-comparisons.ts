/* eslint-disable no-console */
import { mkdir, copyFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const screenshotsDir = 'screenshots'
const comparisonDir = 'screenshot-comparisons'
const designImagesDir = 'figma'

// Map captured screenshots to design images for comparison
const comparisonMap = [
  {
    captured: 'anticipated-tariff-impact-component.png',
    design: 'anticipated_tariff_impact.png',
    name: 'Anticipated Tariff Impact',
  },
  {
    captured: 'country-exposure-component.png',
    design: 'country_exposure.png',
    name: 'Country Exposure',
  },
  {
    captured: 'company-timeline-component.png',
    design: 'tariff_timeline.png', // Line chart timeline
    name: 'Company Timeline',
  },
  {
    captured: 'country-timeline-component.png',
    design: 'country_timeline.png',
    name: 'Country Timeline',
  },
  {
    captured: 'startup-universe-component.png',
    design: 'startup_universe.png',
    name: 'Startup Universe',
  },
]

async function organizeScreenshots() {
  console.log('Organizing screenshots for comparison...\n')

  // Create comparison directory if it doesn't exist
  if (!existsSync(comparisonDir)) {
    await mkdir(comparisonDir, { recursive: true })
  }

  // Get list of captured screenshots
  const capturedFiles = await readdir(screenshotsDir)
  const designFiles = await readdir(designImagesDir)

  // Organize comparisons
  for (const mapping of comparisonMap) {
    const capturedExists = capturedFiles.includes(mapping.captured)
    const designExists = designFiles.includes(mapping.design)

    if (capturedExists && designExists) {
      // Create subdirectory for this comparison
      const subDir = join(comparisonDir, mapping.name.toLowerCase().replace(/\s+/g, '-'))
      await mkdir(subDir, { recursive: true })

      // Copy files
      await copyFile(join(screenshotsDir, mapping.captured), join(subDir, 'captured.png'))
      await copyFile(join(designImagesDir, mapping.design), join(subDir, 'design.png'))

      console.log(`✓ Copied captured screenshot for ${mapping.name}`)
      console.log(`✓ Copied design image for ${mapping.name}`)
      console.log(`  → Comparison folder: ${subDir}\n`)
    } else {
      if (!capturedExists) {
        console.log(`✗ Missing captured screenshot: ${mapping.captured}`)
      }
      if (!designExists) {
        console.log(`✗ Missing design image: ${mapping.design}`)
      }
      console.log('')
    }
  }

  // Create an HTML page for easy comparison
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Comparisons</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      text-align: center;
      color: #333;
    }
    .comparison-grid {
      display: grid;
      gap: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .comparison-item {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .comparison-item h2 {
      margin: 0 0 20px 0;
      color: #333;
    }
    .images {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .image-container {
      text-align: center;
    }
    .image-container h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .image-container img {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Screenshot Comparisons</h1>
  <div class="comparison-grid">
    ${comparisonMap
      .map((mapping) => {
        const folderName = mapping.name.toLowerCase().replace(/\s+/g, '-')
        return `
    <div class="comparison-item">
      <h2>${mapping.name}</h2>
      <div class="images">
        <div class="image-container">
          <h3>Figma Design</h3>
          <img src="${folderName}/design.png" alt="${mapping.name} Design">
        </div>
        <div class="image-container">
          <h3>Current Implementation</h3>
          <img src="${folderName}/captured.png" alt="${mapping.name} Implementation">
        </div>
      </div>
    </div>
      `
      })
      .join('')}
  </div>
</body>
</html>`

  await writeFile(join(comparisonDir, 'index.html'), htmlContent)
  console.log(`\n✓ Created comparison page at: ${join(comparisonDir, 'index.html')}`)
  console.log('\nTo view comparisons, open the index.html file in your browser.')
}

void organizeScreenshots().catch((error: unknown) => {
  console.error('Error organizing screenshots:', error)
  process.exit(1)
})
