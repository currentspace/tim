import { test, expect } from '@playwright/test'
import { readdir } from 'fs/promises'
import { join } from 'path'

// Map visualization names to their corresponding design images
const designImageMap: Record<string, string[]> = {
  'anticipated-tariff-impact': ['anticipated.png'],
  'country-exposure': ['exposure.png'],
  'tariff-rate-timeline': ['Screenshot 2025-07-21 at 12.06.07 PM.png'],
  'country-tariff-timeline': ['company_timeline.png'],
  'startup-universe': ['Screenshot 2025-07-21 at 12.05.50 PM.png'],
  // Add more mappings as needed based on the design images
}

test.describe('Visual regression tests', () => {
  test('list available design images', async () => {
    const designImages = await readdir('src/images')
    console.log('Available design images:')
    designImages.forEach((img) => console.log(`  - ${img}`))
  })

  for (const [vizName, designImages] of Object.entries(designImageMap)) {
    if (designImages.length > 0) {
      test(`compare ${vizName} with design`, async ({ page }) => {
        // This test assumes screenshots have already been captured
        // You can use Playwright's visual comparison features here
        // For now, we'll just log what would be compared

        console.log(`Would compare:`)
        console.log(`  Captured: screenshots/${vizName}-component.png`)
        console.log(`  Design: src/images/${designImages[0]}`)

        // Example of how to do visual comparison (requires reference images):
        // await expect(page).toHaveScreenshot(`${vizName}.png`, {
        //   maxDiffPixels: 100,
        //   threshold: 0.2
        // })
      })
    }
  }
})
