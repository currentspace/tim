import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Navigation Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('capture current navigation implementation', async ({ page }) => {
    // Set viewport to match design mockups
    await page.setViewportSize({ width: 1440, height: 900 })

    // Wait for navigation to be fully rendered
    await page.waitForSelector('.top-navigation', { state: 'visible' })

    // Capture just the navigation header
    const navigation = await page.locator('.top-navigation')
    await navigation.screenshot({
      path: 'navigation-comparison/current-navigation.png',
    })

    // Capture full page for context
    await page.screenshot({
      path: 'navigation-comparison/current-full-page.png',
      fullPage: false,
    })

    // Navigate through each route and capture navigation state
    const routes = [
      { path: '/', name: 'anticipated-tariff' },
      { path: '/country-exposure', name: 'country-exposure' },
      { path: '/company-timeline', name: 'company-timeline' },
      { path: '/country-timeline', name: 'country-timeline' },
      { path: '/startup-universe', name: 'startup-universe' },
    ]

    for (const route of routes) {
      await page.goto(`http://localhost:5173${route.path}`)
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('.top-navigation', { state: 'visible' })

      const navigation = await page.locator('.top-navigation')
      await navigation.screenshot({
        path: `navigation-comparison/${route.name}-navigation.png`,
      })
    }
  })

  test('analyze navigation elements', async ({ page }) => {
    // Check for expected navigation elements
    const navigation = page.locator('.top-navigation')

    // Left section - toggle
    const leftSection = navigation.locator('.nav-left')
    await expect(leftSection).toBeVisible()
    const toggleLabel = leftSection.locator('.toggle-label')
    await expect(toggleLabel).toHaveText('Company View')

    // Center section - tabs
    const centerSection = navigation.locator('.nav-center')
    await expect(centerSection).toBeVisible()
    const tabs = centerSection.locator('.tab-button')
    const tabTexts = await tabs.allTextContents()
    console.log('Current tab texts:', tabTexts)

    // Right section - branding
    const rightSection = navigation.locator('.nav-right')
    await expect(rightSection).toBeVisible()
    const companyName = rightSection.locator('.company-name')
    await expect(companyName).toHaveText('CHARLES')

    // Check active tab styling
    const activeTab = centerSection.locator('.tab-button.active')
    await expect(activeTab).toHaveCount(1)
    await expect(activeTab).toHaveText('Anticipated Tariff')
  })

  test('measure navigation dimensions', async ({ page }) => {
    const navigation = page.locator('.top-navigation')
    const box = await navigation.boundingBox()

    console.log('Navigation dimensions:', {
      width: box?.width,
      height: box?.height,
      x: box?.x,
      y: box?.y,
    })

    // Measure individual sections
    const sections = ['.nav-left', '.nav-center', '.nav-right']
    for (const selector of sections) {
      const section = navigation.locator(selector)
      const sectionBox = await section.boundingBox()
      console.log(`${selector} dimensions:`, {
        width: sectionBox?.width,
        height: sectionBox?.height,
      })
    }
  })

  test('check navigation styling', async ({ page }) => {
    const navigation = page.locator('.top-navigation')

    // Check background color
    const backgroundColor = await navigation.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    )
    console.log('Navigation background:', backgroundColor)

    // Check padding
    const padding = await navigation.evaluate((el) => window.getComputedStyle(el).padding)
    console.log('Navigation padding:', padding)

    // Check border
    const borderBottom = await navigation.evaluate((el) => window.getComputedStyle(el).borderBottom)
    console.log('Navigation border:', borderBottom)

    // Check font styles for tabs
    const tabButton = navigation.locator('.tab-button').first()
    const tabStyles = await tabButton.evaluate((el) => ({
      fontFamily: window.getComputedStyle(el).fontFamily,
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight,
      color: window.getComputedStyle(el).color,
    }))
    console.log('Tab button styles:', tabStyles)
  })
})

// Visual comparison helper
test.describe('Visual Comparison with Design', () => {
  test('create side-by-side comparison', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 2880, height: 900 },
    })
    const page = await context.newPage()

    // Create HTML for side-by-side comparison
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Navigation Comparison</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: #f0f0f0;
          }
          .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
          }
          .comparison-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .comparison-header {
            padding: 16px;
            background: #333;
            color: white;
            font-weight: 600;
          }
          .comparison-content {
            position: relative;
          }
          .comparison-content img {
            width: 100%;
            display: block;
          }
          .comparison-content iframe {
            width: 100%;
            height: 900px;
            border: none;
            display: block;
          }
          h1 {
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>Navigation Design Comparison</h1>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-header">Design Mockup</div>
            <div class="comparison-content">
              <img src="file:///Users/brianmeek/scratch/charles/figma/Screenshot 2025-07-21 at 12.05.50 PM.png" alt="Design">
            </div>
          </div>
          <div class="comparison-item">
            <div class="comparison-header">Current Implementation</div>
            <div class="comparison-content">
              <iframe src="http://localhost:5173"></iframe>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    await page.setContent(html)
    await page.waitForTimeout(2000)

    // Take screenshot of comparison
    await page.screenshot({
      path: 'navigation-comparison/side-by-side-comparison.png',
      fullPage: true,
    })

    await context.close()
  })
})
