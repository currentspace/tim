import { chromium } from '@playwright/test'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

// Create directories
const dirs = {
  current: join(process.cwd(), 'visual-comparison', 'current'),
  design: join(process.cwd(), 'src', 'images'),
  comparison: join(process.cwd(), 'visual-comparison', 'side-by-side'),
}

Object.values(dirs).forEach((dir) => {
  if (!existsSync(dir) && dir !== dirs.design) {
    mkdirSync(dir, { recursive: true })
  }
})

// Map design images to visualization types
const designToVisualization = {
  'Screenshot 2025-07-21 at 12.05.50 PM.png': 'anticipated-tariff',
  'Screenshot 2025-07-21 at 12.06.20 PM.png': 'company-timeline',
  'Screenshot 2025-07-21 at 12.06.36 PM.png': 'notifications',
  'Screenshot 2025-07-21 at 12.07.07 PM.png': 'country-timeline',
  'Screenshot 2025-07-21 at 12.07.16 PM.png': 'country-exposure',
}

async function captureCurrentImplementation() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  try {
    console.log('Capturing current implementation screenshots...\n')

    // Since we removed navigation, we need to manually change views
    // For now, we'll capture the default view (anticipated-tariff)
    await page.goto('http://localhost:5173')
    await page.waitForTimeout(3000)

    // Capture the current view
    await page.screenshot({
      path: join(dirs.current, 'anticipated-tariff.png'),
      fullPage: false,
    })
    console.log('✓ Captured: Anticipated Tariff Impact')

    // To capture other views, we would need to implement navigation
    // or modify the App component to accept URL parameters

    // For now, let's just capture what we can see
    console.log('\nNote: To capture other views, we need to implement navigation controls.')
    console.log('Currently showing: Anticipated Tariff Impact (default view)')
  } catch (error) {
    console.error('Error capturing screenshots:', error)
  } finally {
    await browser.close()
  }
}

async function createSideBySideComparison() {
  console.log('\n\nCreating side-by-side comparisons...\n')

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    viewport: { width: 2880, height: 900 }, // Double width for side-by-side
  })

  try {
    // List design images
    const designImages = readdirSync(dirs.design).filter((f) => f.endsWith('.png'))
    console.log(`Found ${designImages.length} design images\n`)

    for (const designImage of Object.keys(designToVisualization)) {
      const page = await context.newPage()

      // Create HTML for side-by-side comparison
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Visual Comparison: ${designImage}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: #f0f0f0;
            }
            .container {
              display: flex;
              height: 100vh;
            }
            .panel {
              flex: 1;
              position: relative;
              overflow: hidden;
              background: white;
            }
            .panel img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .label {
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 600;
            }
            .divider {
              width: 2px;
              background: #333;
              position: relative;
            }
            .divider::after {
              content: 'VS';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #333;
              color: white;
              padding: 8px 12px;
              border-radius: 50%;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="panel">
              <div class="label">Design</div>
              <img src="file://${join(dirs.design, designImage)}" alt="Design">
            </div>
            <div class="divider"></div>
            <div class="panel">
              <div class="label">Current Implementation</div>
              <iframe src="http://localhost:5173" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
          </div>
        </body>
        </html>
      `

      await page.setContent(html)
      await page.waitForTimeout(2000)

      console.log(`Viewing comparison: ${designImage}`)
      console.log('Browser window is open for visual comparison')
      console.log('Press Enter to continue to the next comparison...\n')

      // Wait for user input
      await new Promise((resolve) => {
        process.stdin.once('data', resolve)
      })

      await page.close()
    }
  } catch (error) {
    console.error('Error creating comparisons:', error)
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('Visual Comparison Tool')
  console.log('======================\n')
  console.log('This tool will help compare design mockups with current implementation.\n')

  // Capture current implementation
  await captureCurrentImplementation()

  // Create side-by-side comparisons
  console.log('\nPress Enter to start side-by-side comparison...')
  await new Promise((resolve) => {
    process.stdin.once('data', resolve)
  })

  await createSideBySideComparison()

  console.log('\nComparison complete!')
}

// Enable stdin for user input
process.stdin.setRawMode(true)
process.stdin.resume()

main()
  .catch(console.error)
  .finally(() => {
    process.stdin.setRawMode(false)
    process.stdin.pause()
    process.exit(0)
  })
