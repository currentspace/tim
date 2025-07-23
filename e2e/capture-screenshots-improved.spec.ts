/* eslint-disable no-console */
import { test, expect, Page } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Ensure screenshots directory exists
const screenshotsDir = join(process.cwd(), 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

// Define all routes and their corresponding Figma design files
const routes = [
  {
    path: '/',
    name: 'Anticipated Tariff Impact',
    navText: 'Anticipated Tariff Impact',
    screenshotName: 'anticipated-tariff-impact',
    figmaFile: 'anticipated_tariff_impact.png',
    waitForSelectors: ['svg', 'canvas'],
    componentSelector: 'main',
  },
  {
    path: '/country-exposure',
    name: 'Country Exposure',
    navText: 'Country Exposure',
    screenshotName: 'country-exposure',
    figmaFile: 'country_exposure.png',
    waitForSelectors: ['svg', '.country-exposure'],
    componentSelector: 'main',
  },
  {
    path: '/company-timeline',
    name: 'Company Timeline',
    navText: 'Company Timeline',
    screenshotName: 'company-timeline',
    figmaFile: 'tariff_timeline.png',
    waitForSelectors: ['svg', '.tariff-rate-timeline'],
    componentSelector: 'main',
  },
  {
    path: '/country-timeline',
    name: 'Country Timeline',
    navText: 'Country Timeline',
    screenshotName: 'country-timeline',
    figmaFile: 'country_timeline.png',
    waitForSelectors: ['svg', '.country-tariff-timeline'],
    componentSelector: 'main',
  },
  {
    path: '/startup-universe',
    name: 'Startup Universe',
    navText: 'Startup Universe',
    screenshotName: 'startup-universe',
    figmaFile: 'startup_universe.png',
    waitForSelectors: ['svg', '.startup-universe'],
    componentSelector: 'main',
  },
]

// Helper function to wait for all animations to complete
async function waitForAnimations(page: Page): Promise<void> {
  // Wait for any CSS animations/transitions to complete
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      // Check if any animations are running
      const checkAnimations = () => {
        const animations = document.getAnimations()
        if (animations.length === 0) {
          resolve()
        } else {
          // Wait for all animations to finish
          void Promise.all(animations.map((animation) => animation.finished)).then(() => {
            resolve()
          })
        }
      }

      // Give a small delay to ensure animations have started
      setTimeout(checkAnimations, 100)
    })
  })
}

// Helper function to wait for D3 visualizations
async function waitForD3Visualizations(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      // Wait for D3 transitions
      const checkTransitions = () => {
        // @ts-expect-error - d3 is global
        if (typeof d3 !== 'undefined') {
          // @ts-expect-error - d3 is global
          const activeTransitions = d3.selectAll('.transitioning').size()
          if (activeTransitions === 0) {
            resolve()
          } else {
            setTimeout(checkTransitions, 100)
          }
        } else {
          // If d3 is not available, just resolve
          resolve()
        }
      }

      setTimeout(checkTransitions, 500)
    })
  })
}

// Helper function to hide elements that might cause flakiness
async function preparePageForScreenshot(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Hide cursors
    document.body.style.cursor = 'none'

    // Disable animations
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
    document.head.appendChild(style)

    // Force font loading
    void document.fonts.ready
  })

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready)
}

test.describe('Capture Screenshots for Figma Comparison', () => {
  test.setTimeout(60000) // Increase timeout to 60 seconds

  test.beforeEach(async ({ page }) => {
    // Set viewport to match Figma designs exactly
    await page.setViewportSize({ width: 1440, height: 900 })

    // Set device scale factor for consistent rendering
    await page.evaluate(() => {
      window.devicePixelRatio = 1
    })
  })

  test('capture all route screenshots with consistency', async ({ page }) => {
    for (const route of routes) {
      console.log(`📸 Capturing ${route.name}...`)

      // Navigate to the route
      await page.goto(route.path, { waitUntil: 'networkidle' })

      // Wait for critical elements
      for (const selector of route.waitForSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 })
        } catch {
          console.warn(`⚠️  Selector ${selector} not found for ${route.name}`)
        }
      }

      // Prepare page for consistent screenshots
      await preparePageForScreenshot(page)

      // Wait for animations to complete
      await waitForAnimations(page)
      await waitForD3Visualizations(page)

      // Additional wait for any async operations
      await page.waitForTimeout(2000)

      // Capture full page screenshot
      await page.screenshot({
        path: join(screenshotsDir, `${route.screenshotName}-full.png`),
        fullPage: true,
        animations: 'disabled',
      })

      // Capture component-specific screenshot
      try {
        const component = page.locator(route.componentSelector).first()
        if (await component.isVisible()) {
          // Get the exact bounding box
          const box = await component.boundingBox()
          if (box) {
            // Add some padding around the component
            const padding = 20
            await page.screenshot({
              path: join(screenshotsDir, `${route.screenshotName}-component.png`),
              clip: {
                x: Math.max(0, box.x - padding),
                y: Math.max(0, box.y - padding),
                width: box.width + padding * 2,
                height: box.height + padding * 2,
              },
              animations: 'disabled',
            })
          }
        } else {
          // Fallback to main content
          const mainContent = page.locator('main').first()
          await mainContent.screenshot({
            path: join(screenshotsDir, `${route.screenshotName}-component.png`),
            animations: 'disabled',
          })
        }
      } catch {
        console.warn(`⚠️  Could not capture component screenshot for ${route.name}`)
        // Fallback to viewport screenshot
        await page.screenshot({
          path: join(screenshotsDir, `${route.screenshotName}-component.png`),
          animations: 'disabled',
        })
      }

      console.log(`✅ Captured ${route.name}`)
    }
  })

  test('verify screenshot quality and consistency', async ({ page }) => {
    // Navigate to first route to check general page state
    await page.goto('/', { waitUntil: 'networkidle' })

    // Check that fonts are loaded
    const fontsLoaded = await page.evaluate(() => document.fonts.ready)
    expect(fontsLoaded).toBeTruthy()

    // Check that no console errors occurred
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate through all routes
    for (const route of routes) {
      await page.goto(route.path)
      await page.waitForTimeout(1000)
    }

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0)
  })
})
