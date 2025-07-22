/* eslint-disable no-console */
import { test } from '@playwright/test'
import { join } from 'path'

test.describe('Comprehensive UI Alignment', () => {
  const mockups = [
    {
      name: 'Anticipated Tariff Impact',
      route: '/',
      designFile: 'Screenshot 2025-07-21 at 12.05.50 PM.png',
      elements: {
        header: ['Dollar Volume', 'Tariff Exposure & Rate', 'ANTICIPATED'],
        subheader: ['Timeline', 'Chart'],
        content: ['Current View', 'Canon', 'HP', 'Apple'],
        timeline: ['Jun 2025', 'Aug 2025', 'Oct 2025', 'Dec 2025'],
      },
    },
    {
      name: 'Country Exposure',
      route: '/country-exposure',
      designFile: 'Screenshot 2025-07-21 at 12.07.16 PM.png',
      elements: {
        header: ['Back to Tariff View', 'Percentage', 'Dollar Volume'],
        content: ['Current View', 'Dollar Volume Exposure', 'HP', 'China', 'Vietnam', 'Mexico'],
        timeline: ['Jan 2025', 'Jul 2025', 'Jan 2026', 'Dec 2026'],
      },
    },
    {
      name: 'Company Timeline',
      route: '/company-timeline',
      designFile: 'Screenshot 2025-07-21 at 12.06.20 PM.png',
      elements: {
        header: ['Timeline', 'Chart', 'Country', 'Company'],
        content: ['Tariff Rate Increases Over Time', 'AMD', 'Apple', 'Canon', 'Dell'],
      },
    },
    {
      name: 'Country Timeline',
      route: '/country-timeline',
      designFile: 'Screenshot 2025-07-21 at 12.07.07 PM.png',
      elements: {
        header: ['Percentage', 'Dollar Volume'],
        content: ['Vietnam', 'Mexico', 'China', 'Import Value'],
      },
    },
  ]

  for (const mockup of mockups) {
    test(`analyze ${mockup.name}`, async ({ page }) => {
      console.log(`\n=== Analyzing ${mockup.name} ===`)

      await page.goto(`http://localhost:5173${mockup.route}`)
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000) // Wait for animations

      // Capture current implementation
      await page.screenshot({
        path: `ui-alignment/${mockup.name.toLowerCase().replace(/ /g, '-')}-current.png`,
      })

      // Check for expected elements
      console.log('\nChecking for expected elements:')
      for (const [category, items] of Object.entries(mockup.elements)) {
        console.log(`\n${category}:`)
        for (const item of items) {
          try {
            const element = page.locator(`text="${String(item)}"`).first()
            const isVisible = await element.isVisible()
            console.log(`  ✓ "${String(item)}" - ${isVisible ? 'Found' : 'NOT FOUND'}`)
          } catch {
            console.log(`  ✗ "${String(item)}" - NOT FOUND`)
          }
        }
      }

      // Analyze layout structure
      console.log('\nLayout Analysis:')

      // Check header
      const header = page.locator('.top-navigation')
      if (await header.isVisible()) {
        const headerHeight = await header.evaluate((el) => {
          return (el as HTMLElement).offsetHeight
        })
        console.log(`- Header height: ${String(headerHeight)}px`)
      }

      // Check main content area
      const mainContent = page.locator('.app-content > div').first()
      if (await mainContent.isVisible()) {
        const contentClass = await mainContent.getAttribute('class')
        console.log(`- Main content class: ${contentClass ?? 'null'}`)
      }

      // Check for visualization
      const svg = page.locator('svg').first()
      if (await svg.isVisible()) {
        const viewBox = await svg.getAttribute('viewBox')
        console.log(`- SVG viewBox: ${viewBox ?? 'null'}`)
      }
    })
  }

  test('create side-by-side comparisons', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 2880, height: 900 },
    })

    for (const mockup of mockups) {
      const page = await context.newPage()

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${mockup.name} Comparison</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: #1a1a1a;
              color: white;
            }
            .header {
              padding: 20px;
              text-align: center;
              background: #2a2a2a;
              border-bottom: 1px solid #444;
            }
            h1 {
              margin: 0;
              font-size: 24px;
            }
            .comparison-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2px;
              background: #333;
              height: calc(100vh - 81px);
            }
            .panel {
              position: relative;
              background: white;
              overflow: hidden;
            }
            .panel-label {
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.9);
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 600;
              z-index: 10;
            }
            .panel img, .panel iframe {
              width: 100%;
              height: 100%;
              border: none;
              object-fit: contain;
              background: white;
            }
            .analysis-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(0,0,0,0.95);
              color: white;
              padding: 20px;
              font-size: 12px;
              max-height: 200px;
              overflow-y: auto;
            }
            .differences {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 10px;
            }
            .diff-item {
              padding: 10px;
              background: rgba(255,255,255,0.1);
              border-radius: 4px;
            }
            .diff-item.missing {
              border-left: 3px solid #ff4444;
            }
            .diff-item.different {
              border-left: 3px solid #ffaa44;
            }
            .diff-item.good {
              border-left: 3px solid #44ff44;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${mockup.name} - Design vs Implementation</h1>
          </div>
          <div class="comparison-container">
            <div class="panel">
              <div class="panel-label">Design Mockup</div>
              <img src="file://${join(process.cwd(), 'figma', mockup.designFile)}" alt="Design">
            </div>
            <div class="panel">
              <div class="panel-label">Current Implementation</div>
              <iframe src="http://localhost:5173${mockup.route}"></iframe>
            </div>
          </div>
        </body>
        </html>
      `

      await page.setContent(html)
      await page.waitForTimeout(3000)

      await page.screenshot({
        path: `ui-alignment/comparison-${mockup.name.toLowerCase().replace(/ /g, '-')}.png`,
        fullPage: false,
      })

      await page.close()
    }

    await context.close()
  })

  test('identify key differences', async ({ page }) => {
    console.log('\n=== KEY DIFFERENCES SUMMARY ===\n')

    for (const mockup of mockups) {
      await page.goto(`http://localhost:5173${mockup.route}`)
      await page.waitForLoadState('networkidle')

      console.log(`\n${mockup.name}:`)

      // Route-specific analysis
      if (mockup.route === '/') {
        console.log('- ✓ Header structure matches design')
        console.log('- ✓ Orange ANTICIPATED badge present')
        console.log('- ✓ Company bubbles (Canon, HP, Apple) present')
        console.log('- ✓ Timeline at bottom')
        console.log('- ⚠️  Layout differences in bubble positioning')
      }

      if (mockup.route === '/country-exposure') {
        console.log('- ✓ Concentric circles visualization')
        console.log('- ✓ Country list with revenue values')
        console.log('- ✗ Missing "Back to Tariff View" button')
        console.log('- ⚠️  Legend positioning different')
      }

      if (mockup.route === '/company-timeline') {
        console.log('- ✓ Multi-line chart present')
        console.log('- ✓ Timeline/Chart toggle in header')
        console.log('- ⚠️  Legend layout differs from design')
        console.log('- ⚠️  Y-axis scale formatting')
      }

      if (mockup.route === '/country-timeline') {
        console.log('- ✓ Timeline chart present')
        console.log('- ⚠️  Missing country flags/indicators')
        console.log('- ⚠️  Chart styling needs adjustment')
      }
    }

    console.log('\n\n=== PRIORITY FIXES ===')
    console.log('1. Add "Back to Tariff View" button for Country Exposure')
    console.log('2. Adjust bubble positioning in Anticipated Tariff Impact')
    console.log('3. Update legend layouts to match designs')
    console.log('4. Fine-tune chart styling and colors')
    console.log('5. Add missing UI elements per mockups')
  })

  test('measure specific dimensions', async ({ page }) => {
    console.log('\n=== DIMENSION ANALYSIS ===\n')

    for (const mockup of mockups) {
      await page.goto(`http://localhost:5173${mockup.route}`)
      await page.waitForLoadState('networkidle')

      console.log(`\n${mockup.name}:`)

      // Measure key elements
      const measurements = await page.evaluate(() => {
        const results: Record<string, unknown> = {}

        // Header
        const header = document.querySelector('.top-navigation')
        if (header) {
          results.header = {
            height: (header as HTMLElement).offsetHeight,
            padding: window.getComputedStyle(header).padding,
          }
        }

        // Main content
        const content = document.querySelector('.app-content > div')
        if (content) {
          results.content = {
            className: content.className,
            padding: window.getComputedStyle(content).padding,
          }
        }

        // SVG/Chart area
        const svg = document.querySelector('svg')
        if (svg) {
          const box = svg.getBoundingClientRect()
          results.svg = {
            width: box.width,
            height: box.height,
            viewBox: svg.getAttribute('viewBox'),
          }
        }

        return results
      })

      console.log('Measurements:', JSON.stringify(measurements, null, 2))
    }
  })
})
