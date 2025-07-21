import { test, expect } from '@playwright/test'

test.describe('Navigation Menu', () => {
  test('capture navigation menu appearance', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForLoadState('networkidle')
    
    // Capture just the navigation
    const navigation = await page.locator('.top-navigation')
    await navigation.screenshot({ 
      path: 'navigation-menu/current-navigation-menu.png' 
    })
    
    // Test navigation functionality
    const navLinks = page.locator('.main-navigation .nav-link')
    const linkCount = await navLinks.count()
    console.log(`Found ${linkCount} navigation links`)
    
    // Check active state
    const activeLink = await page.locator('.main-navigation .nav-link.active')
    const activeText = await activeLink.textContent()
    console.log(`Active link: ${activeText}`)
    
    // Test navigation to each view
    const routes = [
      { path: '/', name: 'Anticipated Tariff' },
      { path: '/country-exposure', name: 'Country Exposure' },
      { path: '/company-timeline', name: 'Company Timeline' },
      { path: '/country-timeline', name: 'Country Timeline' },
      { path: '/startup-universe', name: 'Startup Universe' },
      { path: '/notifications', name: 'Notifications' }
    ]
    
    for (const route of routes) {
      await page.goto(`http://localhost:5173${route.path}`)
      await page.waitForLoadState('networkidle')
      
      // Check that the correct link is active
      const activeLink = await page.locator('.main-navigation .nav-link.active')
      const activeText = await activeLink.textContent()
      expect(activeText).toBe(route.name)
      
      // Check badge text
      const badge = await page.locator('.tab-badge')
      const badgeText = await badge.textContent()
      console.log(`Route: ${route.path}, Badge: ${badgeText}`)
    }
    
    // Capture full page with navigation
    await page.goto('http://localhost:5173')
    await page.screenshot({ 
      path: 'navigation-menu/full-page-with-nav.png',
      fullPage: false 
    })
  })
  
  test('check navigation responsiveness', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 375, height: 667, name: 'mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('http://localhost:5173')
      await page.waitForLoadState('networkidle')
      
      await page.screenshot({ 
        path: `navigation-menu/nav-${viewport.name}.png`,
        fullPage: false 
      })
    }
  })
})