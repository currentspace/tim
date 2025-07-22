import { test } from '@playwright/test'
import { join } from 'path'

test.describe('Visual Navigation Check', () => {
  test('compare navigation with all design mockups', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForLoadState('networkidle')

    // Design mockup mappings
    const designMockups = [
      {
        file: 'Screenshot 2025-07-21 at 12.05.50 PM.png',
        route: '/',
        name: 'anticipated-tariff',
      },
      {
        file: 'Screenshot 2025-07-21 at 12.07.16 PM.png',
        route: '/country-exposure',
        name: 'country-exposure',
      },
      {
        file: 'Screenshot 2025-07-21 at 12.06.20 PM.png',
        route: '/company-timeline',
        name: 'company-timeline',
      },
      {
        file: 'Screenshot 2025-07-21 at 12.07.07 PM.png',
        route: '/country-timeline',
        name: 'country-timeline',
      },
    ]

    for (const mockup of designMockups) {
      // Navigate to the route
      await page.goto(`http://localhost:5173${mockup.route}`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500) // Wait for any animations

      // Create side-by-side comparison
      const comparisonHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Navigation Comparison - ${mockup.name}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: #1a1a1a;
            }
            .comparison-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2px;
              background: #333;
              height: 100vh;
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
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 600;
              z-index: 10;
            }
            .panel img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              background: white;
            }
            .panel iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
            .analysis {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(0,0,0,0.9);
              color: white;
              padding: 20px;
              font-size: 12px;
            }
            .analysis h3 {
              margin: 0 0 10px 0;
              font-size: 14px;
            }
            .analysis ul {
              margin: 0;
              padding-left: 20px;
            }
          </style>
        </head>
        <body>
          <div class="comparison-container">
            <div class="panel">
              <div class="panel-label">Design Mockup</div>
              <img src="file://${join(process.cwd(), 'figma', mockup.file)}" alt="Design">
            </div>
            <div class="panel">
              <div class="panel-label">Current Implementation</div>
              <iframe src="http://localhost:5173${mockup.route}"></iframe>
            </div>
          </div>
        </body>
        </html>
      `

      // Create new page for comparison
      const comparisonPage = await page.context().newPage()
      await comparisonPage.setViewportSize({ width: 2880, height: 900 })
      await comparisonPage.setContent(comparisonHtml)
      await comparisonPage.waitForTimeout(2000)

      // Take screenshot
      await comparisonPage.screenshot({
        path: `navigation-comparison/comparison-${mockup.name}.png`,
        fullPage: false,
      })

      await comparisonPage.close()
    }

    console.log('Visual comparisons saved to navigation-comparison/')
  })

  test('analyze navigation differences', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.setViewportSize({ width: 1440, height: 900 })

    const navigation = page.locator('.top-navigation')

    console.log('\n=== Navigation Analysis ===')

    // Check current implementation details
    const navHeight = await navigation.evaluate((el) => {
      // Defensive: If element is not present, or not an HTMLElement, return null/0
      if (!el || !(el instanceof HTMLElement)) return 0
      return el.offsetHeight
    })
    console.log(`Navigation height: ${navHeight}px (Design: ~80px)`)

    // Check badge
    const badge = navigation.locator('.tab-badge')
    const badgeText = await badge.textContent()
    const badgeStyles = await badge.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        background: styles.backgroundColor,
        padding: styles.padding,
        fontSize: styles.fontSize,
        borderRadius: styles.borderRadius,
      }
    })
    console.log('\nBadge details:')
    console.log(`- Text: "${badgeText}"`)
    console.log(`- Background: ${badgeStyles.background}`)
    console.log(`- Padding: ${badgeStyles.padding}`)
    console.log(`- Font size: ${badgeStyles.fontSize}`)
    console.log(`- Border radius: ${badgeStyles.borderRadius}`)

    // Check company branding
    const companyName = await navigation.locator('.company-name').textContent()
    const companySubtitle = await navigation.locator('.company-subtitle').textContent()
    console.log('\nCompany branding:')
    console.log(`- Name: "${companyName}"`)
    console.log(`- Subtitle: "${companySubtitle}"`)

    // Differences from design
    console.log('\n=== Key Differences from Design ===')
    console.log('1. Navigation has menu button (not in design)')
    console.log('2. Badge styling may need adjustment')
    console.log('3. Toggle switch positioning')
    console.log('4. Missing "Timeline", "Chart", "Notifications" text below header')
    console.log('5. Missing back button on some views')
  })
})
